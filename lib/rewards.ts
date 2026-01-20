// Rewards and Achievement System

export type AchievementBadge = {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: {
        type: 'rooms_completed' | 'perfect_score' | 'speed_run' | 'no_hints' | 'daily_streak' | 'special';
        value: number;
    };
    rewardType: 'exclusive_room' | 'title' | 'cosmetic';
    rewardValue?: string; // Room ID or title name
};

export type PlayerTitle = {
    id: string;
    name: string;
    description: string;
    unlockRequirement: string;
};

export type DailyReward = {
    day: number;
    reward: {
        type: 'hint_token' | 'exclusive_room' | 'badge' | 'title';
        value: string | number;
    };
};

// Achievement Badges
export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
    {
        id: 'first_escape',
        name: 'First Escape',
        description: 'Complete your first room',
        icon: '🎯',
        requirement: { type: 'rooms_completed', value: 1 },
        rewardType: 'title',
        rewardValue: 'Novice Escapist'
    },
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete any room in under 3 minutes',
        icon: '⚡',
        requirement: { type: 'speed_run', value: 180 },
        rewardType: 'exclusive_room',
        rewardValue: 'room-bonus-1'
    },
    {
        id: 'perfect_mind',
        name: 'Perfect Mind',
        description: 'Complete 5 rooms with S-rank (no hints)',
        icon: '🧠',
        requirement: { type: 'no_hints', value: 5 },
        rewardType: 'exclusive_room',
        rewardValue: 'room-bonus-2'
    },
    {
        id: 'master_detective',
        name: 'Master Detective',
        description: 'Complete all 20 standard rooms',
        icon: '🔍',
        requirement: { type: 'rooms_completed', value: 20 },
        rewardType: 'exclusive_room',
        rewardValue: 'room-bonus-3'
    },
    {
        id: 'dedicated_solver',
        name: 'Dedicated Solver',
        description: 'Login and play for 7 consecutive days',
        icon: '📅',
        requirement: { type: 'daily_streak', value: 7 },
        rewardType: 'exclusive_room',
        rewardValue: 'room-bonus-4'
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Get perfect score on 10 different rooms',
        icon: '⭐',
        requirement: { type: 'perfect_score', value: 10 },
        rewardType: 'title',
        rewardValue: 'Master Escapist'
    },
    {
        id: 'ultimate_champion',
        name: 'Ultimate Champion',
        description: 'Complete all rooms including bonus rooms with S-rank',
        icon: '👑',
        requirement: { type: 'special', value: 25 },
        rewardType: 'exclusive_room',
        rewardValue: 'room-bonus-5'
    }
];

// Player Titles
export const PLAYER_TITLES: PlayerTitle[] = [
    {
        id: 'novice',
        name: 'Novice Escapist',
        description: 'Just getting started',
        unlockRequirement: 'Complete 1 room'
    },
    {
        id: 'apprentice',
        name: 'Apprentice Solver',
        description: 'Learning the ropes',
        unlockRequirement: 'Complete 5 rooms'
    },
    {
        id: 'expert',
        name: 'Expert Detective',
        description: 'A seasoned puzzle solver',
        unlockRequirement: 'Complete 10 rooms'
    },
    {
        id: 'master',
        name: 'Master Escapist',
        description: 'Among the elite',
        unlockRequirement: 'Get perfect score on 10 rooms'
    },
    {
        id: 'legend',
        name: 'Legendary Mind',
        description: 'The ultimate achievement',
        unlockRequirement: 'Complete all rooms with S-rank'
    }
];

// Daily Rewards (7-day cycle)
export const DAILY_REWARDS: DailyReward[] = [
    { day: 1, reward: { type: 'hint_token', value: 1 } },
    { day: 2, reward: { type: 'hint_token', value: 2 } },
    { day: 3, reward: { type: 'badge', value: 'daily_warrior' } },
    { day: 4, reward: { type: 'hint_token', value: 3 } },
    { day: 5, reward: { type: 'title', value: 'Dedicated Solver' } },
    { day: 6, reward: { type: 'hint_token', value: 5 } },
    { day: 7, reward: { type: 'exclusive_room', value: 'room-bonus-4' } }
];

// Helper functions
export function checkAchievement(
    badge: AchievementBadge,
    playerStats: {
        roomsCompleted: number;
        perfectScores: number;
        speedRuns: number;
        noHintRuns: number;
        dailyStreak: number;
    }
): boolean {
    switch (badge.requirement.type) {
        case 'rooms_completed':
            return playerStats.roomsCompleted >= badge.requirement.value;
        case 'perfect_score':
            return playerStats.perfectScores >= badge.requirement.value;
        case 'speed_run':
            return playerStats.speedRuns >= 1; // At least one speed run
        case 'no_hints':
            return playerStats.noHintRuns >= badge.requirement.value;
        case 'daily_streak':
            return playerStats.dailyStreak >= badge.requirement.value;
        case 'special':
            // Ultimate champion: all 25 rooms (20 + 5 bonus) with S-rank
            return playerStats.perfectScores >= badge.requirement.value;
        default:
            return false;
    }
}

export function getDailyReward(dayNumber: number): DailyReward {
    const cycleDay = ((dayNumber - 1) % 7) + 1;
    return DAILY_REWARDS.find(r => r.day === cycleDay) || DAILY_REWARDS[0];
}

export function calculateRank(hintsUsed: number, timeSeconds: number, targetTime: number): 'S' | 'A' | 'B' | 'C' {
    if (hintsUsed === 0 && timeSeconds <= targetTime) return 'S';
    if (hintsUsed < 2 && timeSeconds <= targetTime * 1.5) return 'A';
    if (hintsUsed < 4) return 'B';
    return 'C';
}
