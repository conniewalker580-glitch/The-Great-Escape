export type Puzzle = {
    id: string;
    question: string;
    type: 'code' | 'choice' | 'sequence' | 'interaction';
    options?: string[]; // For choice
    answer: string | string[];
    hints: string[]; // Upgraded from single hint
    itemImagePrompt?: string; // Prompt for custom puzzle visual
    solution_explanation: string;
};

export type Room = {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    duration: string;
    description: string;
    theme: 'Mystery' | 'Sci-Fi' | 'Horror' | 'Ancient' | 'Abstract' | 'Cozy' | 'Nostalgic' | 'Coastal' | 'Industrial' | 'Steampunk' | 'Noir' | 'Astronomy' | 'Mythic' | 'Time Travel';
    puzzles: Puzzle[];
    imagePrompt: string;
    multiverseScenes?: string[]; // 4 views: Front, Left, Right, Back
    isPremium: boolean;
};

export const ROOMS: Room[] = [
    // --- FREE TIER (1-3) ---
    {
        id: "room-1",
        title: "The Locked Study",
        difficulty: "Easy",
        duration: "5-7 mins",
        description: "A quiet old study with a locked drawer and scattered books.",
        theme: "Mystery",
        imagePrompt: "Old victorian study room, cinematic lighting",
        multiverseScenes: [
            "Old victorian study desk with scattered papers",
            "A dusty mahogany bookshelf filled with ancient volumes",
            "A grandfather clock ticking beside a velvet armchair",
            "A heavy oak door with an ornate silver lock"
        ],
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "A note on the desk says: 'The year of the Great Fire is the key'.",
                type: 'code',
                answer: "1666",
                hints: [],
                itemImagePrompt: "A close up of a tattered note on a mahogany desk with a feather quill",
                solution_explanation: "The date of the Great Fire of London is 1666."
            },
            {
                id: "p2",
                question: "The drawer opens. Which object in the room matches the symbol of a 'Key'?",
                type: 'choice',
                options: ["The Window", "The Rug", "The Brass Key", "The Lamp"],
                answer: "The Brass Key",
                hints: [],
                itemImagePrompt: "A shiny brass key and an iron padlock",
                solution_explanation: "You need the key to open the door."
            }
        ]
    },
    {
        id: "room-2",
        title: "The Clockmaker’s Secret",
        difficulty: "Easy",
        duration: "8-10 mins",
        description: "An abandoned clock shop frozen at midnight.",
        theme: "Mystery",
        imagePrompt: "Steampunk clock shop",
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "Clocks say 3:00, 6:00, 9:00. What comes next?",
                type: 'choice',
                options: ["10:00", "12:00", "1:00", "11:00"],
                answer: "12:00",
                hints: [],
                solution_explanation: "Adds 3 hours each time."
            },
            {
                id: "p2",
                question: "A safe requires a code: 'Midnight + Noon'.",
                type: 'code',
                answer: "1212",
                hints: [],
                solution_explanation: "12 (Midnight) and 12 (Noon) together."
            }
        ]
    },
    {
        id: "room-3",
        title: "The Train That Never Left",
        difficulty: "Medium",
        duration: "10-15 mins",
        description: "An empty train carriage stuck between stations.",
        theme: "Mystery",
        imagePrompt: "Vintage train carriage, empty",
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "The ticket has the number 88088. If you flip it upside down, what number do you see?",
                type: 'code',
                answer: "88088",
                hints: ["Check if 8, 0, and 8 change when flipped.", "The number is numericaly symmetrical."],
                solution_explanation: "8 and 0 are symmetrical."
            },
            {
                id: "p2",
                question: "Unscramble: 'N-O-D-N-O-L' for the destination.",
                type: 'code',
                answer: "LONDON",
                hints: ["A famous capital city.", "Try reading it backwards first."],
                solution_explanation: "LONDON backwards is NODNOL (close)."
            }
        ]
    },
    // --- 10 NEW ROOMS (Integration) ---
    {
        id: "room-11",
        title: "The Locked Bookstore",
        difficulty: "Easy",
        duration: "10 mins",
        description: "A cozy bookstore where the books are arranged in a mysterious order.",
        theme: "Cozy",
        imagePrompt: "Cozy bookstore with mahogany shelves and a warm fireplace",
        isPremium: false,
        puzzles: [
            {
                id: "r11p1",
                question: "Alphabet Shift: If A=1, B=2, what is D-O-O-K?",
                type: 'code',
                answer: "4151511",
                hints: [],
                solution_explanation: "D=4, O=15, O=15, K=11"
            }
        ]
    },
    {
        id: "room-12",
        title: "Grandma’s Kitchen",
        difficulty: "Easy",
        duration: "10 mins",
        description: "The smell of fresh cookies fills the air, but the oven is locked.",
        theme: "Nostalgic",
        imagePrompt: "Warm 1950s kitchen with checkered floors",
        isPremium: false,
        puzzles: [
            {
                id: "r12p1",
                question: "Recipe Ratio: 1 cup flour for 2 cookies. How many cups for 10 cookies?",
                type: 'code',
                answer: "5",
                hints: [],
                solution_explanation: "10 / 2 = 5 cups."
            }
        ]
    },
    {
        id: "room-13",
        title: "The Beach Shack",
        difficulty: "Easy",
        duration: "12 mins",
        description: "A salty breeze blows through the open windows of this coastal retreat.",
        theme: "Coastal",
        imagePrompt: "Rustic beach shack with surfboards and seashells",
        isPremium: false,
        puzzles: [
            {
                id: "r13p1",
                question: "Shell Counting: You see 3 conchs, 5 scallops, and 2 starfish. Total shells?",
                type: 'code',
                answer: "10",
                hints: [],
                solution_explanation: "3 + 5 + 2 = 10."
            }
        ]
    },
    {
        id: "room-14",
        title: "The Abandoned Train Car",
        difficulty: "Medium",
        duration: "15 mins",
        description: "An industrial train car stalled on a rusty track. The power is out.",
        theme: "Industrial",
        imagePrompt: "Gritty industrial train car interior with sparking wires",
        isPremium: true,
        puzzles: [
            {
                id: "r14p1",
                question: "Electrical Routing: Connect Wire A (Red) to Port 3 and Wire B (Blue) to...?",
                type: 'choice',
                options: ["Port 1", "Port 2", "Port 4", "Port 5"],
                answer: "Port 2",
                hints: ["Check the schematic on the wall.", "Blue matches Port 2's color code."],
                solution_explanation: "Schematic shows B -> 2."
            }
        ]
    },
    {
        id: "room-15",
        title: "The Clockmaker’s Workshop",
        difficulty: "Medium",
        duration: "18 mins",
        description: "Large brass gears cover every wall. The master clock is silent.",
        theme: "Steampunk",
        imagePrompt: "Steampunk workshop with giant gears and brass pipes",
        isPremium: true,
        puzzles: [
            {
                id: "r15p1",
                question: "Gear Ratios: Gear A has 10 teeth, Gear B has 20. If A spins twice, how many times does B spin?",
                type: 'code',
                answer: "1",
                hints: ["Large gears spin slower.", "The ratio is 1:2."],
                solution_explanation: "10*2 / 20 = 1 rotation."
            }
        ]
    },
    {
        id: "room-16",
        title: "The Underground Speakeasy",
        difficulty: "Medium",
        duration: "20 mins",
        description: "The jazz is playing, but the exit is hidden behind the bar.",
        theme: "Noir",
        imagePrompt: "Dimly lit 1920s speakeasy with a jazz stage",
        isPremium: true,
        puzzles: [
            {
                id: "r16p1",
                question: "Jazz Cipher: The saxophonist plays B-A-G. What is the code?",
                type: 'code',
                answer: "217",
                hints: ["Musical notes map to numbers.", "B=2, A=1, G=7 based on the menu."],
                solution_explanation: "Menu cipher: A=1, B=2, C=3... G=7."
            }
        ]
    },
    {
        id: "room-17",
        title: "The Lost Observatory",
        difficulty: "Medium",
        duration: "20 mins",
        description: "The stars are visible through the massive telescope, but the dome won't open.",
        theme: "Astronomy",
        imagePrompt: "Ancient observatory with a massive brass telescope",
        isPremium: true,
        puzzles: [
            {
                id: "r17p1",
                question: "Planet Order: Mercury, Venus, ?, Mars.",
                type: 'code',
                answer: "Earth",
                hints: ["We live here.", "Third rock from the sun."],
                solution_explanation: "Earth is the third planet."
            }
        ]
    },
    {
        id: "room-18",
        title: "The AI Containment Lab",
        difficulty: "Hard",
        duration: "25 mins",
        description: "A sleek white lab where a rogue AI is trying to lock you in.",
        theme: "Sci-Fi",
        imagePrompt: "Futuristic lab with glowing blue screens and a central AI core",
        isPremium: true,
        puzzles: [
            {
                id: "r18p1",
                question: "Logic Gates: (A AND B) OR NOT C. If A=1, B=1, C=1, result?",
                type: 'code',
                answer: "1",
                hints: ["(1 AND 1) is 1.", "OR NOT 1 makes it stay 1."],
                solution_explanation: "1 OR 0 = 1."
            }
        ]
    },
    {
        id: "room-19",
        title: "The Sunken Cathedral",
        difficulty: "Hard",
        duration: "30 mins",
        description: "Water ripples against ancient stone. The bells must ring to raise the structure.",
        theme: "Mythic",
        imagePrompt: "Underwater cathedral with bioluminescent coral",
        isPremium: true,
        puzzles: [
            {
                id: "r19p1",
                question: "Bell Sequence: High, Low, Medium, Low. Map to numbers 1-3.",
                type: 'code',
                answer: "3121",
                hints: ["Low is 1, Medium is 2, High is 3.", "Follow the tones."],
                solution_explanation: "3=High, 1=Low, 2=Medium."
            }
        ]
    },
    {
        id: "room-20",
        title: "The Fractured Timeline",
        difficulty: "Hard",
        duration: "35 mins",
        description: "Clocks on the wall spin backwards. You must fix the paradox.",
        theme: "Time Travel",
        imagePrompt: "A room where furniture from different eras is mixed together",
        isPremium: true,
        puzzles: [
            {
                id: "r20p1",
                question: "Cause-Effect: If you stop the fire in 1920, the library survives in 2024. Code is the year the library was first built.",
                type: 'code',
                answer: "1895",
                hints: ["Check the plaque on the alternate timeline book.", "It predates the 1920 fire."],
                solution_explanation: "Plaque says 1895."
            }
        ]
    },
    // --- PRO TIER (4-6) ---
    {
        id: "room-4",
        title: "The Forgotten Classroom",
        difficulty: "Medium",
        duration: "15 mins",
        description: "A classroom untouched for decades.",
        theme: "Horror",
        imagePrompt: "Abandoned classroom",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "On the board: 2, 4, 8, 16, ?. What is the next number?",
                type: 'code',
                answer: "32",
                hints: ["Double the previous number.", "16 * 2 = ?"],
                solution_explanation: "The sequence doubles each time."
            }
        ]
    },
    {
        id: "room-5",
        title: "The Lighthouse Signal",
        difficulty: "Medium",
        duration: "15-20 mins",
        description: "A stormy night in a lighthouse. Send a distress signal.",
        theme: "Mystery",
        imagePrompt: "Lighthouse interior",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "Morse code: ... is S, --- is O. Input the code for 'SOS'.",
                type: 'code',
                answer: "...---...",
                hints: ["Combine S, O, then S.", "No spaces between characters."],
                solution_explanation: "SOS is ... --- ..."
            }
        ]
    },
    {
        id: "room-6",
        title: "The Underground Vault",
        difficulty: "Hard",
        duration: "25 mins",
        description: "A high-tech bank vault with laser grids.",
        theme: "Sci-Fi",
        imagePrompt: "Cyberpunk bank vault",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "Wires: Red, Blue, Green. Rule 1: Cut Blue if Red is active. Never cut Red.",
                type: 'choice',
                options: ["Red", "Blue", "Green"],
                answer: "Blue",
                hints: ["Red is currently active.", "Follow Rule 1 directly."],
                solution_explanation: "Red exists, so cut Blue."
            }
        ]
    },
    // --- ELITE TIER (7-10) ---
    {
        id: "room-7",
        title: "The Astronomer’s Room",
        difficulty: "Hard",
        duration: "25 mins",
        description: "A telescope points at the stars.",
        theme: "Sci-Fi",
        imagePrompt: "Observatory dome",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "Earth (1), Mars (2), ?. What has 4 Galilean moons?",
                type: 'choice',
                options: ["Venus", "Jupiter", "Saturn", "Neptune"],
                answer: "Jupiter",
                hints: ["The largest planet in our system.", "Named after the king of gods."],
                solution_explanation: "Jupiter has 4 major moons."
            }
        ]
    },
    {
        id: "room-8",
        title: "The Trial of Silence",
        difficulty: "Hard",
        duration: "30 mins",
        description: "A soundproof room with a frequency generator.",
        theme: "Abstract",
        imagePrompt: "White padded room",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "Match A4 resonant frequency. What Hz is that?",
                type: 'choice',
                options: ["261 Hz", "440 Hz", "512 Hz"],
                answer: "440 Hz",
                hints: ["Standard concert pitch.", "Musicians tune to this."],
                solution_explanation: "A4 = 440 Hz."
            }
        ]
    },
    {
        id: "room-9",
        title: "The Archivist’s Paradox",
        difficulty: "Expert",
        duration: "35 mins",
        description: "A library of infinite books.",
        theme: "Abstract",
        imagePrompt: "endless library",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "I collapse when you look. What am I?",
                type: 'choice',
                options: ["A Shadow", "A Wave Function", "A Dream"],
                answer: "A Wave Function",
                hints: ["Quantum mechanics term.", "Schrodinger's favorite topic."],
                solution_explanation: "Wave functions collapse on observation."
            }
        ]
    },
    {
        id: "room-10",
        title: "The Final Door",
        difficulty: "Expert",
        duration: "40 mins",
        description: "The end of the simulation.",
        theme: "Abstract",
        imagePrompt: "Giant monolith door",
        isPremium: true,
        puzzles: [
            {
                id: "p1",
                question: "FINAL OUTPUT: Ultimate Answer to the Universe?",
                type: 'code',
                answer: "42",
                hints: ["The Hitchhiker's Guide.", "A single number."],
                solution_explanation: "It is 42."
            }
        ]
    }
];
