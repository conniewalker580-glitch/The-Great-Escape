"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROOMS, Room, Puzzle } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, HelpCircle, Timer, ArrowRight, Home, Loader2, Star, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import confetti from 'canvas-confetti';
import { useUser } from "@clerk/nextjs";

export default function GamePage() {
    const { user } = useUser();
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;

    // Game State
    const [room, setRoom] = useState<Room | null>(null);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
    const [gameState, setGameState] = useState<"loading" | "playing" | "completed" | "error">("loading");

    // Performance Tracking
    const [hintsUsed, setHintsUsed] = useState(0);
    const [loadingHint, setLoadingHint] = useState(false);
    const [startTime] = useState(Date.now());
    const [elapsed, setElapsed] = useState(0);

    // Load Room Logic
    useEffect(() => {
        const loadRoom = async () => {
            // 1. Check Static Rooms
            const foundRoom = ROOMS.find((r) => r.id === roomId);
            if (foundRoom) {
                setRoom(foundRoom);
                setGameState("playing");
                return;
            }

            // 2. Check Generated Rooms (AI)
            try {
                const res = await fetch("/api/user-progress");
                if (res.ok) {
                    const data = await res.json();
                    const genRoom = data.generatedRooms?.find((r: any) => r.id === roomId);
                    if (genRoom) {
                        // Transform DB shape to Room shape if needed
                        setRoom({ ...genRoom.data, id: genRoom.id });
                        setGameState("playing");
                        return;
                    }
                }
            } catch (e) {
                console.error("Failed to load generated room", e);
            }

            // 3. 404
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

    if (!room || gameState === 'loading') {
        return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500">Initializing Environment...</div>;
    }

    const currentPuzzle = room.puzzles[currentPuzzleIndex];

    const validateAnswer = (input: string) => {
        const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        const target = Array.isArray(currentPuzzle.answer) ? currentPuzzle.answer : [currentPuzzle.answer];

        return target.some(ans => normalize(ans) === normalize(input));
    };

    const handleInputSubmit = async () => {
        if (validateAnswer(inputValue)) {
            // SUCCESS LOGIC
            setFeedback("success");
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#06b6d4', '#a855f7'] }); // Cyan & Purple

            setTimeout(async () => {
                const nextIndex = currentPuzzleIndex + 1;
                if (nextIndex >= room.puzzles.length) {
                    // ROOM COMPLETE
                    setGameState("completed");
                    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

                    // Save Progress with Stars Calculation
                    // 3 Stars = 0 hints, 2 Stars = 1-2 hints, 1 Star = 3+ hints
                    const stars = hintsUsed === 0 ? 3 : (hintsUsed <= 2 ? 2 : 1);

                    await fetch("/api/user-progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ roomId: room.id, stars })
                    });

                } else {
                    setFeedback(null);
                    setInputValue("");
                    setCurrentPuzzleIndex(nextIndex);
                }
            }, 1000);
        } else {
            // FAILURE LOGIC
            setFeedback("error");
            // Shake effect could go here
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const requestHint = async () => {
        if (hintsUsed >= 3 && false) { // Logic to check premium could go here in future
            alert("Weekly hint limit reached. Upgrade to Pro for unlimited.");
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
                alert(`AI ASSIST: ${data.hint}`); // In production, replace with nice modal
                setHintsUsed(h => h + 1);
            }
        } catch (e) { console.error(e); }
        setLoadingHint(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black pointer-events-none" />

            {/* HUD */}
            <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hover:text-cyan-400 transition-colors"><Home className="w-5 h-5" /></Link>
                    <span className="font-bold tracking-widest text-cyan-100 uppercase text-sm">{room.title}</span>
                </div>
                <div className="flex items-center gap-6 font-mono text-xs">
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
                            {/* Future: Logic to check if next room exists */}
                            <Button onClick={() => router.push('/dashboard')} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold">
                                Return to Mission Control
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ) : (
                <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl z-10 mt-12">
                    {/* Visual Scene */}
                    <motion.div
                        key={`${currentPuzzle.id}-scene`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1"
                    >
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                            {/* Placeholder visual - ideally this is the AI image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-purple-900/40" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                                <p className="text-lg text-white font-light leading-relaxed">
                                    "{room.description}"
                                </p>
                            </div>
                        </div>
                        <Card className="mt-4 bg-zinc-900/50 border-white/5">
                            <CardHeader><CardTitle className="text-xs uppercase text-zinc-500 tracking-widest">Puzzle {currentPuzzleIndex + 1} / {room.puzzles.length}</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-lg text-cyan-50 font-medium">{currentPuzzle.question}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Interaction */}
                    <motion.div
                        key={`${currentPuzzle.id}-input`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 max-w-md"
                    >
                        <Card className="bg-black/60 backdrop-blur-md border-cyan-500/20 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex justify-between">
                                    <span className="text-cyan-400 text-sm uppercase tracking-wider">Interface</span>
                                    {feedback === 'success' && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct</span>}
                                    {feedback === 'error' && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Invalid</span>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                {currentPuzzle.type === 'choice' ? (
                                    <div className="grid gap-3">
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
                                    <div className="space-y-4">
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
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={requestHint}
                                    disabled={loadingHint}
                                    className="w-full text-zinc-500 hover:text-purple-400"
                                >
                                    {loadingHint ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <HelpCircle className="w-4 h-4 mr-2" />}
                                    {loadingHint ? "Analyzing Pattern..." : "Request Hint"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
