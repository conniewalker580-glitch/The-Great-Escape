"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ROOMS } from "@/lib/game-data";
import { Lock, Play, Rocket, Share2, Plus, LayoutTemplate, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface DashboardUser {
    tier: string;
    // Add other fields if needed for display
}

interface DashboardRoom {
    id: string;
    theme: string;
    // Add other fields as needed
}

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [userData, setUserData] = useState<DashboardUser | null>(null);
    const [generatedRooms, setGeneratedRooms] = useState<DashboardRoom[]>([]);
    const [selectedTheme, setSelectedTheme] = useState("Space Horror");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            fetch("/api/user-progress")
                .then(res => res.json())
                .then(data => {
                    setUserData(data.user);
                    setGeneratedRooms(data.generatedRooms);
                });
        }
    }, [isLoaded, user]);

    const handleGenerateRoom = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate-room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme: selectedTheme, difficulty: selectedDifficulty })
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Generation Failed. Upgrade Required."); // Simple alert for now, can be UI toast
                if (res.status === 403) router.push("/pricing");
                return;
            }

            const data = await res.json();
            setGeneratedRooms(prev => [...prev, data.room]);
        } catch {
            alert("Connection Error");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center text-cyan-500">Initializing Uplink...</div>;

    return (
        <div className="min-h-screen p-8 pt-20 max-w-7xl mx-auto relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-cover bg-center opacity-5 z-0 pointer-events-none fixed" />

            {/* HUD Header */}
            <div className="flex justify-between items-end mb-12 relative z-10 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-500">
                        MISSION CONTROL
                    </h1>
                    <p className="text-cyan-400/60 mt-1 font-mono text-sm">
                        WELCOME BACK, AGENT {user?.firstName?.toUpperCase() || 'UNKNOWN'}
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Clearance Level</span>
                        <span className="font-bold text-cyan-400">{userData?.tier?.toUpperCase() || 'FREE'} CLASS</span>
                    </div>
                    <UserButton afterSignOutUrl="/" appearance={{
                        elements: {
                            avatarBox: "w-10 h-10 border-2 border-cyan-500/50"
                        }
                    }} />
                </div>
            </div>

            <div className="space-y-16 relative z-10">

                {/* Infinite Generator */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Zap className="w-6 h-6 text-purple-400" />
                            <span className="text-glow-purple">Infinite Simulation Engine</span>
                        </h2>
                    </div>
                    <Card className="border-purple-500/30 bg-purple-900/10 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4 max-w-xl">
                                <h3 className="text-xl font-semibold text-purple-100">Fabricate New Reality</h3>
                                <p className="text-purple-200/60">
                                    Use advanced AI to generate a completely unique escape room. Choose your theme, difficulty, and complexity. The possibilities are endless.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <div className="flex gap-2">
                                    <select
                                        value={selectedTheme}
                                        onChange={(e) => setSelectedTheme(e.target.value)}
                                        className="bg-purple-950/50 border border-purple-500/30 text-purple-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                                    >
                                        <option value="Space Horror">Space Horror</option>
                                        <option value="Cyberpunk Noir">Cyberpunk Noir</option>
                                        <option value="Ancient Tomb">Ancient Tomb</option>
                                        <option value="Digital Void">Digital Void</option>
                                    </select>
                                    <select
                                        value={selectedDifficulty}
                                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                                        className="bg-purple-950/50 border border-purple-500/30 text-purple-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <Button
                                    disabled={isGenerating}
                                    onClick={handleGenerateRoom}
                                    size="lg"
                                    className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/30 shadow-lg shadow-purple-900/20 gap-2 w-full"
                                >
                                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    {isGenerating ? "Compiling..." : "Initialize"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Available Missions */}
                <section>
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-100">
                        <Rocket className="w-5 h-5 text-cyan-500" /> Active Sectors
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ROOMS.map((room, i) => (
                            <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Card className={`border-white/5 bg-gray-900/40 backdrop-blur-md hover:border-cyan-500/50 transition-all duration-300 group overflow-hidden ${room.isPremium ? 'border-amber-500/10' : ''}`}>
                                    <div className="h-48 bg-black/50 relative overflow-hidden border-b border-white/5">
                                        <motion.div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                            style={{ backgroundImage: `url(https://pollinations.ai/p/${encodeURIComponent(room.imagePrompt)}?width=600&height=400&seed=${room.id}&nologo=true)` }}
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${room.isPremium ? 'from-amber-900/40' : 'from-cyan-900/40'} to-transparent opacity-60`} />
                                        <div className="absolute bottom-2 right-2 flex gap-2">
                                            <span className="text-[10px] font-mono bg-black/80 px-2 py-1 rounded text-white/50 border border-white/10">{room.duration}</span>
                                            <span className="text-[10px] font-mono bg-black/80 px-2 py-1 rounded text-white/50 border border-white/10">{room.difficulty}</span>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className={`group-hover:text-cyan-400 transition-colors ${room.isPremium ? 'text-amber-100 group-hover:text-amber-400' : ''}`}>{room.title}</CardTitle>
                                                <CardDescription className="text-xs font-mono uppercase tracking-wider">{room.theme} Protocol</CardDescription>
                                            </div>
                                            {room.isPremium && <Lock className="w-4 h-4 text-amber-500" />}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                                    </CardContent>
                                    <CardFooter className="gap-2 pt-0">
                                        {room.isPremium && userData?.tier === 'free' ? (
                                            <Link href="/pricing" className="w-full"><Button variant="outline" className="w-full gap-2 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400">Unlock Sector</Button></Link>
                                        ) : (
                                            <Link href={`/play/${room.id}`} className="w-full"><Button className="w-full gap-2 bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/20"><Play className="w-4 h-4" /> Enter Simulation</Button></Link>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* User's Generated / Drafts */}
                <section>
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-100">
                        <LayoutTemplate className="w-5 h-5 text-gray-500" /> My Simulations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {generatedRooms.length === 0 ? (
                            <Card className="bg-black/20 border-white/5 border-dashed">
                                <CardContent className="p-8 text-center text-muted-foreground">No custom simulations active.</CardContent>
                            </Card>
                        ) : (
                            generatedRooms.map((room) => (
                                <Card key={room.id} className="bg-black/20 border-white/5 border-dashed">
                                    <CardHeader>
                                        <CardTitle className="text-muted-foreground text-sm uppercase">PROJECT: {room.theme}</CardTitle>
                                        <CardDescription>ID: {room.id.slice(0, 8)}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-cyan-950/20 rounded p-4 border border-cyan-500/10">
                                            <p className="text-xs text-cyan-700 font-mono">Status: Compile Ready</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="grid grid-cols-2 gap-2">
                                        <Button variant="ghost" size="sm" className="w-full text-xs">Edit Parameters</Button>
                                        <Button size="sm" className="w-full gap-2 bg-cyan-900/30 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-800/30 text-xs">
                                            Deploy <Share2 className="w-3 h-3" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
