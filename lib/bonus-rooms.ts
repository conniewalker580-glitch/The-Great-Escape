import { Room } from './game-data';

// Exclusive Bonus Rooms - Unlocked through achievements
export const BONUS_ROOMS: Room[] = [
    {
        id: 'room-bonus-1',
        title: 'The Speed Runner\'s Challenge',
        difficulty: 'Expert',
        duration: '3-5 mins',
        description: 'A room designed for the fastest minds. Every second counts. Unlocked by completing any room in under 3 minutes.',
        theme: 'Sci-Fi',
        imagePrompt: 'Futuristic speed trial chamber with countdown timers',
        panoramicImage: 'High-tech chamber with glowing countdown displays, pressure pads, and rapid-fire puzzle terminals',
        isPremium: true,
        puzzles: [
            {
                id: 'bonus1_p1',
                question: 'Quick! The sequence is 1, 1, 2, 3, 5, 8, 13... What comes next?',
                type: 'code',
                answer: '21',
                hints: ['This is the Fibonacci sequence', 'Add the previous two numbers'],
                solution_explanation: 'Fibonacci: 8 + 13 = 21'
            },
            {
                id: 'bonus1_p2',
                question: 'The terminal shows: "SPEED = DISTANCE / ____". Fill in the blank.',
                type: 'code',
                answer: 'TIME',
                hints: ['Basic physics formula', 'What do you divide distance by to get speed?'],
                solution_explanation: 'Speed equals distance divided by time'
            }
        ]
    },
    {
        id: 'room-bonus-2',
        title: 'The Mastermind\'s Sanctum',
        difficulty: 'Expert',
        duration: '20-30 mins',
        description: 'Only the sharpest minds enter here. No hints allowed. Unlocked by completing 5 rooms with S-rank.',
        theme: 'Mystery',
        imagePrompt: 'Luxurious private study with complex puzzles',
        panoramicImage: 'Elegant study with intricate mechanical puzzles, cryptic manuscripts, and hidden compartments',
        isPremium: true,
        puzzles: [
            {
                id: 'bonus2_p1',
                question: 'A bookshelf contains volumes numbered I through XII. If you remove volume VII, how many remain?',
                type: 'code',
                answer: '11',
                hints: ['Count the Roman numerals', 'XII = 12, remove 1'],
                solution_explanation: '12 books total, remove 1 = 11 remaining'
            }
        ]
    },
    {
        id: 'room-bonus-3',
        title: 'The Grand Archive',
        difficulty: 'Expert',
        duration: '30-45 mins',
        description: 'The ultimate test. A massive library containing the secrets of all previous rooms. Unlocked by completing all 20 standard rooms.',
        theme: 'Ancient',
        imagePrompt: 'Vast ancient library with towering shelves',
        panoramicImage: 'Enormous circular library with spiral staircases, floating books, and ancient artifacts from all previous rooms',
        isPremium: true,
        puzzles: [
            {
                id: 'bonus3_p1',
                question: 'The archive keeper asks: "What year did the Great Fire burn?" (Reference: The Locked Study)',
                type: 'code',
                answer: '1666',
                hints: ['Think back to Room 1', 'Check the History Book'],
                solution_explanation: 'Callback to Room 1: The Great Fire of London, 1666'
            }
        ]
    },
    {
        id: 'room-bonus-4',
        title: 'The Dedication Chamber',
        difficulty: 'Medium',
        duration: '15-20 mins',
        description: 'A reward for your commitment. Unlocked by logging in for 7 consecutive days.',
        theme: 'Cozy',
        imagePrompt: 'Warm meditation room with achievement displays',
        panoramicImage: 'Peaceful chamber with trophy cases displaying your achievements, comfortable seating, and motivational quotes',
        isPremium: true,
        puzzles: [
            {
                id: 'bonus4_p1',
                question: 'How many days are in a week?',
                type: 'code',
                answer: '7',
                hints: ['Monday through Sunday', 'Count them!'],
                solution_explanation: '7 days in a week'
            }
        ]
    },
    {
        id: 'room-bonus-5',
        title: 'The Ultimate Paradox',
        difficulty: 'Expert',
        duration: '45-60 mins',
        description: 'The final challenge. Only for those who have conquered everything. Unlocked by completing all rooms with S-rank.',
        theme: 'Abstract',
        imagePrompt: 'Impossible geometric space with reality-bending puzzles',
        panoramicImage: 'Mind-bending Escher-like space with impossible geometry, floating platforms, and paradoxical puzzles',
        isPremium: true,
        puzzles: [
            {
                id: 'bonus5_p1',
                question: 'This statement is false. Is this statement true or false?',
                type: 'choice',
                options: ['True', 'False', 'Paradox', 'Both'],
                answer: 'Paradox',
                hints: ['Think about what happens if you say it\'s true', 'Think about what happens if you say it\'s false'],
                solution_explanation: 'The liar\'s paradox - it cannot be consistently true or false'
            }
        ]
    }
];

// Function to check if a bonus room is unlocked
export function isBonusRoomUnlocked(
    roomId: string,
    playerStats: {
        roomsCompleted: number;
        perfectScores: number;
        speedRuns: number;
        dailyStreak: number;
        noHintRuns: number;
    }
): boolean {
    switch (roomId) {
        case 'room-bonus-1':
            return playerStats.speedRuns >= 1;
        case 'room-bonus-2':
            return playerStats.noHintRuns >= 5;
        case 'room-bonus-3':
            return playerStats.roomsCompleted >= 20;
        case 'room-bonus-4':
            return playerStats.dailyStreak >= 7;
        case 'room-bonus-5':
            return playerStats.perfectScores >= 25; // All 20 + 5 bonus rooms
        default:
            return false;
    }
}
