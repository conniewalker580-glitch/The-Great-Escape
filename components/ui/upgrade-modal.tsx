"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Lock, Rocket } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    tier: string;
    limit: number;
}

export function UpgradeModal({ isOpen, onClose, tier, limit }: UpgradeModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Card className="border-cyan-500/50 bg-zinc-900 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                                    <Lock className="w-6 h-6 text-cyan-500" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-white uppercase tracking-wider">Plan Limit Reached</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Your current <span className="text-cyan-400 font-bold uppercase">{tier}</span> clearance allows for {limit} rooms per month.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center space-y-4">
                                <p className="text-sm text-zinc-500 italic">
                                    &quot;The void calls for deeper exploration. Upgrade your clearance to proceed.&quot;
                                </p>
                                <div className="p-4 bg-cyan-950/20 rounded border border-cyan-500/10 text-xs text-cyan-300">
                                    Unlock 100+ rooms, exclusive cosmetics, and unlimited hints with our higher tiers.
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3">
                                <Link href="/pricing" className="w-full">
                                    <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold h-12 gap-2">
                                        <Rocket className="w-4 h-4 fill-current" /> Upgrade Clearance
                                    </Button>
                                </Link>
                                <Button variant="ghost" onClick={onClose} className="text-zinc-500 hover:text-white">
                                    Maybe Later
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
