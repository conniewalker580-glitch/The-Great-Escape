"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ROOMS, Room, Puzzle, Hotspot, InteractionState } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, HelpCircle, Timer, ArrowRight, Home, Loader2, Star, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { useUser } from "@clerk/nextjs";
import { ACHIEVEMENT_BADGES, checkAchievement, calculateRank } from "@/lib/rewards";
import { PanoramicViewer } from "@/components/PanoramicViewer";
import { UpgradeModal } from "@/components/ui/upgrade-modal";

export default function GamePage() {
    const { user } = useUser();
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    // Game State
    const [room, setRoom] = useState<Room | null>(null);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0); // 0: Front, 1: Left, 2: Right, 3: Back
    const [inputValue, setInputValue] = useState("");
    const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
    const [gameState, setGameState] = useState<"loading" | "playing" | "completed" | "error">("loading");
    const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
    const [inventory, setInventory] = useState<string[]>([]); // Collected item IDs
    const [hotspotStates, setHotspotStates] = useState<Record<string, InteractionState>>({}); // Track interaction state per hotspot
    const [discoveredHotspots, setDiscoveredHotspots] = useState<Set<string>>(new Set()); // Hotspots user has found

    // Performance Tracking
    const [hintsUsed, setHintsUsed] = useState(0);
    const [hintIndex, setHintIndex] = useState(-1);
    const [visibleHints, setVisibleHints] = useState<string[]>([]);
    const [loadingHint, setLoadingHint] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsed, setElapsed] = useState(0);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [usageLimitInfo, setUsageLimitInfo] = useState({ tier: 'free', limit: 3 });
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            setStartTime(Date.now());
        });
    }, []);

    const getImageUrl = (prompt: string, type: 'scene' | 'hotspot' | 'item' | 'panorama' = 'scene', index?: number) => {
        // Try panoramic image first if available
        if (type === 'panorama') {
            return `/rooms/${roomId}-panorama.webp`;
        }
        // Try local image first if it's a scene
        if (type === 'scene' && typeof index === 'number') {
            return `/rooms/${roomId}-${index}.webp`;
        }
        if (type === 'item') {
            return `/rooms/${roomId}-item-${index || 0}.webp`;
        }
        if (type === 'hotspot') {
            return `/rooms/${roomId}-hotspot-${index || 0}.webp`;
        }

        // Fallback to Pollinations AI
        return `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1280&height=720&seed=${roomId}&nologo=true`;
    };

    const [imageLoaded, setImageLoaded] = useState(false);
    useEffect(() => {
        startTransition(() => {
            setImageLoaded(false);
        });
    }, [currentSceneIndex, currentPuzzleIndex]);

    const nextScene = () => setCurrentSceneIndex(prev => (prev + 1) % 4);
    const prevScene = () => setCurrentSceneIndex(prev => (prev - 1 + 4) % 4);

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

    // Load Room Logic
    useEffect(() => {
        const loadRoom = async () => {
            const foundRoom = ROOMS.find((r) => r.id === roomId);
            if (foundRoom) {
                setRoom(foundRoom);
                setGameState("playing");
                return;
            }

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

    // Timer Logic
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

    if (gameState === 'error') {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 gap-4">
                <AlertCircle className="w-12 h-12" />
                <p className="text-xl font-bold">Simulation Desync: Sector Not Found</p>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="border-red-500/50 text-red-400">Return to Dashboard</Button>
            </div>
        );
    }

    if (!room || gameState === 'loading') {
        return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-mono animate-pulse uppercase tracking-widest">Initializing Environment...</div>;
    }

    const currentPuzzle = room.puzzles[currentPuzzleIndex];
    const scenes = (room.multiverseScenes && room.multiverseScenes.length === 4)
        ? room.multiverseScenes
        : [room.imagePrompt, room.imagePrompt, room.imagePrompt, room.imagePrompt];
    const currentScenePrompt = scenes[currentSceneIndex];

    const validateAnswer = (input: string) => {
        // Enhanced normalization for better answer matching
        const normalize = (s: string) => {
            return s?.toLowerCase()
                .trim()
                .replace(/[^a-z0-9.\-]/g, '') // Keep dots and dashes for morse/special codes
                || "";
        };

        const target = Array.isArray(currentPuzzle.answer) ? currentPuzzle.answer : [currentPuzzle.answer];
        const normalizedInput = normalize(input);

        // Check exact normalized match
        if (target.some(ans => normalize(ans) === normalizedInput)) {
            return true;
        }

        // For numeric answers, also check if they're mathematically equal
        const inputNum = parseFloat(input);
        if (!isNaN(inputNum)) {
            return target.some(ans => {
                const ansNum = parseFloat(String(ans));
                return !isNaN(ansNum) && Math.abs(inputNum - ansNum) < 0.001;
            });
        }

        return false;
    };

    const handleInputSubmit = async () => {
        if (!room) return;

        if (validateAnswer(inputValue)) {
            setFeedback("success");

            // Celebration
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#a855f7', '#10b981']
            });

            const isLastPuzzle = currentPuzzleIndex === room.puzzles.length - 1;

            if (isLastPuzzle) {
                const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
                const rank = calculateRank(hintsUsed, timeSeconds, 600); // 10 min target

                setGameState("completed");

                // Update Rewards and Achievements locally
                const storedStats = localStorage.getItem('player_stats');
                const playerStats = storedStats ? JSON.parse(storedStats) : {
                    roomsCompleted: 0,
                    perfectScores: 0,
                    speedRuns: 0,
                    noHintRuns: 0,
                    dailyStreak: 1
                };

                playerStats.roomsCompleted += 1;
                if (rank === 'S') playerStats.perfectScores += 1;
                if (timeSeconds < 180) playerStats.speedRuns += 1;
                if (hintsUsed === 0) playerStats.noHintRuns += 1;

                const currentAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
                const newAchievements: string[] = [];

                ACHIEVEMENT_BADGES.forEach(badge => {
                    if (!currentAchievements.includes(badge.id)) {
                        if (checkAchievement(badge, playerStats)) {
                            newAchievements.push(badge.id);
                        }
                    }
                });

                localStorage.setItem('player_stats', JSON.stringify(playerStats));
                localStorage.setItem('achievements', JSON.stringify([...currentAchievements, ...newAchievements]));

                // Track progress and usage
                try {
                    // Update user progress (stars, rank)
                    const stars = rank === 'S' ? 3 : (rank === 'A' ? 2 : 1);
                    await fetch("/api/user-progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            roomId: room.id,
                            stars,
                            timeSeconds,
                            rank
                        })
                    });

                    // Track room usage for subscription limits
                    const trackRes = await fetch("/api/play/track", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ roomId: room.id })
                    });

                    if (trackRes.status === 403) {
                        const data = await trackRes.json();
                        setUsageLimitInfo({ tier: data.tier, limit: data.limit });
                        setShowUpgradeModal(true);
                    }
                } catch (e) {
                    console.error("Failed to sync progress or track usage", e);
                }

            } else {
                // Advance to next puzzle
                setTimeout(() => {
                    setCurrentPuzzleIndex(prev => prev + 1);
                }, 1000);
            }
        } else {
            setFeedback("error");
            setFailedAttempts(prev => prev + 1);
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const handleHotspotInteraction = (hotspot: Hotspot) => {
        // Mark as discovered
        setDiscoveredHotspots(prev => new Set([...prev, hotspot.id]));

        // Check if item is required
        if (hotspot.requiresItem && !inventory.includes(hotspot.requiresItem)) {
            setSelectedHotspot({
                ...hotspot,
                description: `This ${hotspot.label} appears to be locked or requires something to interact with it.`
            });
            return;
        }

        // Handle interaction based on type
        const currentState = hotspotStates[hotspot.id] || 'idle';

        if (hotspot.interactionType === 'pickup' && currentState !== 'collected') {
            // Add to inventory
            if (hotspot.revealsItem) {
                setInventory(prev => [...prev, hotspot.revealsItem!]);
            }
            setHotspotStates(prev => ({ ...prev, [hotspot.id]: 'collected' }));
        } else if (hotspot.interactionType === 'open' && currentState !== 'interacted') {
            // Open the object and potentially reveal an item
            setHotspotStates(prev => ({ ...prev, [hotspot.id]: 'interacted' }));
            if (hotspot.revealsItem) {
                setInventory(prev => [...prev, hotspot.revealsItem!]);
            }
        } else {
            // Just mark as interacted for inspect/examine/reveal/rotate
            setHotspotStates(prev => ({ ...prev, [hotspot.id]: 'interacted' }));
        }

        // Show the hotspot modal
        setSelectedHotspot(hotspot);
    };

    const requestHint = async () => {
        if (room.difficulty === "Easy") {
            setVisibleHints(["This sector is rated EASY. No hints are required for this level of clearance."]);
            return;
        }

        if (room.difficulty === "Medium" && failedAttempts === 0) {
            setVisibleHints(["Hint protocols locked until at least one failure is recorded."]);
            return;
        }

        if ((room.difficulty === "Hard" || room.difficulty === "Expert") && hintsUsed >= 1) {
            setVisibleHints(prev => [...prev, "Critical limit reached. No further hints available for this difficulty level."]);
            return;
        }

        const roomHints = currentPuzzle.hints || [];
        if (hintIndex + 1 < roomHints.length) {
            const nextHint = roomHints[hintIndex + 1];
            setHintIndex(prev => prev + 1);
            setVisibleHints(prev => [...prev, nextHint]);
            setHintsUsed(h => h + 1);
            return;
        }

        setLoadingHint(true);
        try {
            const res = await fetch("/api/ai/hint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ puzzle: currentPuzzle.question, attempts: [inputValue] })
            });
            const data = await res.json();
            if (data.hint) {
                setVisibleHints(prev => [...prev, `AI ASSIST: ${data.hint}`]);
                setHintsUsed(h => h + 1);
            } else {
                setVisibleHints(prev => [...prev, "No further hints available for this pattern."]);
            }
        } catch (e) {
            console.error(e);
            setVisibleHints(prev => [...prev, "Uplink failure. No additional hints possible."]);
        }
        setLoadingHint(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-black" />

            {/* AMBIENT BACKGROUND (Blurred Scene) */}
            <div
                className="absolute inset-0 opacity-40 blur-3xl scale-110 pointer-events-none transition-all duration-1000"
                style={{
                    backgroundImage: `url(${getImageUrl(currentScenePrompt, 'scene', currentSceneIndex)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    minWidth: '100vw'
                }}
            />

            <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hover:text-cyan-400 transition-colors"><Home className="w-5 h-5" /></Link>
                    <span className="font-bold tracking-widest text-cyan-100 uppercase text-sm">{room.title}</span>
                </div>
                <div className="flex items-center gap-6 font-mono text-xs">
                    {/* Inventory Display */}
                    {inventory.length > 0 && (
                        <div className="flex items-center gap-2 text-purple-400 bg-purple-950/30 px-3 py-1 rounded border border-purple-500/20">
                            <span className="text-[10px] uppercase tracking-wider">Inventory:</span>
                            <span className="font-bold">{inventory.length}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-cyan-500">
                        <Timer className="w-4 h-4" /> {formatTime(elapsed)}
                    </div>
                    <div className={`flex items-center gap-2 ${hintsUsed > 0 ? 'text-amber-500' : 'text-purple-500'}`}>
                        <Star className={`w-4 h-4 ${hintsUsed === 0 ? 'fill-current' : ''}`} />
                        <span>Rank: {hintsUsed === 0 ? 'S' : (hintsUsed < 3 ? 'A' : 'B')}</span>
                    </div>
                </div>
            </header>

            {gameState === 'completed' ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full z-10 text-center">
                    <Card className="bg-black/80 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <CardHeader>
                            <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase">
                                Mission Accomplished
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3].map((star) => (
                                    <motion.div
                                        key={star}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 * star, type: "spring" }}
                                    >
                                        <Star className={`w-8 h-8 ${star <= (hintsUsed === 0 ? 3 : (hintsUsed <= 2 ? 2 : 1)) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'}`} />
                                    </motion.div>
                                ))}
                            </div>
                            <div className="space-y-2 text-sm text-zinc-400">
                                <p>Time: <span className="text-white font-mono">{formatTime(elapsed)}</span></p>
                                <p>Hints Used: <span className="text-white font-mono">{hintsUsed}</span></p>
                            </div>
                            <div className="p-4 bg-cyan-950/30 rounded border border-cyan-500/20 text-xs text-cyan-300">
                                DATABASE UPDATED: Next Sector Unlocked.
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button onClick={() => router.push('/dashboard')} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold">
                                Return to Mission Control
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ) : (
                <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl z-10 mt-12 h-[80vh]">
                    {/* Visual Scene / 360 Walkthrough */}
                    <motion.div key={`${currentPuzzle.id}-scene`} className="flex-1 flex flex-col relative group min-h-[400px]">
                        <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 min-h-[300px]">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentSceneIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    src={getImageUrl(currentScenePrompt, 'scene', currentSceneIndex)}
                                    alt={`Room Scene: ${currentScenePrompt}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={(e) => {
                                        // Fallback if local image fails
                                        const target = e.target as HTMLImageElement;
                                        if (!target.src.includes('pollinations.ai')) {
                                            target.src = `https://pollinations.ai/p/${encodeURIComponent(currentScenePrompt)}?width=1280&height=720&seed=${roomId}&nologo=true`;
                                        }
                                    }}
                                />
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Hotspots Layer */}
                            <div className="absolute inset-0 z-20 pointer-events-none">
                                {room.hotspots?.[currentSceneIndex]?.map((hs) => {
                                    const isDiscovered = discoveredHotspots.has(hs.id);
                                    const isCollected = hotspotStates[hs.id] === 'collected';
                                    const isSubtle = hs.isSubtle !== false;
                                    if (isCollected) return null;
                                    return (
                                        <motion.button
                                            key={hs.id}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: isSubtle && !isDiscovered ? 0.3 : 1 }}
                                            whileHover={{ scale: 1.2, opacity: 1 }}
                                            onClick={() => handleHotspotInteraction(hs)}
                                            className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center pointer-events-auto group/hs"
                                            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                                        >
                                            {(!isSubtle || isDiscovered) && (
                                                <div className="absolute inset-0 bg-cyan-500/30 rounded-full animate-ping" />
                                            )}
                                            <div className={`relative w-3 h-3 rounded-full border-2 border-white shadow-[0_0_10px_rgba(6,182,212,0.8)] ${isSubtle && !isDiscovered ? 'bg-white/20' : 'bg-cyan-400'
                                                }`} />

                                            {/* Tooltip on Hover */}
                                            <div className="absolute bottom-full mb-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-cyan-100 whitespace-nowrap opacity-0 group-hover/hs:opacity-100 transition-opacity border border-white/10 uppercase tracking-widest pointer-events-none">
                                                {hs.interactionType}: {hs.label}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Scene HUD */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                            {/* Navigation Arrows */}
                            <button onClick={prevScene} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all opacity-0 group-hover:opacity-100 z-20">
                                <ArrowRight className="w-6 h-6 rotate-180" />
                            </button>
                            <button onClick={nextScene} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all opacity-0 group-hover:opacity-100 z-20">
                                <ArrowRight className="w-6 h-6" />
                            </button>

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className={`h-1 w-8 rounded-full transition-all ${i === currentSceneIndex ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/20'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
                                        {["Front", "Left", "Right", "Back"][currentSceneIndex]} Perspective
                                    </span>
                                </div>
                                <p className="text-white/90 text-sm font-light leading-relaxed max-w-2xl italic">
                                    {room.description}
                                </p>
                            </div>
                        </div>

                        {/* Puzzle Item Close-up */}
                        <div className="mt-4 flex gap-4">
                            <Card className="flex-1 bg-zinc-900/50 border-white/5 backdrop-blur-md">
                                <CardHeader className="py-3 px-4"><CardTitle className="text-[10px] uppercase text-zinc-500 tracking-widest flex justify-between">
                                    <span>Puzzle Data</span>
                                    <span>#{currentPuzzleIndex + 1}</span>
                                </CardTitle></CardHeader>
                                <CardContent className="py-2 px-4">
                                    <p className="text-base text-cyan-50 font-medium">{currentPuzzle.question}</p>
                                </CardContent>
                            </Card>
                            {currentPuzzle.itemImagePrompt && (
                                <div className="w-32 aspect-square rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-zoom-in hover:scale-105 transition-transform bg-zinc-900 shrink-0">
                                    <img
                                        src={getImageUrl(currentPuzzle.itemImagePrompt, 'item', currentPuzzleIndex)}
                                        alt="Target Item"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (!target.src.includes('pollinations.ai')) {
                                                target.src = `https://pollinations.ai/p/${encodeURIComponent(currentPuzzle.itemImagePrompt || '')}?width=1280&height=720&seed=${roomId}&nologo=true`;
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Interaction */}
                    <motion.div key={`${currentPuzzle.id}-input`} className="w-full md:w-[400px] h-full flex flex-col">
                        <Card className="bg-black/60 backdrop-blur-xl border-cyan-500/20 flex-1 flex flex-col shadow-2xl overflow-hidden">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="flex justify-between">
                                    <span className="text-cyan-400 text-sm uppercase tracking-wider">Interface</span>
                                    {feedback === 'success' && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct</span>}
                                    {feedback === 'error' && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Invalid</span>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                {currentPuzzle.type === 'choice' ? (
                                    <div className="grid gap-3 mb-6">
                                        {currentPuzzle.options?.map(opt => (
                                            <Button
                                                key={opt} variant="outline"
                                                className="justify-start h-auto py-4 text-left border-zinc-700 hover:border-cyan-500 hover:bg-cyan-950/30 hover:text-cyan-400"
                                                onClick={() => { setInputValue(opt); setTimeout(handleInputSubmit, 100); }}
                                            >
                                                <div className="w-6 h-6 rounded-full border border-zinc-600 mr-3 flex items-center justify-center text-[10px] text-zinc-500 group-hover:border-cyan-500"></div>
                                                {opt}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4 mb-6">
                                        <input
                                            autoFocus
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-4 text-lg focus:border-cyan-500 focus:outline-none text-white font-mono"
                                            placeholder="Type answer..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                        />
                                        <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold h-12" onClick={handleInputSubmit}>Submit Answer</Button>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {visibleHints.length > 0 && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 mt-4 border-t border-white/5 pt-4">
                                            {visibleHints.map((hint, idx) => (
                                                <motion.div key={idx} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} className="flex gap-2 text-xs text-purple-300 bg-purple-950/20 p-3 rounded border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                                                    <HelpCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                    <p>{hint}</p>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 p-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={requestHint}
                                    disabled={loadingHint}
                                    className="w-full text-zinc-500 hover:text-purple-400"
                                >
                                    {loadingHint ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <HelpCircle className="w-4 h-4 mr-2" />}
                                    {loadingHint ? "Analyzing Pattern..." : (visibleHints.length === 0 ? "Request Hint" : "Next Hint")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* Hotspot Inspection Modal */}
            <AnimatePresence>
                {selectedHotspot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={() => setSelectedHotspot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-zinc-900 border border-cyan-500/30 rounded-2xl overflow-hidden max-w-2xl w-full shadow-[0_0_50px_rgba(6,182,212,0.2)]"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <div className="relative aspect-video bg-black">
                                {selectedHotspot.imagePrompt ? (
                                    <img
                                        src={getImageUrl(selectedHotspot.imagePrompt, 'hotspot', parseInt(selectedHotspot.id.split('_')[1]))}
                                        alt={selectedHotspot.label}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (selectedHotspot.imagePrompt && !target.src.includes('pollinations.ai')) {
                                                target.src = `https://pollinations.ai/p/${encodeURIComponent(selectedHotspot.imagePrompt)}?width=1280&height=720&seed=${roomId}&nologo=true`;
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                        <HelpCircle className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedHotspot(null)} className="text-white hover:bg-white/10">
                                        <Lock className="w-5 h-5 rotate-45" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">
                                        {selectedHotspot.interactionType}
                                    </span>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{selectedHotspot.label}</h3>
                                </div>
                                <p className="text-zinc-400 leading-relaxed italic border-l-2 border-cyan-500/30 pl-4 py-1">
                                    &quot;{selectedHotspot.description}&quot;
                                </p>
                                <div className="mt-8 flex justify-end">
                                    <Button onClick={() => setSelectedHotspot(null)} className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest text-xs px-8">
                                        Close Data Node
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                tier={usageLimitInfo.tier}
                limit={usageLimitInfo.limit}
            />
        </div>
    );
}
