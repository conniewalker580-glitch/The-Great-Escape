export type InteractionState = 'idle' | 'discovered' | 'interacted' | 'collected';

export type Hotspot = {
    id: string;
    x: number; // Percentage from left (0-100)
    y: number; // Percentage from top (0-100)
    label: string;
    description: string;
    imagePrompt?: string; // Optional close-up visual
    interactionType: 'inspect' | 'open' | 'reveal' | 'pickup' | 'examine' | 'rotate';
    isSubtle?: boolean; // If true, hotspot is harder to find (no pulsing animation)
    requiresItem?: string; // ID of item needed to interact (e.g., key to open drawer)
    revealsItem?: string; // ID of item this hotspot reveals when interacted
    openStateImage?: string; // Image prompt for opened/interacted state
    closedStateImage?: string; // Image prompt for closed/default state
    angle?: number; // 0-360 degrees for 360° view
    elevation?: number; // -90 to 90 degrees for 360° view
};

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
    multiverseScenes?: string[]; // 4 views: Front, Left, Right, Back (will upgrade to 360° panorama)
    panoramicImage?: string; // 360-degree panoramic image prompt
    hotspots?: Record<number, Hotspot[]>; // Key: Scene index (0-3), Value: Hotspots in that scene
    isPremium: boolean;
    atmosphereEffects?: {
        fog?: boolean;
        particles?: 'dust' | 'stars' | 'sparks' | 'snow';
        lighting?: 'dim' | 'flickering' | 'bright' | 'neon';
        ambientSound?: string;
    };
};

