"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Play, Star, Rocket, Activity, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden stars">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-cover bg-center opacity-5 z-0 pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center space-y-8 max-w-5xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest">
          <Activity className="w-3 h-3 animate-pulse" /> System Online: v2.0.4
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 text-glow">
          ESCAPE ROOM <span className="text-secondary text-glow-purple">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
          The universe is full of mysteries.
          <br />Solve infinite generated puzzles in the void.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
          {!loading && !user && (
            <>
              <Button onClick={signInWithGoogle} size="lg" className="w-56 h-16 text-lg gap-2 shadow-cyan-500/20 shadow-xl border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300">
                <Rocket className="w-5 h-5 fill-current" /> Initialize Profile
              </Button>
              <Button onClick={signInWithGoogle} variant="ghost" size="lg" className="w-56 h-16 text-lg text-muted-foreground hover:text-white">
                Access Terminal
              </Button>
            </>
          )}

          {!loading && user && (
            <Link href="/dashboard">
              <Button size="lg" className="w-64 h-16 text-lg gap-3 animate-pulse-slow bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
                <Play className="w-6 h-6 fill-black" /> Enter Mission Control
              </Button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Feature Preview */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-24 z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-black/40 border-white/5 hover:border-cyan-500/30 transition-colors group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
              <Rocket className="w-5 h-5" /> Infinite Horizons
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Generative AI builds a unique escape room every time you play. No two realities are the same.
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/5 hover:border-purple-500/30 transition-colors group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-purple-400 transition-colors">
              <Lock className="w-5 h-5" /> Global Security
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Secure authentication required for all agents. Maintain your rank, stats, and inventory across sessions.
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/5 hover:border-amber-500/30 transition-colors group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-amber-400 transition-colors">
              <Star className="w-5 h-5" /> Elite Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Upgrade for early access to deep space colonies and advanced AI hint capabilities.
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
