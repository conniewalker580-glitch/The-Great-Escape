export type Puzzle = {
    id: string;
    question: string;
    type: 'code' | 'choice' | 'sequence' | 'interaction';
    options?: string[]; // For choice
    answer: string | string[];
    hint: string;
    solution_explanation: string;
};

export type Room = {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    duration: string; // e.g. "5-7 mins"
    description: string;
    theme: 'Mystery' | 'Sci-Fi' | 'Horror' | 'Ancient' | 'Abstract';
    puzzles: Puzzle[];
    imagePrompt: string; // For AI generation later
    isPremium: boolean;
};

export const ROOMS: Room[] = [
    // --- FREE TIER (1-3) ---
    {
        id: "room-1",
        title: "The Locked Study",
        difficulty: "Easy",
        duration: "5-7 mins",
        description: "A quiet old study with a locked drawer and scattered books. The air smells of dust and old paper.",
        theme: "Mystery",
        imagePrompt: "Old victorin study room, dusty, books scattered, locked drawer, cinematic lighting",
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "A note on the desk says: 'The year of the Great Fire is the key'. You see a history book about London 1666.",
                type: 'code',
                answer: "1666",
                hint: "Look for a date associated with a 'Great Fire'.",
                solution_explanation: "The date of the Great Fire of London is 1666."
            },
            {
                id: "p2",
                question: "The drawer opens. Inside is a symbol of a 'Key' and a 'Door'. Which object in the room matches?",
                type: 'choice',
                options: ["The Window", "The Rug", "The Brass Key", "The Lamp"],
                answer: "The Brass Key",
                hint: "It's a literal key.",
                solution_explanation: "You need the key to open the door."
            }
        ]
    },
    {
        id: "room-2",
        title: "The Clockmaker’s Secret",
        difficulty: "Easy",
        duration: "8-10 mins",
        description: "An abandoned clock shop frozen at midnight. Ticking sounds echo around you.",
        theme: "Mystery",
        imagePrompt: "Steampunk clock shop, gears, pendulum, frozen time, midnight blue atmosphere",
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "Three clocks are on the wall. The first says 3:00. The second says 6:00. The third says 9:00. What comes next?",
                type: 'choice',
                options: ["10:00", "12:00", "1:00", "11:00"],
                answer: "12:00",
                hint: "The pattern adds 3 hours each time.",
                solution_explanation: "3 + 3 = 6, 6 + 3 = 9, 9 + 3 = 12."
            },
            {
                id: "p2",
                question: "A safe requires a 4-digit code. Etched on the glass: 'Midnight + Noon'.",
                type: 'code',
                answer: "2412", // 12 + 12 = 24, also 0000/1200 depending on interpretation, but let's go with concat or sum. Let's make it 2412 for '24' and '12' combined or just 2400. Let's aim for simple concat: 1212. Wait, let's use 24-hour format logic. Midnight=00/24, Noon=12. 12 + 12 = 24. Let's try '1212' (Midnight 12, Noon 12). Or 0012.",
                // Let's go simpler: "Midnight is 12, Noon is 12. Enter them together."
                hint: "Midnight is 12, Noon is 12. Combine them.",
                solution_explanation: "12 (Midnight) and 12 (Noon) together make 1212."
            }
        ]
    },
    {
        id: "room-3",
        title: "The Train That Never Left",
        difficulty: "Medium",
        duration: "10-15 mins",
        description: "An empty train carriage stuck between stations. The windows show static. A ticket is on the floor.",
        theme: "Mystery",
        imagePrompt: "Vintage train carriage, empty, mysterious, ticket on floor, fog outside windows",
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "The ticket has the number 88088. If you flip it upside down, what number do you see?",
                type: 'code',
                answer: "88088",
                hint: "Some numbers look the same upside down.",
                solution_explanation: "8 and 0 are symmetrical. 88088 stays 88088."
            },
            {
                id: "p2",
                question: "The conductor asks for the destination. The letters on the map are scrambled: 'N-O-D-N-O-L'.",
                type: 'code',
                answer: "LONDON",
                hint: "Unscramble the letters to find a famous city.",
                solution_explanation: "N-O-D-N-O-L backwards spells LONDON."
            }
        ]
    },

    // --- PRO TIER (4-6) ---
    {
        id: "room-4",
        title: "The Forgotten Classroom",
        difficulty: "Medium",
        duration: "15 mins",
        description: "A classroom untouched for decades. A math problem is left on the chalkboard.",
        theme: "Horror",
        imagePrompt: "Abandoned classroom, chalkboard formulae, eerie dust, broken desks",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "On the board: 2, 4, 8, 16, ?. What is the next number?",
                type: 'code',
                answer: "32",
                hint: "Double the previous number.",
                solution_explanation: "The sequence doubles each time: 16 * 2 = 32."
            },
            {
                id: "p2",
                question: "The teacher's desk is locked. 'The atomic number of Carbon is the code'.",
                type: 'code',
                answer: "6",
                hint: "Carbon is the 6th element.",
                solution_explanation: "Creating life involves carbon, element 6."
            }
        ]
    },
    {
        id: "room-5",
        title: "The Lighthouse Signal",
        difficulty: "Medium",
        duration: "15-20 mins",
        description: "A stormy night in a lighthouse. The lamp is broken. You need to send a distress signal.",
        theme: "Mystery",
        imagePrompt: "Lighthouse interior, storm outside rain on glass, morse code machine, brass telescope",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "A manual shows Morse code: ... is S, --- is O. Input the code for 'SOS'.",
                type: 'code',
                answer: "...---...",
                hint: "Combine the dots and dashes exactly.",
                solution_explanation: "SOS is ... --- ..."
            },
            {
                id: "p2",
                question: "You need to point the light North. A compass points 'East'. How many degrees left must you turn?",
                type: 'choice',
                options: ["90", "180", "45", "270"],
                answer: "90",
                hint: "North is 90 degrees left of East.",
                solution_explanation: "East (90deg) to North (0/360deg) is a 90 degree Left turn."
            }
        ]
    },
    {
        id: "room-6",
        title: "The Underground Vault",
        difficulty: "Hard",
        duration: "25 mins",
        description: "A high-tech bank vault. Laser grids shift in a rhythm. A biometric scanner awaits input.",
        theme: "Sci-Fi",
        imagePrompt: "Cyberpunk bank vault, shifting lasers, keypad, steel walls, neon lights",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "Three wires guard the lock: Red, Blue, Green. Rule 1: Cut Blue if Red is active. Rule 2: Cut Green if Blue is cut. Rule 3: Never cut Red. Which wire do you cut first?",
                type: 'choice',
                options: ["Red", "Blue", "Green", "None"],
                answer: "Blue",
                hint: "Red is active (presence of wire). Rule 1 applies.",
                solution_explanation: "Red exists (Active). Rule 1 says Cut Blue. So Blue is first."
            },
            {
                id: "p2",
                question: "The keypad shifts numbers. Sequence observed: 10, 11, 12, 13, 15, 17, 19, 21. What number was skipped?",
                type: 'code',
                answer: "14",
                hint: "Look at the pattern of increments.",
                solution_explanation: "Increments are +1, +1, +1, +2, +2, +2. 13+1=14 was skipped for 15."
            }
        ]
    },

    // --- ELITE TIER (7-10) ---
    {
        id: "room-7",
        title: "The Astronomer’s Room",
        difficulty: "Hard",
        duration: "25 mins",
        description: "A telescope points at the stars. A constellation chart on the wall matches the ceiling, but one star is flickering.",
        theme: "Sci-Fi",
        imagePrompt: "Observatory dome, telescope, star charts, galaxy projection, dark blue ambient",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "The planets are aligned by number of moons (classic): Earth (1), Mars (2), ?. What has 4 Galilean moons?",
                type: 'choice',
                options: ["Venus", "Jupiter", "Saturn", "Neptune"],
                answer: "Jupiter",
                hint: "The King of Planets.",
                solution_explanation: "Jupiter has the 4 famous Galilean moons."
            },
            {
                id: "p2",
                question: "Light takes 8 minutes to reach Earth from the Sun. Where was the light you see now generated?",
                type: 'choice',
                options: ["The Surface", "The Core", "The Corona", "8 minutes ago"],
                answer: "The Core",
                hint: "Fusion happens in the center.",
                solution_explanation: "Light is generated in the Core by fusion, then takes millenia to exit, then 8 mins to Earth."
            }
        ]
    },
    {
        id: "room-8",
        title: "The Trial of Silence",
        difficulty: "Hard",
        duration: "30 mins",
        description: "A soundproof room. A frequency generator sits on a desk. The glass walls vibrate.",
        theme: "Abstract",
        imagePrompt: "White padded room, sound equipment, eerie silence, minimalist",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "To break the glass, match its resonant frequency. The glass sings at 'A4'. What Hz is that?",
                type: 'choice',
                options: ["261 Hz", "440 Hz", "512 Hz", "1000 Hz"],
                answer: "440 Hz",
                hint: "Standard tuning pitch.",
                solution_explanation: "A4 is standardized at 440 Hz."
            },
            {
                id: "p2",
                question: "Silence is not empty. In binary, silence (0) is opposed by signal (1). Convert 'Signal' (101010) to decimal.",
                type: 'code',
                answer: "42",
                hint: "32 + 8 + 2",
                solution_explanation: "101010 = 32+0+8+0+2+0 = 42."
            }
        ]
    },
    {
        id: "room-9",
        title: "The Archivist’s Paradox",
        difficulty: "Expert",
        duration: "35 mins",
        description: "A library of infinite books. One book contains the story of your life. The pages are blank.",
        theme: "Abstract",
        imagePrompt: "endless library, flying books, magical atmosphere, dust motes",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "I exist only when you don't look. When you look, I collapse. What am I? (Quantum Physics)",
                type: 'choice',
                options: ["A Shadow", "A Wave Function", "A Dream", "Silence"],
                answer: "A Wave Function",
                hint: "Schrodinger's cat knows.",
                solution_explanation: "The wave function collapses upon observation."
            },
            {
                id: "p2",
                question: "To exit, you must write the ending. The sentence 'Was it a car or a cat I saw' is special. Why?",
                type: 'choice',
                options: ["It rhymes", "It is a Palindrome", "It is infinite", "It is false"],
                answer: "It is a Palindrome",
                hint: "Read it backwards.",
                solution_explanation: "It reads the same forwards and backwards."
            }
        ]
    },
    {
        id: "room-10",
        title: "The Final Door",
        difficulty: "Expert",
        duration: "40 mins",
        description: "The end of the simulation. A giant obsidian monolith stands before you, humming with the power of all previous rooms.",
        theme: "Abstract",
        imagePrompt: "Giant monolith door, glowing runes, void space, final boss vibe",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "Recall Room 1 (History). Recall Room 2 (Time). What year did the clock stop in 1666? (Trick: Synthesize with Room 4 Key '6'). Enter: 1666 + 6",
                type: 'code',
                answer: "1672",
                hint: "1666 + 6",
                solution_explanation: "1666 + 6 = 1672."
            },
            {
                id: "p2",
                question: "Synthesis Beta: Room 5 Signal (SOS) + Room 9 (Palindrome). Enter the SOS signal reversed.",
                type: 'code',
                answer: "...---...",
                hint: "SOS is a palindrome.",
                solution_explanation: "SOS (...---...) is the same reversed."
            },
            {
                id: "p3",
                question: "FINAL OUTPUT: The User Tier is 'Elite'. The Room Count is 10. The Ultimate Answer to the Universe is...?",
                type: 'code',
                answer: "42",
                hint: "Douglas Adams knows.",
                solution_explanation: "42."
            }
        ]
    }
];
