"use client";

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENT_BADGES, PLAYER_TITLES, getDailyReward } from '@/lib/rewards';
import { BONUS_ROOMS, isBonusRoomUnlocked } from '@/lib/bonus-rooms';
import { motion } from 'framer-motion';
import { Trophy, Star, Gift, Lock, Crown } from 'lucide-react';
import Link from 'next/link';

export default function RewardsPage() {
    const [playerStats, setPlayerStats] = useState({
        roomsCompleted: 0,
        perfectScores: 0,
        speedRuns: 0,
        noHintRuns: 0,
        dailyStreak: 0,
        unlockedBadges: [] as string[],
        currentTitle: 'Novice Escapist'
    });

    const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

    const [, startTransition] = useTransition();

    useEffect(() => {
        // Load player stats from localStorage or API
        const stats = localStorage.getItem('playerStats');
        if (stats) {
            try {
                const parsed = JSON.parse(stats);
                startTransition(() => {
                    setPlayerStats(parsed);
                });
            } catch (e) {
                console.error("Failed to parse player stats", e);
            }
        }

        // Check if daily reward was claimed today
        const lastClaim = localStorage.getItem('lastDailyRewardClaim');
        const today = new Date().toDateString();
        startTransition(() => {
            setDailyRewardClaimed(lastClaim === today);
        });
    }, []);

    const claimDailyReward = () => {
        const today = new Date().toDateString();
        localStorage.setItem('lastDailyRewardClaim', today);
        setDailyRewardClaimed(true);

        // Increment daily streak
        setPlayerStats(prev => ({
            ...prev,
            dailyStreak: prev.dailyStreak + 1
        }));
    };

    const todayReward = getDailyReward(playerStats.dailyStreak + 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Rewards & Achievements
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Your current title: <span className="text-cyan-400 font-bold">{playerStats.currentTitle}</span>
                    </p>
                </div>

                {/* Daily Reward */}
                <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="w-6 h-6 text-purple-400" />
                            Daily Reward - Day {playerStats.dailyStreak + 1}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg">Today&apos;s Reward: <span className="text-cyan-400 font-bold">
                                    {todayReward.reward.type === 'hint_token' && `${todayReward.reward.value} Hint Tokens`}
                                    {todayReward.reward.type === 'badge' && 'Special Badge'}
                                    {todayReward.reward.type === 'title' && `Title: ${todayReward.reward.value}`}
                                    {todayReward.reward.type === 'exclusive_room' && 'Exclusive Bonus Room!'}
                                </span></p>
                                <p className="text-sm text-zinc-400">Login streak: {playerStats.dailyStreak} days</p>
                            </div>
                            <Button
                                onClick={claimDailyReward}
                                disabled={dailyRewardClaimed}
                                className="bg-gradient-to-r from-purple-600 to-cyan-600"
                            >
                                {dailyRewardClaimed ? 'Claimed!' : 'Claim Reward'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Achievement Badges */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        Achievement Badges
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ACHIEVEMENT_BADGES.map((badge) => {
                            const isUnlocked = playerStats.unlockedBadges.includes(badge.id);
                            return (
                                <motion.div
                                    key={badge.id}
                                    whileHover={{ scale: 1.05 }}
                                    className={`p-6 rounded-lg border-2 ${isUnlocked
                                        ? 'bg-gradient-to-br from-yellow-900/30 to-purple-900/30 border-yellow-500/50'
                                        : 'bg-black/40 border-zinc-700/50'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{isUnlocked ? badge.icon : '🔒'}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{badge.name}</h3>
                                            <p className="text-sm text-zinc-400">{badge.description}</p>
                                            {badge.rewardType === 'exclusive_room' && (
                                                <p className="text-xs text-purple-400 mt-2">
                                                    🎁 Unlocks: Exclusive Bonus Room
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Exclusive Bonus Rooms */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <Crown className="w-8 h-8 text-purple-400" />
                        Exclusive Bonus Rooms
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BONUS_ROOMS.map((room) => {
                            const isUnlocked = isBonusRoomUnlocked(room.id, playerStats);
                            return (
                                <Card
                                    key={room.id}
                                    className={`${isUnlocked
                                        ? 'bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border-purple-500/50'
                                        : 'bg-black/40 border-zinc-700/50'
                                        }`}
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{room.title}</span>
                                            {isUnlocked ? (
                                                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                            ) : (
                                                <Lock className="w-6 h-6 text-zinc-500" />
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-zinc-300">{room.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">
                                                Difficulty: <span className="text-red-400">{room.difficulty}</span>
                                            </span>
                                            {isUnlocked ? (
                                                <Link href={`/play/${room.id}`}>
                                                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                                                        Play Now
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button disabled className="bg-zinc-800">
                                                    Locked
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Player Titles */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Available Titles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PLAYER_TITLES.map((title) => (
                            <div
                                key={title.id}
                                className={`p-4 rounded-lg border ${playerStats.currentTitle === title.name
                                    ? 'bg-cyan-900/30 border-cyan-500'
                                    : 'bg-black/40 border-zinc-700/50'
                                    }`}
                            >
                                <h3 className="font-bold">{title.name}</h3>
                                <p className="text-xs text-zinc-400">{title.description}</p>
                                <p className="text-xs text-purple-400 mt-2">{title.unlockRequirement}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
