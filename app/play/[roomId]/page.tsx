"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ROOMS, Room, Hotspot, InteractionState } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, HelpCircle, Timer, ArrowRight, Home, Loader2, Star, Lock, Eye, ZoomIn } from "lucide-react";
import confetti from "canvas-confetti";
import { useUser } from "@clerk/nextjs";
import { ACHIEVEMENT_BADGES, checkAchievement, calculateRank } from "@/lib/rewards";
import { UpgradeModal } from "@/components/ui/upgrade-modal";
import { PanoramicViewer } from "@/components/PanoramicViewer";

export default function GamePage() {
    useUser();
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    // Game State
    const [room, setRoom] = useState<Room | null>(null);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
    const [gameState, setGameState] = useState<"loading" | "playing" | "completed" | "error">("loading");
    const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
    const [inventory, setInventory] = useState<string[]>([]); // Collected item IDs
    const [hotspotStates, setHotspotStates] = useState<Record<string, InteractionState>>({});
    const [discoveredHotspots, setDiscoveredHotspots] = useState<Set<string>>(new Set());

    // Performance & Hints
    const [hintsUsed, setHintsUsed] = useState(0);
    const [hintIndex, setHintIndex] = useState(-1);
    const [visibleHints, setVisibleHints] = useState<string[]>([]);
    const [loadingHint, setLoadingHint] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsed, setElapsed] = useState(0);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [usageLimitInfo, setUsageLimitInfo] = useState({ tier: 'free', limit: 3 });
    const [, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            setStartTime(Date.now());
        });
    }, []);

    // -------------------------------------------------------------------------
    // 🎨 IMAGE GENERATION SYSTEM (Production Robust)
    // -------------------------------------------------------------------------
    const getImageUrl = (prompt: string, type: 'scene' | 'hotspot' | 'item' | 'panorama' = 'scene', index?: number) => {
        const baseUrl = "https://pollinations.ai/p/";
        const params = new URLSearchParams({
            nologo: 'true',
            model: 'flux',
        });

        // Use consistent seeds based on room and asset IDs to ensure the same image 
        // generates every time for the same room (caching behavior).
        const seedBase = `${roomId}`;

        if (type === 'panorama') {
            params.append('width', '2048');
            params.append('height', '1024');
            params.append('seed', `${seedBase}_pano`);
            const p = prompt || `${room?.imagePrompt || 'escape room'}, 360 degree equirectangular spherical panorama, high detailed 8k`;
            return `${baseUrl}${encodeURIComponent(p)}?${params.toString()}`;
        }

        if (type === 'item') {
            params.append('width', '800');
            params.append('height', '800');
            params.append('seed', `${seedBase}_item_${index || 0}`);
            return `${baseUrl}${encodeURIComponent(prompt)}?${params.toString()}`;
        }

        // Hotspots (16:9)
        params.append('width', '1280');
        params.append('height', '720');
        params.append('seed', `${seedBase}_${type}_${index || 0}`);
        return `${baseUrl}${encodeURIComponent(prompt)}?${params.toString()}`;
    };

    // -------------------------------------------------------------------------
    // 🧩 GAME LOGIC & STATE MANAGEMENT
    // -------------------------------------------------------------------------

    // Reset puzzle-specific state when moving to next puzzle
    useEffect(() => {
        startTransition(() => {
            setHintIndex(-1);
            setVisibleHints([]);
            setFailedAttempts(0);
            setFeedback(null);
            setInputValue("");
        });
    }, [currentPuzzleIndex]);

    // Load Room Data
    useEffect(() => {
        const loadRoom = async () => {
            // 1. Try Local Static Data
            const foundRoom = ROOMS.find((r) => r.id === roomId);
            if (foundRoom) {
                setRoom(foundRoom);
                setGameState("playing");
                return;
            }

            // 2. Try Generated/User Data
            try {
                const res = await fetch("/api/user-progress");
                if (res.ok) {
                    const data = await res.json();
                    const genRoom = data.generatedRooms?.find((r: { id: string, data: Room }) => r.id === roomId);
                    if (genRoom) {
                        setRoom({ ...genRoom.data, id: genRoom.id });
                        setGameState("playing");
                        return;
                    }
                }
            } catch (e) {
                console.error("Failed to load generated room", e);
            }

            setGameState("error");
        };

        if (roomId) loadRoom();
    }, [roomId]);

    // Timer Interval
    useEffect(() => {
        if (gameState !== "playing") return;
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [gameState, startTime]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Answer Validation
    const validateAnswer = (input: string) => {
        if (!currentPuzzle) return false;

        const normalize = (s: string) => s?.toLowerCase().trim().replace(/[^a-z0-9.\-]/g, '') || "";
        const target = Array.isArray(currentPuzzle.answer) ? currentPuzzle.answer : [currentPuzzle.answer];
        const normalizedInput = normalize(input);

        // Match?
        if (target.some(ans => normalize(ans) === normalizedInput)) return true;

        // Numeric approximation?
        const inputNum = parseFloat(input);
        if (!isNaN(inputNum)) {
            return target.some(ans => {
                const ansNum = parseFloat(String(ans));
                return !isNaN(ansNum) && Math.abs(inputNum - ansNum) < 0.001;
            });
        }
        return false;
    };

    // Submission Handler
    const handleInputSubmit = async (valOverride?: string) => {
        if (!room) return;
        const answerToCheck = valOverride !== undefined ? valOverride : inputValue;

        if (validateAnswer(answerToCheck)) {
            setFeedback("success");

            // 🎉 Success Effects
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#a855f7', '#ffffff']
            });

            // Is Game Over?
            const isLastPuzzle = currentPuzzleIndex === room.puzzles.length - 1;

            if (isLastPuzzle) {
                const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
                const rank = calculateRank(hintsUsed, timeSeconds, 600);
                setGameState("completed");

                // --- SAVE PROGRESS (Simplified) ---
                try {
                    await fetch("/api/user-progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ roomId: room.id, stars: rank === 'S' ? 3 : 2, timeSeconds, rank })
                    });

                    // Track usage limit
                    const trackRes = await fetch("/api/play/track", {
                        method: "POST",
                        body: JSON.stringify({ roomId: room.id })
                    });
                    if (trackRes.status === 403) {
                        const data = await trackRes.json();
                        setUsageLimitInfo({ tier: data.tier, limit: data.limit });
                        setShowUpgradeModal(true);
                    }
                } catch (e) { console.error("Save failed", e); }

            } else {
                // Next Puzzle
                setTimeout(() => {
                    setCurrentPuzzleIndex(prev => prev + 1);
                }, 1500);
            }
        } else {
            setFeedback("error");
            setFailedAttempts(prev => prev + 1);
            setTimeout(() => setFeedback(null), 2000);
        }
    };

    // Hotspot Logic
    const handleHotspotInteraction = (hotspot: Hotspot) => {
        setDiscoveredHotspots(prev => new Set([...prev, hotspot.id]));
        setSelectedHotspot(hotspot);
    };

    // Helper to get current puzzle safely
    const currentPuzzle = room?.puzzles?.[currentPuzzleIndex];

    // Hint Logic
    const requestHint = async () => {
        if (!currentPuzzle) return;
        const roomHints = currentPuzzle.hints || [];

        // Local Hints First
        if (hintIndex + 1 < roomHints.length) {
            setHintIndex(p => p + 1);
            setVisibleHints(p => [...p, roomHints[hintIndex + 1]]);
            setHintsUsed(h => h + 1);
            return;
        }

        // Then AI Hint
        setLoadingHint(true);
        try {
            const res = await fetch("/api/ai/hint", {
                method: "POST",
                body: JSON.stringify({ puzzle: currentPuzzle.question, attempts: [inputValue] })
            });
            const data = await res.json();
            if (data.hint) {
                setVisibleHints(p => [...p, `AI: ${data.hint}`]);
                setHintsUsed(h => h + 1);
            }
        } catch {
            setVisibleHints(p => [...p, "System Offline. Try observing the room details."]);
        }
        setLoadingHint(false);
    };

    // -------------------------------------------------------------------------
    // 🖥️ RENDERING
    // -------------------------------------------------------------------------

    if (gameState === 'error') {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 gap-6">
                <AlertCircle className="w-16 h-16 animate-pulse" />
                <h1 className="text-2xl font-bold font-mono tracking-widest">CRITICAL SYSTEM FAILURE</h1>
                <p>Unable to load simulation data. Sector quarantined.</p>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="border-red-500/50 text-red-400">ABORT MISSION</Button>
            </div>
        );
    }

    if (!room || !currentPuzzle || gameState === 'loading') {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                <div className="text-cyan-500 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
                    Initializing Neural Link...
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-zinc-950 flex flex-col overflow-hidden relative font-sans text-zinc-100 selection:bg-cyan-500/30">

            {/* --- 1. HEADER (HUD) --- */}
            <header className="h-16 shrink-0 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                        <Home className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <h1 className="text-sm font-bold uppercase tracking-widest text-cyan-100 hidden md:block">
                        {room.title} <span className="text-zinc-500 mx-2">//</span> Sector {currentPuzzleIndex + 1}/{room.puzzles.length}
                    </h1>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Timer className="w-4 h-4" />
                        <span className="text-lg font-bold">{formatTime(elapsed)}</span>
                    </div>
                </div>
            </header>

            {/* --- 2. MAIN LAYOUT (Split View) --- */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                {/* --- LEFT / TOP: IMMERSIVE VIEW (60%) --- */}
                <div className="flex-1 lg:flex-[1.4] relative bg-black group overflow-hidden">
                    {/* 360 Viewer */}
                    <div className="absolute inset-0">
                        <PanoramicViewer
                            imageUrl={getImageUrl(room.panoramicImage, 'panorama')}
                            hotspots={room.hotspots ? Object.entries(room.hotspots).flatMap(([idx, hotspots]) => {
                                const baseAngle = [0, 270, 90, 180][parseInt(idx)] || 0;
                                return hotspots.map(hs => ({
                                    id: hs.id,
                                    angle: (baseAngle + (hs.x - 50) * 0.8 + 360) % 360,
                                    elevation: (50 - hs.y) * 0.6,
                                    label: hs.label,
                                    onClick: () => handleHotspotInteraction(hs),
                                    isSubtle: hs.isSubtle,
                                    isDiscovered: discoveredHotspots.has(hs.id)
                                }));
                            }) : []}
                            effects={room.atmosphereEffects}
                        />
                    </div>

                    {/* Overlay: Room Description */}
                    <div className="absolute top-6 left-6 max-w-md pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border-l-2 border-cyan-500">
                            <p className="text-sm text-zinc-200 italic leading-relaxed drop-shadow-md">
                                {room.description}
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-6 pointer-events-none">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                            <Eye className="w-3 h-3" />
                            <span>Immersive Feed Active</span>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT / BOTTOM: MISSION INTERFACE (40%) --- */}
                <div className="h-[45vh] lg:h-auto lg:w-[480px] shrink-0 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col z-20 shadow-2xl">

                    {/* A. Evidence / Item Visual */}
                    {currentPuzzle.itemImagePrompt && (
                        <div className="h-48 shrink-0 relative bg-zinc-950 border-b border-white/5 overflow-hidden group">
                            <div className="absolute top-3 left-3 z-10 flex gap-2">
                                <span className="bg-cyan-950/80 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-cyan-500/20">
                                    Evidence #{currentPuzzleIndex + 1}
                                </span>
                            </div>

                            {/* Using unoptimized Next/Image for external AI assets or robust img tag */}
                            <div className="w-full h-full flex items-center justify-center p-4">
                                <img
                                    src={getImageUrl(currentPuzzle.itemImagePrompt, 'item', currentPuzzleIndex)}
                                    alt="Puzzle Evidence"
                                    className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    )}

                    {/* B. Question & Interaction Area */}
                    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-6 relative">
                        {/* Question */}
                        <div className="mb-8">
                            <h2 className="text-zinc-400 text-xs font-mono uppercase mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                                Awaiting Input
                            </h2>
                            <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                                {currentPuzzle.question}
                            </p>
                        </div>

                        {/* Answers / Input */}
                        <div className="space-y-4">
                            {currentPuzzle.type === 'choice' && currentPuzzle.options ? (
                                <div className="grid gap-3">
                                    {currentPuzzle.options.map((opt, idx) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleInputSubmit(opt)}
                                            className="w-full text-left p-4 rounded-lg bg-zinc-800/50 border border-white/5 hover:bg-cyan-950/30 hover:border-cyan-500/50 hover:text-cyan-100 transition-all group flex items-start gap-4 active:scale-[0.99]"
                                        >
                                            <div className="w-6 h-6 shrink-0 rounded-full border-2 border-zinc-600 group-hover:border-cyan-500 flex items-center justify-center text-[10px] text-zinc-400 font-bold group-hover:text-cyan-400 mt-0.5">
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="text-sm font-medium leading-snug">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                        placeholder="Enter decryption key..."
                                        className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors"
                                        autoFocus
                                    />
                                    <Button onClick={() => handleInputSubmit()} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold h-12 uppercase tracking-widest">
                                        Submit Data
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Feedback States */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`mt-4 p-4 rounded-lg border flex items-center gap-3 ${feedback === 'success' ? 'bg-green-950/50 border-green-500/30 text-green-400' : 'bg-red-950/50 border-red-500/30 text-red-400'}`}
                                >
                                    {feedback === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <span className="font-bold text-sm uppercase">
                                        {feedback === 'success' ? "Access Granted" : "Access Denied"}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hints Area */}
                        <div className="mt-8 border-t border-white/5 pt-6">
                            <AnimatePresence mode="popLayout">
                                {visibleHints.map((hint, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-3 text-xs text-purple-300 bg-purple-950/20 border border-purple-500/20 p-3 rounded flex gap-2"
                                    >
                                        <HelpCircle className="w-4 h-4 shrink-0" />
                                        <span>{hint}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={requestHint}
                                disabled={loadingHint}
                                className="w-full text-zinc-500 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2"
                            >
                                {loadingHint ? <Loader2 className="w-3 h-3 animate-spin" /> : <HelpCircle className="w-3 h-3" />}
                                <span className="text-xs uppercase tracking-wider">
                                    {visibleHints.length === 0 ? "Request Output Hint" : "Analyze Further"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. MODALS --- */}

            {/* Hotspot Inspection */}
            <AnimatePresence>
                {selectedHotspot && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedHotspot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="aspect-video relative bg-black">
                                <img
                                    src={getImageUrl(selectedHotspot.imagePrompt, 'hotspot', selectedHotspot.id.length)}
                                    className="w-full h-full object-cover"
                                    alt="Inspection"
                                />
                                <button
                                    onClick={() => setSelectedHotspot(null)}
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-cyan-600/80 text-white rounded-full p-2 transition-colors border border-white/10"
                                >
                                    <Lock className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                        {selectedHotspot.interactionType}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-white mb-2">{selectedHotspot.label}</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm md:text-base border-l-2 border-cyan-500 pl-4">
                                    {selectedHotspot.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success / Game Over Modal (Handled in main layout via conditional rendering if needed, or simple redirect) */}
            {gameState === 'completed' && (
                <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
                    <Card className="max-w-md w-full bg-zinc-900 border-cyan-500 shadow-2xl shadow-cyan-900/50">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase tracking-tighter">
                                Sector Cleared
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-6 pt-6">
                            <div className="flex justify-center gap-2">
                                <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                                <Star className={`w-10 h-10 ${calculateRank(hintsUsed, (elapsed), 600) === 'S' || calculateRank(hintsUsed, (elapsed), 600) === 'A' ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} transition-all`} />
                                <Star className={`w-10 h-10 ${calculateRank(hintsUsed, (elapsed), 600) === 'S' ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} transition-all`} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm font-mono text-zinc-400">
                                <div className="bg-black/40 p-3 rounded">
                                    <div className="text-xs text-zinc-500 uppercase">Time</div>
                                    <div className="text-white font-bold text-lg">{formatTime(elapsed)}</div>
                                </div>
                                <div className="bg-black/40 p-3 rounded">
                                    <div className="text-xs text-zinc-500 uppercase">Hints</div>
                                    <div className="text-white font-bold text-lg">{hintsUsed}</div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => router.push('/dashboard')} className="w-full bg-white text-black hover:bg-cyan-50 font-bold uppercase tracking-widest h-12">
                                New Mission
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                tier={usageLimitInfo.tier}
                limit={usageLimitInfo.limit}
            />
        </div>
    );
}
