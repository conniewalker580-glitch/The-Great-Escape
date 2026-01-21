import { Room } from "./types";

export const extraRooms: Room[] = [
    {
        id: "room-21",
        title: "Neon City Heights",
        difficulty: "Medium",
        duration: "25 mins",
        description: "You're trapped on a penthouse balcony in a sprawling cyberpunk metropolis. The door is locked, and the only way out is to hack the security terminal before the acid rain storm hits.",
        theme: "Cyberpunk",
        imagePrompt: "Futuristic cyberpunk rooftop balcony with neon signs, rain, and a datapad terminal",
        isPremium: true,
        multiverseScenes: [
            "Holographic advertisements floating in the rain, illuminating the wet deck",
            "A locked glass door with a high-tech glowing keypad interface",
            "A delivery drone hovering nearby with a package",
            "A view of the dizzying city streets far below with flying cars"
        ],
        hotspots: {
            0: [
                {
                    id: "h11_1", x: 60, y: 50, label: "Security Keypad", interactionType: "inspect",
                    description: "The keypad requires a 4-digit code. Someone scratched 'Blade Runner Year' into the metal nearby.",
                    imagePrompt: "Close up of a futuristic keypad with scratched graffiti"
                }
            ],
            3: [
                {
                    id: "h11_2", x: 40, y: 60, label: "Discarded Advertisement", interactionType: "inspect",
                    description: "A poster for the movie 'Blade Runner 2049'.",
                    imagePrompt: "A wet, torn holographic movie poster"
                }
            ]
        },
        puzzles: [
            {
                id: "p11_1",
                question: "The graffiti mentions 'Blade Runner Year'. The poster helps clarify which one. What is the 4-digit year associated with the movie title found on the balcony?",
                type: 'code',
                answer: "2049",
                hints: ["Look at the movie poster.", "It's in the title.", "20xx"],
                solution_explanation: "The movie poster is for Blade Runner 2049."
            }
        ]
    },
    {
        id: "room-22",
        title: "The Steam Engine",
        difficulty: "Medium",
        duration: "30 mins",
        description: "Inside the engine room of a massive steampunk airship. Pressure is building up. You must stabilize the core by adjusting the valves correctly.",
        theme: "Steampunk",
        imagePrompt: "Steampunk engine room with brass pipes, gears, valves and steam venting",
        isPremium: true,
        multiverseScenes: [
            "A large central furnace with pressure gauges hitting the red zone",
            "A complex array of five brass wheels labeled A, B, C, D, E",
            "A schematic diagram on the wall showing valve flow",
            "A steam vent hissing violently"
        ],
        hotspots: {
            1: [
                {
                    id: "h12_1", x: 50, y: 50, label: "Brass Wheels", interactionType: "inspect",
                    description: "Five wheels. The manual says: 'To flush the system, open valves in alphabetical order, skipping every second letter.'",
                    imagePrompt: "Row of brass control wheels"
                }
            ],
            2: [
                {
                    id: "h12_2", x: 50, y: 40, label: "Schematic", interactionType: "inspect",
                    description: "Diagram shows A, B, C, D, E. It warns: 'Follow the manual strictly.'",
                    imagePrompt: "Engineering blueprint of the valve system"
                }
            ]
        },
        puzzles: [
            {
                id: "p12_1",
                question: "The manual says: 'Open valves in alphabetical order (A, B, C, D, E), skipping every second letter.' Which valves do you open, in order? (Enter letters)",
                type: 'code',
                answer: "ACE",
                hints: ["Start with A.", "Skip B.", "Next is C.", "Skip D.", "Next is E."],
                solution_explanation: "Alphabetical start A, skip B -> C, skip D -> E. Result: ACE."
            }
        ]
    },
    {
        id: "room-23",
        title: "Deep Blue Lab",
        difficulty: "Hard",
        duration: "45 mins",
        description: "An abandoned underwater biolab. Some specimens have escaped. You need to mix the antidote to unlock the quarantine seal.",
        theme: "Sci-Fi",
        imagePrompt: "Underwater laboratory with blue lighting, glass tunnels, and floating specimens",
        isPremium: true,
        multiverseScenes: [
            "A chemistry station with colored vials",
            "A large window looking out into the dark ocean",
            "A broken specimen tank, glass shattered",
            "A computer terminal with 'Formula Required' on screen"
        ],
        hotspots: {
            0: [
                {
                    id: "h13_1", x: 50, y: 60, label: "Vials", interactionType: "inspect",
                    description: "Red, Blue, Yellow, Green. Note says: 'Green is toxic. Purple is the cure. Red + Blue = Purple.'",
                    imagePrompt: "Rack of glowing test tubes"
                }
            ],
            3: [
                {
                    id: "h13_2", x: 50, y: 50, label: "Computer Terminal", interactionType: "inspect",
                    description: "Input the two colors to mix for the cure.",
                    imagePrompt: "Computer screen awaiting textual input"
                }
            ]
        },
        puzzles: [
            {
                id: "p13_1",
                question: "The note identifies the cure as Purple. Which two available colors (Red, Blue, Yellow, Green) must be mixed to create Purple? (Enter as 'Color1 and Color2')",
                type: 'choice',
                options: ["Red and Yellow", "Blue and Yellow", "Red and Blue", "Green and Red"],
                answer: "Red and Blue",
                hints: ["Basic color theory.", "Red + Blue = ?", "Purple."],
                solution_explanation: "Red mixed with Blue makes Purple."
            }
        ]
    },
    {
        id: "room-24",
        title: "Crimson Manor",
        difficulty: "Easy",
        duration: "20 mins",
        description: "A spooky Victorian hallway. The portraits seem to watch you. One of them holds the key to the exit.",
        theme: "Horror",
        imagePrompt: "Dark victorian hallway with red carpet, candlelight, and creepy portraits",
        isPremium: true,
        multiverseScenes: [
            "A portrait of a weeping lady",
            "A portrait of a stern general pointing a finger",
            "A portrait of a laughing child holding a toy",
            "A heavy oak door with no handle"
        ],
        hotspots: {
            1: [
                {
                    id: "h14_1", x: 50, y: 40, label: "Stern General", interactionType: "inspect",
                    description: "He is pointing directly at the floor beneath the weeping lady.",
                    imagePrompt: "Oil painting of a general"
                }
            ],
            0: [
                {
                    id: "h14_2", x: 50, y: 40, label: "Weeping Lady", interactionType: "inspect",
                    description: "Beneath her frame, loose floorboards.",
                    imagePrompt: "Oil painting of a sad woman"
                }
            ]
        },
        puzzles: [
            {
                id: "p14_1",
                question: "The General points to the location of the key. Where should you look?",
                type: 'choice',
                options: ["Under the General", "Under the Child", "Under the Weeping Lady", "In the Door"],
                answer: "Under the Weeping Lady",
                hints: ["Follow the General's finger.", "He isn't pointing at himself.", "Who is he looking/pointing towards?"],
                solution_explanation: "The General points at the floor beneath the Weeping Lady."
            }
        ]
    },
    {
        id: "room-25",
        title: "Mars Outpost Alpha",
        difficulty: "Hard",
        duration: "35 mins",
        description: "Oxygen levels are critical. You are in the control center of a Mars colony. You must realign the solar arrays to restore power.",
        theme: "Space",
        imagePrompt: "Mars colony interior, red dust outside window, sleek white panels, red emergency lights",
        isPremium: true,
        multiverseScenes: [
            "Main console with 'Power Offline' warning",
            "Window looking out at the red Martian landscape",
            "Solar Array manual on a desk",
            "Emergency oxygen masks hanging from ceiling"
        ],
        hotspots: {
            2: [
                {
                    id: "h15_1", x: 50, y: 50, label: "Manual", interactionType: "inspect",
                    description: "To maximize efficiency, the angle must equal the latitude. We are at 45 degrees North.",
                    imagePrompt: "Technical manual page"
                }
            ]
        },
        puzzles: [
            {
                id: "p15_1",
                question: "The manual states the solar array angle must match the colony's latitude. The colony is at 45 degrees North. What angle should you input?",
                type: 'code',
                answer: "45",
                hints: ["Read the manual.", "It equals the latitude.", "Just the number."],
                solution_explanation: "The latitude is 45, so the angle is 45."
            }
        ]
    },
    {
        id: "room-26",
        title: "Pharaoh's Tomb",
        difficulty: "Medium",
        duration: "30 mins",
        description: "You have fallen into a hidden chamber. Hieroglyphs cover the walls. You must speak the name of the Sun God to open the stone slab.",
        theme: "Ancient",
        imagePrompt: "Ancient Egyptian tomb interior, sandstone walls, torches, hieroglyphs",
        isPremium: true,
        multiverseScenes: [
            "A large stone door with no handle",
            "Wall of hieroglyphs depicting the sun",
            "A statue of a falcon-headed god",
            "A pile of ancient gold coins"
        ],
        hotspots: {
            2: [
                {
                    id: "h16_1", x: 50, y: 40, label: "Falcon Statue", interactionType: "inspect",
                    description: "It represents Horus. But the door requires the name of the Sun God, the disk above his head.",
                    imagePrompt: "Statue of Horus"
                }
            ],
            1: [
                {
                    id: "h16_2", x: 60, y: 50, label: "Sun Glyphs", interactionType: "inspect",
                    description: "The glyphs praise 'Ra', the ruler of the sky.",
                    imagePrompt: "Carvings of the sun disk"
                }
            ]
        },
        puzzles: [
            {
                id: "p16_1",
                question: "The door demands the name of the Sun God. The glyphs mention him. What is his name?",
                type: 'code',
                answer: "Ra",
                hints: ["Two letters.", "Sun God.", "R..."],
                solution_explanation: "Ra is the Egyptian Sun God."
            }
        ]
    },
    {
        id: "room-27",
        title: "Noir Office",
        difficulty: "Medium",
        duration: "30 mins",
        description: "Black and white film grain. It's raining outside. The detective is missing. Clue is in the safe.",
        theme: "Mystery",
        imagePrompt: "1940s detective office, black and white noir style, Venetian blinds shadows",
        isPremium: true,
        multiverseScenes: [
            "A messy desk with a rotary phone",
            "A safe in the corner",
            "A coat rack with a trench coat",
            "The door with a frosted glass window"
        ],
        hotspots: {
            0: [
                {
                    id: "h17_1", x: 50, y: 60, label: "Desk Calendar", interactionType: "inspect",
                    description: "Circled date: October 31st.",
                    imagePrompt: "Old paper calendar"
                }
            ],
            1: [
                {
                    id: "h17_2", x: 50, y: 70, label: "Safe", interactionType: "inspect",
                    description: "4-digit combo. 'The date I disappeared.'",
                    imagePrompt: "Steel safe dial"
                }
            ]
        },
        puzzles: [
            {
                id: "p17_1",
                question: "The safe combination is the date circled on the calendar (MonthDay). What is the 4-digit code?",
                type: 'code',
                answer: "1031",
                hints: ["October is the 10th month.", "Date is 31.", "Combine them."],
                solution_explanation: "October 31st = 1031."
            }
        ]
    },
    {
        id: "room-28",
        title: "Sugar Rush Factory",
        difficulty: "Easy",
        duration: "25 mins",
        description: "A bright, colorful candy factory. The chocolate river is flowing. To exit, you must sort the jellybeans.",
        theme: "Fantasy",
        imagePrompt: "Willy Wonka style candy factory, chocolate river, giant lollipops, bright colors",
        isPremium: true,
        multiverseScenes: [
            "Giant clear pipes pumping colorful candy",
            "A control panel made of licorice",
            "A vat of swirling chocolate",
            "The heavy exit door made of jawbreakers"
        ],
        hotspots: {
            1: [
                {
                    id: "h18_1", x: 50, y: 50, label: "Licorice Panel", interactionType: "inspect",
                    description: "Buttons: Red, Blue, Green. 'Primary Colors Only'.",
                    imagePrompt: "Colorful buttons"
                }
            ]
        },
        puzzles: [
            {
                id: "p18_1",
                question: "Which of these is NOT a primary pigment color (Red, Blue, Yellow)?",
                type: 'choice',
                options: ["Red", "Blue", "Green", "Yellow"],
                answer: "Green",
                hints: ["Red is primary.", "Blue is primary.", "Yellow is primary.", "Green is made by mixing."],
                solution_explanation: "Green is a secondary color (Blue + Yellow)."
            }
        ]
    },
    {
        id: "room-29",
        title: "Viking Hall",
        difficulty: "Medium",
        duration: "30 mins",
        description: "A wooden longhouse filled with shields and weapons. The fire roars. You must prove your worth to Valhalla.",
        theme: "Historical",
        imagePrompt: "Viking longhouse interior, wooden beams, fire pit, shields on walls",
        isPremium: true,
        multiverseScenes: [
            "The Jarl's throne",
            "A fire pit roasting meat",
            "A rack of weapons",
            "A heavy wooden door barred from outside"
        ],
        hotspots: {
            2: [
                {
                    id: "h19_1", x: 50, y: 50, label: "Weapon Rack", interactionType: "inspect",
                    description: "Sword, Axe, Spear. A rune says 'The weapon of Thor'.",
                    imagePrompt: "Old rusty weapons"
                }
            ]
        },
        puzzles: [
            {
                id: "p19_1",
                question: "The rune asks for the weapon of Thor. But wait, his weapon isn't here. What is the name of Thor's hammer?",
                type: 'code',
                answer: "Mjolnir",
                hints: ["It starts with M.", "It's a hammer.", "Mjo..."],
                solution_explanation: "Thor's hammer is named Mjolnir."
            }
        ]
    },
    {
        id: "room-30",
        title: "Space Station Zero",
        difficulty: "Expert",
        duration: "50 mins",
        description: "A derelict station spinning out of control. Gravity is fluctuating. You must align the gyro.",
        theme: "Sci-Fi",
        imagePrompt: "Disoriented space station corridor, floating debris, spinning lights",
        isPremium: true,
        multiverseScenes: [
            "A spinning corridor",
            "Zero-G laboratory",
            "The Gyroscope Control Room",
            "Escape pod bay (Locked)"
        ],
        hotspots: {
            2: [
                {
                    id: "h20_1", x: 50, y: 50, label: "Gyroscope", interactionType: "inspect",
                    description: "It's wobbling. Screen says: 'Stability requires Axis X, Y, Z set to 0.' Currently X=5, Y=-5, Z=0.",
                    imagePrompt: "Spinning gyroscope machine"
                }
            ]
        },
        puzzles: [
            {
                id: "p20_1",
                question: "To stabilize, you must apply the inverse. If X is 5 and Y is -5, what offsets must be applied to X and Y to reach 0?",
                type: 'choice',
                options: ["X: -5, Y: 5", "X: 5, Y: -5", "X: 0, Y: 0", "X: 5, Y: 5"],
                answer: "X: -5, Y: 5",
                hints: ["Inverse operations.", "To cancel +5, you need -5.", "To cancel -5, you need +5."],
                solution_explanation: "5 + (-5) = 0, and -5 + 5 = 0. So offsets are -5 and 5."
            }
        ]
    }
];