export const ROOMS: Room[] = [
    // --- FREE TIER (1-3) ---
    {
        id: "room-1",
        title: "The Locked Study",
        difficulty: "Easy",
        duration: "5-7 mins",
        description: "You find yourself in a quiet, dust-filled study. The smell of old parchment and mahogany hangs in the air. A heavy oak door is the only exit, but it's locked tight. You need to find a way to unlock the desk and discover the key.",
        theme: "Mystery",
        imagePrompt: "Old victorian study room, cinematic lighting, dust motes in sunbeams",
        multiverseScenes: [
            "A cluttered mahogany study desk with a locked central drawer and a silver inkwell",
            "Floor-to-ceiling bookshelves overflowing with leather-bound volumes, some showing charred edges",
            "A massive grandfather clock with a cracked glass face and silent pendulum",
            "A heavy oak door with an ornate silver lock and a small brass plaque"
        ],
        hotspots: {
            0: [
                {
                    id: "h1_1", x: 45, y: 65, label: "Ink-stained Note", interactionType: "inspect",
                    description: "An old note on the desk states: 'When the city burned in the 17th century, the heat was enough to melt lead. The year of the Great Fire is the combination.'",
                    imagePrompt: "Close-up of a tattered note on a mahogany desk with a feather quill"
                },
                {
                    id: "h1_2", x: 20, y: 30, label: "Locked Drawer", interactionType: "inspect",
                    description: "The drawer is locked with a 4-digit combination. It seems related to the note.",
                    imagePrompt: "A close up of a desk drawer with a mechanical number lock"
                }
            ],
            1: [
                {
                    id: "h1_3", x: 30, y: 40, label: "History Book", interactionType: "open",
                    description: "You open 'The History of London'. A bookmark is placed at page 166, where an illustration depicts a massive fire engulfing the city. The chapter title reads: 'The Great Fire of London - September 2-6, 1666'. The text describes how the fire destroyed much of the medieval city.",
                    imagePrompt: "Close up of an open dusty book showing a medieval city on fire"
                }
            ],
            2: [
                {
                    id: "h1_4", x: 20, y: 55, label: "Grandfather Clock", interactionType: "inspect",
                    description: "The clock hands are frozen at 2:02. A small inscription on the base says: 'Time stops for no one, but the fire stopped here - September 1666.'",
                    imagePrompt: "The face of an old grandfather clock showing Roman numerals"
                }
            ]
        },
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "The desk drawer requires a 4-digit code. According to the note and history book, what year did the Great Fire of London occur?",
                type: 'code',
                answer: "1666",
                hints: ["The note mentions the 17th century (1600s).", "Check the history book on the shelf for a specific year.", "The year is standard historical knowledge for the Great Fire of London."],
                itemImagePrompt: "A mechanical 4-digit number lock on a wooden drawer",
                solution_explanation: "The Great Fire of London started on September 2, 1666."
            },
            {
                id: "p2",
                question: "The drawer slides open, revealing several items. One of them is a heavy metal object. Which item from the desk should you take to open the heavy oak door?",
                type: 'choice',
                options: ["The Feather Quill", "The Silver Inkwell", "The Brass Key", "The Paperweight"],
                answer: "The Brass Key",
                hints: ["Doors usually require a specific tool to unlock.", "Look for the most logical item to open a silver lock."],
                itemImagePrompt: "A shiny brass skeleton key sitting inside a velvet-lined drawer",
                solution_explanation: "The brass key is the only item that fits the lock on the door."
            }
        ]
    },
    {
        id: "room-2",
        title: "The Clockmaker’s Secret",
        difficulty: "Easy",
        duration: "8-10 mins",
        description: "Clocks of every size and shape line the walls of this workshop. The constant ticking has stopped, replaced by an eerie silence. Somewhere in here, the master clock hides the exit code.",
        theme: "Mystery",
        imagePrompt: "Steampunk clockmaker workshop with brass gears and glowing tubes",
        multiverseScenes: [
            "A workbench covered in tiny gears, springs, and a set of three specific table clocks",
            "A wall filled with hundreds of cuckoo clocks, all pointing to different times",
            "A massive central clock mechanism with a large 'Midnight' safe at its base",
            "A drafting table with blueprints for a 'Twin Sun' device"
        ],
        hotspots: {
            0: [
                {
                    id: "h2_1", x: 50, y: 50, label: "Table Clocks", interactionType: "inspect",
                    description: "Three clocks are lined up. They show 3:00, 6:00, and 9:00 respectively. There's an empty space for a fourth clock.",
                    imagePrompt: "Three ornate brass table clocks showing sequential times"
                }
            ],
            2: [
                {
                    id: "h2_2", x: 50, y: 80, label: "Workshop Safe", interactionType: "inspect",
                    description: "A heavy safe with a keypad. A scratched message on the metal reads: 'The code is when the sun is highest, twice'.",
                    imagePrompt: "Close-up of a digital keypad on a heavy metal safe"
                }
            ],
            3: [
                {
                    id: "h2_3", x: 40, y: 40, label: "Drafting Blueprint", interactionType: "inspect",
                    description: "The blueprint shows 12:00 labeled as both 'Apex' and 'Nadir'.",
                    imagePrompt: "A detailed blueprint of a clock mechanism with sun and moon symbols"
                }
            ]
        },
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "Observing the sequence on the table clocks (3:00, 6:00, 9:00), what time would the missing fourth clock show?",
                type: 'choice',
                options: ["10:00", "11:00", "12:00", "1:00"],
                answer: "12:00",
                hints: ["Look at the interval between 3, 6, and 9.", "Each clock is exactly 3 hours ahead of the last.", "9 + 3 = ?"],
                solution_explanation: "The sequence adds 3 hours at each step (3, 6, 9, 12)."
            },
            {
                id: "p2",
                question: "The safe requires a 4-digit code. Based on the clue 'highest sun, twice' and the blueprint, what is the code? (Input as four digits)",
                type: 'code',
                answer: "1212",
                hints: ["'Highest sun' refers to high noon (12:00).", "The clue says 'twice'.", "Put 12 and 12 together."],
                solution_explanation: "Noon is 12:00. 'Twice' means 12 followed by 12, resulting in 1212."
            }
        ]
    },
    {
        id: "room-3",
        title: "The Train That Never Left",
        difficulty: "Medium",
        duration: "10-15 mins",
        panoramicImage: "/rooms/room-3-panorama.webp",
        description: "You're aboard a vintage luxury train car. Outside the windows, only fog is visible. The train isn't moving, but the tickets suggest a destination you need to reach to escape.",
        theme: "Mystery",
        imagePrompt: "Vintage luxury train carriage interior with velvet seats and brass lamps",
        multiverseScenes: [
            "A plush velvet booth with a small table where a passenger's ticket was left behind",
            "A baggage rack with several suitcases, one of which has a strange circular lock",
            "A window looking out into thick, swirling gray fog",
            "A destination board with scrambled station names"
        ],
        hotspots: {
            0: [
                {
                    id: "h3_1", x: 45, y: 70, label: "Abandoned Ticket", interactionType: "inspect",
                    description: "A train ticket with the serial number '88088' printed in a bold, digital font. It looks the same even if you turn the paper around.",
                    imagePrompt: "A yellowed train ticket with large black digits"
                }
            ],
            1: [
                {
                    id: "h3_1b", x: 35, y: 75, label: "Ticket Stub", interactionType: "examine",
                    isSubtle: true,
                    description: "A torn ticket stub shows: 'Departure: Manchester | Destination: _______, England | Class: First'. The destination name has been smudged but the country is clear.",
                    imagePrompt: "A torn vintage train ticket with partial text visible"
                }
            ],
            2: [],
            3: [
                {
                    id: "h3_2", x: 50, y: 30, label: "Destination Board", interactionType: "inspect",
                    description: "The magnetic letters have fallen partially. It currently reads: 'N-O-D-N-O-L'. Below the board, a small sign says: 'Final Destination: Capital of England'.",
                    imagePrompt: "An old destination board with movable black letters"
                }
            ]
        },
        isPremium: false,
        puzzles: [
            {
                id: "p1",
                question: "The baggage lock requires a 5-digit code. The ticket (88088) has a special property mentioned in its description. If you were to look at the ticket in a mirror or rotate it 180 degrees, what number would you see?",
                type: 'code',
                answer: "88088",
                hints: ["Look at the shapes of the numbers 8 and 0.", "Do they look different when flipped upside down?", "The number is numerically symmetrical."],
                solution_explanation: "8 and 0 are vertically and horizontally symmetrical. Thus, 88088 remains 88088 when flipped."
            },
            {
                id: "p2",
                question: "The destination board is scrambled. Rearrange the letters 'N-O-D-N-O-L' to find the name of the final station where this train was headed.",
                type: 'code',
                answer: ["LONDON", "London"],
                hints: ["It's a major city in the UK.", "Try reading the letters in a different order.", "N-O-D... starts to look like 'DON'."],
                solution_explanation: "The letters N, O, D, N, O, L can be rearranged to form LONDON."
            }
        ]
    },
    // --- 10 NEW ROOMS (Integration) ---
    {
        id: "room-11",
        title: "The Locked Bookstore",
        difficulty: "Easy",
        duration: "10 mins",
        description: "The air here is heavy with the scent of vanilla and old paper. The shelves are packed with thousands of books, but something about the display in the window feels like a secret message waiting to be decoded.",
        theme: "Cozy",
        imagePrompt: "Cozy bookstore with mahogany shelves and a warm fireplace with amber glows",
        multiverseScenes: [
            "A cozy reading nook with a velvet armchair and a low table holding a 'Reader's Cipher' card",
            "A massive wall of books where one shelf is dedicated to 'The Alphabet of Mystery'",
            "A warm stone fireplace where a single book is displayed on the mantel",
            "The front glass window with the word 'READ' spelled out in gold-leaf book spines"
        ],
        hotspots: {
            0: [
                {
                    id: "h11_1", x: 50, y: 70, label: "Cipher Card", interactionType: "inspect",
                    description: "A small card on the table says: 'A=1, B=2, C=3... Z=26. The simplest code is often the most profound.'",
                    imagePrompt: "Close-up of a small handwritten card on a wooden table"
                }
            ],
            3: [
                {
                    id: "h11_2", x: 50, y: 30, label: "Golden Spines", interactionType: "inspect",
                    description: "Four prominent books are arranged to spell 'R-E-A-D'. Each has a number engraved on its spine corresponding to its letter.",
                    imagePrompt: "Close-up of four thick book spines with gold letters"
                }
            ]
        },
        isPremium: false,
        puzzles: [
            {
                id: "r11p1",
                question: "Using the code A=1, B=2, C=3 (and so on), translate the word 'READ' into a numeric code. (Input as numbers directly)",
                type: 'code',
                answer: "18514",
                hints: ["R is the 18th letter.", "E is the 5th.", "A is the 1st.", "D is the 4th letter."],
                solution_explanation: "R=18, E=5, A=1, D=4. Joined together, they form 18514."
            }
        ]
    },
    {
        id: "room-12",
        title: "Grandma’s Kitchen",
        difficulty: "Easy",
        duration: "10 mins",
        description: "The nostalgic aroma of cinnamon and sugar greets you. The kitchen is impeccably clean, but the oven is locked with a timer mechanism. You'll need to follow the recipe to get out.",
        theme: "Nostalgic",
        imagePrompt: "Warm 1950s kitchen with checkered floors and sunlight streaming through lace curtains",
        multiverseScenes: [
            "A checkered kitchen table with a mixing bowl and a handwritten recipe card",
            "A vintage mint-green oven with a digital lock where the temperature dial should be",
            "A pantry filled with jars of flour, sugar, and baking powder",
            "A window overlooking a sunny garden with a batch of cookies cooling on the sill"
        ],
        hotspots: {
            0: [
                {
                    id: "h12_1", x: 50, y: 40, label: "Recipe Card", interactionType: "inspect",
                    description: "The card reads: 'Perfect Cookies - 1 cup of flour makes exactly 2 cookies. Scale as needed for the family feast!'",
                    imagePrompt: "Handwritten recipe card with flour dusting"
                }
            ],
            3: [
                {
                    id: "h12_2", x: 50, y: 50, label: "Cooling Cookies", interactionType: "inspect",
                    description: "There are exactly 10 chocolate chip cookies cooling on the rack. They look delicious.",
                    imagePrompt: "A dozen cookies cooling on a wire rack"
                }
            ]
        },
        isPremium: false,
        puzzles: [
            {
                id: "r12p1",
                question: "According to the recipe (1 cup for 2 cookies), how many cups of flour would Grandma need to make the 10 cookies you see on the cooling rack?",
                type: 'code',
                answer: "5",
                hints: ["Divide the total number of cookies by 2.", "10 divided by 2 is..."],
                solution_explanation: "If 1 cup makes 2 cookies, then 10 cookies / 2 cookies per cup = 5 cups of flour."
            }
        ]
    },
    {
        id: "room-13",
        title: "The Beach Shack",
        difficulty: "Easy",
        duration: "12 mins",
        description: "A salty breeze and the distant sound of crashing waves. This small wooden shack is filled with treasures from the sea. A hidden compartment in the surfboard rack is the key to your escape.",
        theme: "Coastal",
        imagePrompt: "Rustic beach shack with surfboards, seashells, and hanging nets",
        multiverseScenes: [
            "A wall rack holding three colorful surfboards and a collection of sea glass",
            "A workbench covered in various seashells: conchs, scallops, and starfish",
            "An open window showing the white crests of the ocean waves",
            "A corner with a fishing net containing a small wooden chest"
        ],
        hotspots: {
            1: [
                {
                    id: "h13_1", x: 50, y: 50, label: "Shell Collection", interactionType: "inspect",
                    description: "You count 3 large conchs, 5 fan-shaped scallops, and 2 bright orange starfish on the bench.",
                    imagePrompt: "A variety of seashells arranged on a weathered wooden surface"
                }
            ]
        },
        isPremium: false,
        puzzles: [
            {
                id: "r13p1",
                question: "The wooden chest in the corner has a simple tally lock. What is the total number of 'sea treasures' (conchs, scallops, and starfish combined) you found on the workbench?",
                type: 'code',
                answer: "10",
                hints: ["Total = Conchs + Scallops + Starfish.", "3 + 5 + 2 = ?"],
                solution_explanation: "3 conchs + 5 scallops + 2 starfish = 10 total items."
            }
        ]
    },
    {
        id: "room-14",
        title: "The Abandoned Train Car",
        difficulty: "Medium",
        duration: "15 mins",
        description: "The metallic tang of rusted iron and ozone filled the air. This industrial transport car has ground to a halt. Sparking wires and dead consoles suggest a catastrophic power failure. You'll need to figure out the correct routing to restart the systems.",
        theme: "Industrial",
        imagePrompt: "Gritty industrial train car interior with sparking wires and glowing orange emergency lights",
        isPremium: true,
        multiverseScenes: [
            "A heavy electrical panel with missing fuses and a primary routing terminal",
            "A wall-mounted schematic showing complex wire paths and port numbers",
            "A storage locker containing specialized cables and a multimeter",
            "A view of the coupling mechanism through a grimy floor hatch"
        ],
        hotspots: {
            1: [
                {
                    id: "h14_1", x: 50, y: 40, label: "Routing Schematic", interactionType: "inspect",
                    description: "The faded schematic shows: 'System Alpha -> Port 3 (Standard Red). System Beta -> Port 2 (High-Voltage Blue).'",
                    imagePrompt: "A greasy, yellowed technical diagram pinned to a metal wall"
                }
            ],
            2: [
                {
                    id: "h14_2", x: 40, y: 60, label: "Cable Bundle", interactionType: "inspect",
                    description: "The blue cable is labeled 'Beta'. The red one is missing its tag.",
                    imagePrompt: "Close-up of thick, multicolored industrial wires"
                }
            ]
        },
        puzzles: [
            {
                id: "r14p1",
                question: "Following the routing schematic in the room, where should you connect Wire B (the Blue 'System Beta' cable)?",
                type: 'choice',
                options: ["Port 1", "Port 2", "Port 3", "Port 4"],
                answer: "Port 2",
                hints: ["Check the schematic on the wall.", "Beta is specifically linked to one port number.", "The blue cable matches System Beta."],
                solution_explanation: "The schematic explicitly states: 'System Beta -> Port 2'."
            }
        ]
    },
    {
        id: "room-15",
        title: "The Clockmaker’s Workshop",
        difficulty: "Medium",
        duration: "18 mins",
        description: "Enormous brass gears hum with a low vibration. This is the heart of the great clock. The workshop is a labyrinth of ticking mechanisms. To unlock the exit, you must solve a precision mechanical riddle.",
        theme: "Steampunk",
        imagePrompt: "Steampunk workshop with giant gears, brass pipes, and hissing steam vents",
        isPremium: true,
        multiverseScenes: [
            "A secondary gear assembly where Gear A and Gear B are interlocked",
            "A tool board where calipers and specialized lubricants are kept",
            "A steam valve station with three pressure gauges",
            "A hidden floor plate that reveals the drive shaft"
        ],
        hotspots: {
            0: [
                {
                    id: "h15_1", x: 30, y: 40, label: "Gear A", interactionType: "inspect",
                    description: "This small gear is made of steel. You count exactly 10 teeth.",
                    imagePrompt: "Close-up of a small, polished metal gear"
                },
                {
                    id: "h15_2", x: 60, y: 30, label: "Gear B", interactionType: "inspect",
                    description: "This large gear is twice the size of Gear A. You count 20 teeth.",
                    imagePrompt: "Close-up of a large brass gear with many teeth"
                }
            ]
        },
        puzzles: [
            {
                id: "r15p1",
                question: "Gear A (10 teeth) is directly driving Gear B (20 teeth). If Gear A completes 2 full rotations, how many times will Gear B rotate?",
                type: 'code',
                answer: "1",
                hints: ["Larger gears with more teeth spin slower than smaller ones.", "Calculate the total number of teeth that pass: 10 teeth * 2 rotations = 20 teeth.", "How many times does Gear B (20 teeth) turn to let 20 teeth pass?"],
                solution_explanation: "Total teeth moved = 10 * 2 = 20. Gear B has 20 teeth, so it completes 20/20 = 1 rotation."
            }
        ]
    },
    {
        id: "room-16",
        title: "The Underground Speakeasy",
        difficulty: "Medium",
        duration: "20 mins",
        description: "The rhythmic thumping of jazz permeates the walls. This hidden bar is full of secrets. The code to the exit isn't written down—it's played.",
        theme: "Noir",
        imagePrompt: "Dimly lit 1920s speakeasy with a jazz stage, blue smoke, and velvet curtains",
        isPremium: true,
        multiverseScenes: [
            "A circular bar with a drink menu that serves more than just beverages",
            "A small stage where a saxophone sits on a stand, still warm",
            "A VIP booth with a locked briefcase and a stack of coins",
            "A heavy steel door hidden behind a large portrait of a cabaret singer"
        ],
        hotspots: {
            0: [
                {
                    id: "h16_1", x: 50, y: 40, label: "Drink Menu", interactionType: "inspect",
                    description: "The menu has a Cipher: 'A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7'.",
                    imagePrompt: "Close-up of an elegant, Art Deco style menu"
                }
            ],
            1: [
                {
                    id: "h16_2", x: 50, y: 60, label: "Sheet Music", interactionType: "inspect",
                    description: "A small scrap of music on the stand has three notes circled: B, A, and G.",
                    imagePrompt: "Close-up of a handwritten musical staff with three notes"
                }
            ]
        },
        puzzles: [
            {
                id: "r16p1",
                question: "Using the Menu Cipher (A=1, B=2...) and the circled notes from the saxophone stand (B, A, G), what is the 3-digit code to the hidden exit?",
                type: 'code',
                answer: "217",
                hints: ["Check the Menu in the bar area for the number mapping.", "B is 2.", "A is 1.", "G is the 7th letter."],
                solution_explanation: "B=2, A=1, G=7. Together they form 217."
            }
        ]
    },
    {
        id: "room-17",
        title: "The Lost Observatory",
        difficulty: "Medium",
        duration: "20 mins",
        description: "Silence reigns under the great dome. The massive telescope is aligned with the heavens, but the planetary orientation is flawed. You must restore the ancient order of the spheres.",
        theme: "Astronomy",
        imagePrompt: "Ancient observatory with a massive brass telescope and a star-chart ceiling",
        isPremium: true,
        multiverseScenes: [
            "The main telescope assembly pointing towards the Zenith",
            "An orrery (planetary model) with several spheres out of alignment",
            "A celestial map showing the movement of the inner planets",
            "A pedestal with the 'Guardian of the Dome' inscription"
        ],
        hotspots: {
            1: [
                {
                    id: "h17_1", x: 50, y: 50, label: "Sun Orrery", interactionType: "inspect",
                    description: "The planetary model lists: 1. Mercury, 2. Venus, 3. [MISSING], 4. Mars.",
                    imagePrompt: "Close-up of a brass mechanical model of the solar system"
                }
            ],
            2: [
                {
                    id: "h17_2", x: 40, y: 30, label: "Celestial Map", interactionType: "inspect",
                    description: "The map shows our home world as the third sphere orbiting the sun.",
                    imagePrompt: "An ancient map of the solar system on vellum"
                }
            ]
        },
        puzzles: [
            {
                id: "r17p1",
                question: "Based on the Planet Order provided by the Orrery (Mercury, Venus, ?, Mars), what is the missing third planet from the Sun?",
                type: 'code',
                answer: ["Earth", "earth"],
                hints: ["It's our home planet.", "Known as the Blue Planet.", "Third rock from the sun."],
                solution_explanation: "The order of planets from the sun is Mercury, Venus, Earth, then Mars."
            }
        ]
    },
    {
        id: "room-18",
        title: "The AI Containment Lab",
        difficulty: "Hard",
        duration: "25 mins",
        description: "A clinical, white environment where a rogue AI has initiated lockout. Blue emergency screens flicker with fragments of code. You need to bypass the security logic gate to prevent permanent containment.",
        theme: "Sci-Fi",
        imagePrompt: "Futuristic lab with glowing blue screens, robotic arms, and a central AI core pulsating with light",
        isPremium: true,
        multiverseScenes: [
            "The main AI mainframe console with a sequence of logic inputs",
            "A server rack with status LEDs and a diagnostic tablet",
            "A high-security airlock door with a manual override port",
            "A window showing a cold, sterile observation deck"
        ],
        hotspots: {
            0: [
                {
                    id: "h18_1", x: 50, y: 30, label: "Diagnostic Tablet", interactionType: "inspect",
                    description: "The tablet shows the current state of variables: A = TRUE, B = TRUE, C = TRUE.",
                    imagePrompt: "Close-up of a cracked tablet screen showing line of code"
                }
            ],
            1: [
                {
                    id: "h18_2", x: 40, y: 50, label: "Logic Keypad", interactionType: "inspect",
                    description: "A sticker on the terminal explains the system logic: '(A AND B) OR NOT C'. Output 1 for True, 0 for False.",
                    imagePrompt: "Close-up of a digital keypad with mathematical symbols"
                }
            ]
        },
        puzzles: [
            {
                id: "r18p1",
                question: "The security override requires the output of the logical expression: '(A AND B) OR NOT C'. If all three inputs (A, B, and C) are currently TRUE (value of 1), what is the final numeric output?",
                type: 'code',
                answer: "1",
                hints: ["(1 AND 1) results in 1.", "NOT 1 results in 0.", "Now calculate: 1 OR 0."],
                solution_explanation: "(True AND True) is True. (NOT True) is False. (True OR False) is True, which is represented by 1."
            }
        ]
    },
    {
        id: "room-19",
        title: "The Sunken Cathedral",
        difficulty: "Hard",
        duration: "30 mins",
        description: "The sound of muffled bells echoes through the dark water. Bioluminescent coral illuminates the ancient stone arches of this underwater sanctuary. You must play the correct sequence on the bells to cause the cathedral to rise.",
        theme: "Mythic",
        imagePrompt: "Underwater cathedral with bioluminescent coral and giant kelp swaying in the current",
        isPremium: true,
        multiverseScenes: [
            "A set of three massive bells hanging from a stone rotunda: Low, Medium, and High",
            "A stone altar with a damp, ancient scroll depicting a melody",
            "An intricate mosaic on the floor showing three sizes of bells",
            "A view of the ocean surface far above, through a crack in the ceiling"
        ],
        hotspots: {
            1: [
                {
                    id: "h19_1", x: 50, y: 40, label: "Damp Scroll", interactionType: "inspect",
                    description: "The scroll depicts a sequence of icons: Sun (High), Sea (Low), Mountain (Medium), Sea (Low). Below them are numbers: 1=Low, 2=Medium, 3=High.",
                    imagePrompt: "An ancient, water-damaged scroll with simplified drawings"
                }
            ]
        },
        puzzles: [
            {
                id: "r19p1",
                question: "The sequence depicted on the altar's scroll is: High, Low, Medium, Low. Using the numeric key provided (Low=1, Medium=2, High=3), what is the 4-digit code to activate the bells?",
                type: 'code',
                answer: "3121",
                hints: ["Translate each tone to its number one by one.", "High is 3.", "Low is 1.", "Medium is 2."],
                solution_explanation: "High-3, Low-1, Medium-2, Low-1. The resulting code is 3121."
            }
        ]
    },
    {
        id: "room-20",
        title: "The Fractured Timeline",
        difficulty: "Hard",
        duration: "35 mins",
        description: "Gravity feels strange here. Furniture from different centuries is scattered across the room. A tall Victorian clock stands next to a holographic calendar. You must restore the event sequence to repair the timeline.",
        theme: "Time Travel",
        imagePrompt: "A room where Victorian furniture and futuristic tech are merged in a chaotic vortex",
        isPremium: true,
        multiverseScenes: [
            "A library corner where books are rapidly aging and then becoming new again",
            "A workshop table where a futuristic engine is being repaired with primitive tools",
            "A series of portraits of the same building across different centuries",
            "A central temporal rift that displays a specific date: 1895"
        ],
        hotspots: {
            3: [
                {
                    id: "h20_1", x: 50, y: 50, label: "Temporal Rift", interactionType: "inspect",
                    description: "A glowing rift in the air shows a vision of the library's foundation stone being laid. The year 1895 is pulsing in golden light.",
                    imagePrompt: "A shimmering blue rift in the air showing a construction scene"
                }
            ]
        },
        puzzles: [
            {
                id: "r20p1",
                question: "The timeline repair terminal asks for the 'Primary Origin Year'. According to the vision in the temporal rift, what year was the library first built?",
                type: 'code',
                answer: "1895",
                hints: ["Inspect the rift in the room for a vision of the past.", "Look for a 4-digit year in the rift."],
                solution_explanation: "The temporal rift shows the building's foundation in 1895."
            }
        ]
    },
    // --- PRO TIER (4-6) ---
    {
        id: "room-4",
        title: "The Forgotten Classroom",
        difficulty: "Medium",
        duration: "15 mins",
        description: "The smell of chalk and old dust fills this abandoned schoolroom. Silence hangs where laughter once lived. A math sequence left on the blackboard seems to be the lock for the exit.",
        theme: "Horror",
        imagePrompt: "Abandoned classroom with overturned desks and a dusty blackboard",
        isPremium: true,
        multiverseScenes: [
            "A dusty blackboard with a mathematical sequence: 2, 4, 8, 16...",
            "A row of old wooden desks, one of which has a number carved into it",
            "A bookshelf full of tattered textbooks and a broken globe",
            "The classroom door with a heavy padlock and a symbol of an 'Infinity' loop"
        ],
        hotspots: {
            0: [
                {
                    id: "h4_1", x: 50, y: 30, label: "Blackboard", interactionType: "inspect",
                    description: "The chalk writing shows: 2, 4, 8, 16, and a large question mark. Below it, it says: 'Exponential Growth is the key.'",
                    imagePrompt: "Close-up of a blackboard with chalk numbers"
                }
            ]
        },
        puzzles: [
            {
                id: "p1",
                question: "Looking at the sequence on the board (2, 4, 8, 16), which number comes next? (Hint: The pattern is doubling)",
                type: 'code',
                answer: "32",
                hints: ["Each number is the previous number multiplied by 2.", "16 * 2 = ?"],
                solution_explanation: "The sequence is 2^1, 2^2, 2^3, 2^4. The next number is 2^5, which is 32."
            }
        ]
    },
    {
        id: "room-5",
        title: "The Lighthouse Signal",
        difficulty: "Medium",
        duration: "15-20 mins",
        description: "Waves crash against the stone base of the lighthouse as lightning illuminates the spiral staircase. The signal lantern is dead. You need to send a distress signal to call for help and unlock the rescue boat.",
        theme: "Mystery",
        imagePrompt: "Lighthouse lantern room with a giant lens and a telegraph desk",
        isPremium: true,
        multiverseScenes: [
            "A brass telegraph machine on a wooden desk with a code book",
            "The giant Fresnel lens of the lighthouse lantern, currently dark",
            "A window looking out at a raging storm and a distant ship",
            "A chart of Morse code symbols pinned to the wall"
        ],
        hotspots: {
            0: [
                {
                    id: "h5_1", x: 50, y: 40, label: "Telegraph Desk", interactionType: "inspect",
                    description: "A manual next to the telegraph states: 'Standard Distress Signal: Three short, three long, three short. No spaces.'",
                    imagePrompt: "Close-up of a brass telegraph key"
                }
            ],
            3: [
                {
                    id: "h5_2", x: 50, y: 50, label: "Morse Chart", interactionType: "inspect",
                    description: "The chart shows: S = '...' and O = '---'.",
                    imagePrompt: "A simple chart with dots and dashes"
                }
            ]
        },
        puzzles: [
            {
                id: "p1",
                question: "Using the Morse code chart (S = ... and O = ---), input the full 9-character code for the universal distress signal 'SOS'.",
                type: 'code',
                answer: "...---...",
                hints: ["Append the Morse for S, then O, then S.", "The sequence should be exactly 9 characters long (dots and dashes)."],
                solution_explanation: "S(...) + O(---) + S(...) = ...---..."
            }
        ]
    },
    {
        id: "room-6",
        title: "The Underground Vault",
        difficulty: "Hard",
        duration: "25 mins",
        description: "The air is chilled by the high-tech cooling systems of this high-security vault. Laser grids dance across the floor. To bypass the final security layer, you must follow the technician's override protocol.",
        theme: "Sci-Fi",
        imagePrompt: "Cyberpunk bank vault with glowing laser grids and a chrome central hub",
        isPremium: true,
        multiverseScenes: [
            "A central security hub with exposed wiring",
            "A laser grid guarding a wall of safe deposit boxes",
            "A technician's locker containing a manual with emergency protocols",
            "The vault door with a biometric scanner and a manual bypass panel"
        ],
        hotspots: {
            2: [
                {
                    id: "h6_1", x: 50, y: 30, label: "Technician's Manual", interactionType: "inspect",
                    description: "The manual states: 'EMERGENCY BYPASS: In case of system lock, the Blue wire must be disconnected ONLY if the Red power line is active. Do not touch Red.'",
                    imagePrompt: "Close-up of a technical manual with red and blue diagrams"
                }
            ],
            0: [
                {
                    id: "h6_2", x: 40, y: 60, label: "Wire Housing", interactionType: "inspect",
                    description: "The housing is open. The Red power line is glowing brightly, indicating it is active.",
                    imagePrompt: "An open electrical panel with glowing wires"
                }
            ]
        },
        puzzles: [
            {
                id: "p1",
                question: "The Red power line is active. According to the technician's manual, which wire should you cut to trigger the bypass?",
                type: 'choice',
                options: ["Red", "Blue", "Green", "Yellow"],
                answer: "Blue",
                hints: ["Read the manual in the locker carefully.", "What does it say to do if Red is active?", "It warns never to touch Red."],
                solution_explanation: "The manual says: 'Blue wire must be disconnected ONLY if Red is active.' Since Red is active, cutting Blue is the correct action."
            }
        ]
    },
    // --- ELITE TIER (7-10) ---
    {
        id: "room-7",
        title: "The Astronomer’s Room",
        difficulty: "Hard",
        duration: "25 mins",
        description: "The celestial sphere rotates slowly above your head. This chamber is dedicated to the giants of the solar system. A massive telescope is fixed on a distant point, and the data it streams holds the key to the exit.",
        theme: "Sci-Fi",
        imagePrompt: "Observatory dome with a massive brass telescope pointing at a swirling gas giant",
        isPremium: true,
        multiverseScenes: [
            "A control console with star-chart coordinates and magnifying lenses",
            "The main telescope eyepiece showing a massive, banded planet",
            "A wall of portraits of famous astronomers: Galileo, Kepler, and Hubble",
            "A star map with four bright dots orbiting a large central planet"
        ],
        hotspots: {
            3: [
                {
                    id: "h7_1", x: 50, y: 50, label: "Star Map", interactionType: "inspect",
                    description: "The map shows Jupiter surrounded by four bright moons: Io, Europa, Ganymede, and Callisto. They are labeled as the 'Galilean Moons'.",
                    imagePrompt: "A detailed map of Jupiter and its moons on a digital screen"
                }
            ],
            1: [
                {
                    id: "h7_2", x: 50, y: 40, label: "Eyepiece", interactionType: "inspect",
                    description: "Through the telescope, you see a magnificent, striped gas giant with a Great Red Spot.",
                    imagePrompt: "The view through a telescope showing a detailed Jupiter"
                }
            ]
        },
        puzzles: [
            {
                id: "p1",
                question: "According to the star map and your observations of the 'Galilean Moons' (Io, Europa, Ganymede, Callisto), which planet in our solar system are you currently observing?",
                type: 'choice',
                options: ["Venus", "Jupiter", "Saturn", "Neptune"],
                answer: "Jupiter",
                hints: ["The planet has 4 major 'Galilean' moons.", "It is the largest planet in our system.", "It is a gas giant with beautiful stripes."],
                solution_explanation: "Jupiter is the only planet with the four Galilean moons (Io, Europa, Ganymede, and Callisto)."
            }
        ]
    },
    {
        id: "room-8",
        title: "The Trial of Silence",
        difficulty: "Hard",
        duration: "30 mins",
        description: "A perfectly silent, soundproof chamber. No echo, no background noise—only the sound of your own heartbeat. To exit, you must find the resonance that breaks the silence.",
        theme: "Abstract",
        imagePrompt: "White padded room with advanced acoustic panels and a central frequency generator",
        isPremium: true,
        multiverseScenes: [
            "A sleek frequency generator with a large digital display",
            "A resonant crystal suspended in a glass vacuum tube",
            "A tuning fork engraved with the letter 'A' and the number 4",
            "A control panel for the acoustic dampening system"
        ],
        hotspots: {
            2: [
                {
                    id: "h8_1", x: 50, y: 50, label: "Engraved Tuning Fork", interactionType: "inspect",
                    description: "The tuning fork is labeled 'A4'. A small plaque nearby says: 'Concert Pitch - The standard frequency for calibration.'",
                    imagePrompt: "Close-up of a silver tuning fork with engravings"
                }
            ],
            0: [
                {
                    id: "h8_2", x: 50, y: 40, label: "Acoustic Manual", interactionType: "inspect",
                    description: "The manual states: 'Standard A4 Frequency is 440 Hz. Precise calibration is required for the resonance chamber.'",
                    imagePrompt: "A digital display showing technical acoustic data"
                }
            ]
        },
        puzzles: [
            {
                id: "p1",
                question: "To break the silence and trigger the exit, you must set the frequency generator to the standard 'Concert Pitch' for an A4 note. What frequency (in Hz) do you input?",
                type: 'choice',
                options: ["261 Hz", "440 Hz", "512 Hz", "880 Hz"],
                answer: "440 Hz",
                hints: ["Check the manual or the tuning fork plaque in the room.", "Standard tuning for most instruments uses this middle-A frequency.", "The number is in the 400s."],
                solution_explanation: "Standard concert pitch for the note A4 is 440 Hz."
            }
        ]
    },
    {
        id: "room-9",
        title: "The Archivist’s Paradox",
        difficulty: "Expert",
        duration: "35 mins",
        description: "This library exists in multiple states at once. The shelves shift when you aren't looking. You are trapped in a quantum superposition, and only by observing the correct truth can you collapse the exit into existence.",
        theme: "Abstract",
        imagePrompt: "Endless, shifting library with books floating in mid-air and glowing particles",
        isPremium: true,
        multiverseScenes: [
            "A floating desk with a 'Quantum Primer' book",
            "A glass display case containing a cat that is both sleeping and awake",
            "A series of monitors showing interference patterns",
            "A central pedestal with a 'Probability Lock'"
        ],
        hotspots: {
            0: [
                {
                    id: "h9_1", x: 50, y: 30, label: "Quantum Primer", interactionType: "open",
                    description: "You read a passage: 'In quantum mechanics, a system remains in all possible states until an observation is made. This transition is known as the collapse of the Wave Function.'",
                    imagePrompt: "Close-up of an open book with glowing diagrams of subatomic particles"
                }
            ],
            1: [
                {
                    id: "h9_2", x: 50, y: 50, label: "Schrodinger's Display", interactionType: "inspect",
                    description: "The display mentions that looking into the box forces a choice between two realities. The act of looking triggers the 'Collapse'.",
                    imagePrompt: "A high-tech glass box containing a holographic cat"
                }
            ]
        },
        puzzles: [
            {
                id: "p1",
                question: "According to the Quantum Primer, what is the scientific name for the phenomenon where a multi-state system 'collapses' into a single reality when observed?",
                type: 'choice',
                options: ["Quantum Tunneling", "A Wave Function", "Entanglement", "Superposition"],
                answer: "A Wave Function",
                hints: ["It's something that 'collapses'.", "Schrodinger's cat is in a 'superposition', but the act of looking causes this to disappear.", "Check the Primer text for the specific term."],
                solution_explanation: "The 'Wave Function' is the mathematical description that collapses upon observation."
            }
        ]
    },
    {
        id: "room-10",
        title: "The Final Door",
        difficulty: "Expert",
        duration: "40 mins",
        description: "The ultimate destination of the simulation. A monolithic door of pure light stands before you. There is no lock, only a single input field. To cross the threshold, you must provide the meaning of everything.",
        theme: "Abstract",
        imagePrompt: "Giant monolithic door made of pure white light in a starry void",
        isPremium: true,
        multiverseScenes: [
            "The Great Pillar of Input, glowing with faint digital characters",
            "A floating terminal with the label 'Project: Deep Thought'",
            "The starry void surrounding the platform, showing constellations of code",
            "A plaque that says: 'Wait, don't panic.'"
        ],
        hotspots: {
            1: [
                {
                    id: "h10_1", x: 50, y: 40, label: "Ancient Terminal", interactionType: "inspect",
                    description: "The terminal displays: 'The answer to the ultimate question of life, the universe, and everything. Calculation time: 7.5 million years. Result: 42.'",
                    imagePrompt: "Close-up of a holographic terminal showing the number 42"
                }
            ],
            3: [
                {
                    id: "h10_2", x: 50, y: 70, label: "Bronze Plaque", interactionType: "inspect",
                    description: "A small bronze plaque is bolted to the platform. It simply says 'DON'T PANIC' in large, friendly letters.",
                    imagePrompt: "A bronze rectangular plaque with large embossed letters"
                }
            ]
        },
        puzzles: [
            {
                id: "p1",
                question: "The Pillar of Input demands the answer to 'Life, the Universe, and Everything'. Based on the 7.5 million year calculation found on the terminal, what is the numeric answer?",
                type: 'code',
                answer: "42",
                hints: ["Check the terminal with 'Deep Thought'.", "It's a single 2-digit number.", "No need to panic."],
                solution_explanation: "According to 'The Hitchhiker's Guide to the Galaxy', the answer is 42."
            }
        ]
    }
];
