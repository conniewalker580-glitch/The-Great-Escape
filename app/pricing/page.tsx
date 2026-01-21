"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Zap, Crown, MoveLeft, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (tier: 'explorer' | 'adventurer' | 'elite' | 'master') => {
        setLoading(tier);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier }),
            });
            const { url } = await res.json();
            window.location.href = url;
        } catch (error) {
            console.error(error);
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen p-8 pt-20 flex flex-col items-center relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background z-0 pointer-events-none" />

            <div className="absolute top-4 left-4 z-20">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <MoveLeft className="w-4 h-4" /> Back to Base
                    </Button>
                </Link>
            </div>

            <div className="text-center space-y-4 mb-12 max-w-2xl z-10">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    Choose Your Destiny
                </h1>
                <p className="text-muted-foreground">
                    Unlock infinite possibilities. Upgrade your clearance level to access deeper mysteries and advanced AI tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full max-w-7xl z-10">
                {/* FREE */}
                <Card className="border-white/10 relative bg-black/40 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle>Free</CardTitle>
                        <CardDescription>Casual detective.</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-white">$0</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> 3 Rooms / Month</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Standard Tutorials</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Daily Reward Wheel</li>
                            <li className="flex gap-2 text-muted-foreground"><X className="w-4 h-4" /> Ads between levels</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline">Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* EXPLORER */}
                <Card className="border-white/10 relative bg-black/40 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" /> Explorer
                        </CardTitle>
                        <CardDescription>Growing interest.</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-white">$6.99</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> 10 Rooms / Month</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> No Ads</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Priority Support</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Alternate Endings</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => handleCheckout('explorer')}
                            disabled={loading === 'explorer'}
                        >
                            {loading === 'explorer' ? 'Processing...' : 'Go Explorer'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* ADVENTURER - Most Popular */}
                <Card className="border-cyan-500/50 relative bg-cyan-900/10 backdrop-blur-md scale-105 z-10 shadow-2xl shadow-cyan-500/20">
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-cyan-500" /> Adventurer
                        </CardTitle>
                        <CardDescription>Dedicated solver.</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-cyan-400">$12.99</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> 100 Rooms / Month</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Unlimited Hints</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Elite Room Previews</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Daily Bonus Rewards</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold"
                            onClick={() => handleCheckout('adventurer')}
                            disabled={loading === 'adventurer'}
                        >
                            {loading === 'adventurer' ? 'Processing...' : 'Get Adventurer'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* ELITE */}
                <Card className="border-amber-500/50 relative bg-amber-900/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-400">
                            <Star className="w-5 h-5 fill-current" /> Elite
                        </CardTitle>
                        <CardDescription>Serious enthusiast.</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-amber-400">$19.99</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-amber-400" /> 200 Rooms / Month</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-amber-400" /> Unlimited Hints</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-amber-400" /> Bonus Rooms</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-amber-400" /> Priority Queue</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold"
                            onClick={() => handleCheckout('elite')}
                            disabled={loading === 'elite'}
                        >
                            {loading === 'elite' ? 'Processing...' : 'Go Elite'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* MASTER ESCAPE */}
                <Card className="border-purple-500/50 relative bg-purple-900/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-400">
                            <Crown className="w-5 h-5 fill-current" /> Master Escape
                        </CardTitle>
                        <CardDescription>Absolute completionist.</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-purple-400">$29.99</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-purple-400" /> Unlimited Rooms</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-purple-400" /> Exclusive Cosmetics</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-purple-400" /> Weekly Challenges</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-purple-400" /> Early Access</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-purple-400" /> Bonus Content</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0"
                            onClick={() => handleCheckout('master')}
                            disabled={loading === 'master'}
                        >
                            {loading === 'master' ? 'Processing...' : 'Become Master'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-16 w-full max-w-4xl z-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-100">Equipment Requisition (One-Time)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Hint Pack (x10)', 'Time-Skip Boost', 'Themed Room Pack', 'Neon Avatar Set'].map((item) => (
                        <Card key={item} className="hover:bg-white/5 transition-colors cursor-pointer bg-black/40 border-white/10">
                            <CardHeader className="p-4">
                                <CardTitle className="text-sm">{item}</CardTitle>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">$1.99</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">+</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
