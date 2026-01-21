import { Room } from "./types";

export const rooms76to100: Room[] = [
    {
        id: "room-76",
        title: "The Lighthouse Keeper",
        difficulty: "Medium",
        duration: "30 mins",
        description: "A lonely lighthouse perched on rocky cliffs. The keeper's quarters hold nautical secrets and timing puzzles.",
        theme: "Coastal",
        imagePrompt: "Lighthouse keeper's quarters, vintage navigation maps spread on wooden desk, ships in bottles on shelves, brass telescope, oil lamp, foghorn, nautical charts, stormy sea visible through window, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "keeper-quarters",
                name: "Keeper's Quarters",
                description: "A cozy room filled with maritime artifacts and navigation tools",
                imagePrompt: "Lighthouse keeper's living quarters, wooden walls, nautical instruments, ship's wheel, brass compass, logbook, storm lantern, 360 degree panoramic view"
            },
            {
                id: "light-room",
                name: "Light Room",
                description: "The top of the lighthouse with the massive rotating beacon",
                imagePrompt: "Lighthouse beacon room, massive Fresnel lens, rotating mechanism, control panel with timing switches, ocean view, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "logbook", name: "Ship's Logbook", x: 30, y: 50, description: "Contains timing records: 'Light flashes every 5 seconds'", imagePrompt: "Weathered ship's logbook with timing entries" },
            { id: "beacon", name: "Beacon Control", x: 70, y: 40, description: "Timer shows 60-second intervals marked", imagePrompt: "Brass beacon control panel with timer dial" },
            { id: "telescope", name: "Brass Telescope", x: 50, y: 60, description: "Points toward the horizon, 12 ships visible", imagePrompt: "Vintage brass telescope on tripod" }
        ],
        puzzles: [{
            id: "p76",
            question: "The lighthouse beacon flashes every 5 seconds. How many flashes occur in 1 minute?",
            type: "code",
            answer: "12",
            hints: [
                "1 minute = 60 seconds",
                "Divide total seconds by flash interval",
                "60 ÷ 5 = ?"
            ],
            solution_explanation: "60 seconds ÷ 5 seconds per flash = 12 flashes. The logbook and beacon control both show this timing pattern."
        }]
    },
    {
        id: "room-77",
        title: "The Magic Show",
        difficulty: "Easy",
        duration: "20 mins",
        description: "Behind the curtain of a grand magic show. Props, illusions, and card tricks await discovery.",
        theme: "Fantasy",
        imagePrompt: "Magician's backstage dressing room, top hat with rabbit, playing cards scattered, magic wands, silk scarves, mirrors, trick boxes, velvet curtains, 8k detailed",
        isPremium: false,
        scenes: [
            {
                id: "backstage",
                name: "Backstage Area",
                description: "The magician's preparation area filled with props and secrets",
                imagePrompt: "Magic show backstage, costume racks, prop tables, mirrors, playing cards everywhere, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "card-deck", name: "Playing Card Deck", x: 45, y: 55, description: "A complete deck of cards, no Jokers visible", imagePrompt: "Fanned deck of playing cards, 4 suits visible" },
            { id: "top-hat", name: "Magician's Top Hat", x: 60, y: 35, description: "Classic black top hat with white rabbit peeking out", imagePrompt: "Black top hat with white rabbit" },
            { id: "card-chart", name: "Card Reference Chart", x: 25, y: 45, description: "Shows 13 ranks × 4 suits = 52 cards", imagePrompt: "Magician's reference chart showing card mathematics" }
        ],
        puzzles: [{
            id: "p77",
            question: "A standard deck of playing cards, minus the Jokers, contains how many cards?",
            type: "code",
            answer: "52",
            hints: [
                "4 suits in a deck",
                "13 ranks per suit (Ace through King)",
                "4 × 13 = ?"
            ],
            solution_explanation: "A standard deck has 4 suits (Hearts, Diamonds, Clubs, Spades) with 13 cards each (A, 2-10, J, Q, K) = 52 cards total."
        }]
    },
    {
        id: "room-78",
        title: "The Nuclear Bunker",
        difficulty: "Expert",
        duration: "55 mins",
        description: "A Cold War era nuclear bunker. Deactivate the countdown before it's too late.",
        theme: "Historical",
        imagePrompt: "Cold War nuclear bunker, massive blast doors, vintage computer terminals, countdown clock, warning sirens, radiation symbols, emergency lights, concrete walls, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "control-room",
                name: "Launch Control Room",
                description: "The nerve center with countdown displays and launch controls",
                imagePrompt: "Nuclear bunker control room, retro computer terminals, countdown displays, launch keys, 360 panoramic"
            },
            {
                id: "vault-door",
                name: "Blast Door Entrance",
                description: "Massive reinforced door with combination lock",
                imagePrompt: "Massive circular blast door, combination dial, warning signs, 360 view"
            }
        ],
        hotspots: [
            { id: "countdown", name: "Countdown Display", x: 50, y: 30, description: "Digital display showing: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0", imagePrompt: "Vintage LED countdown display" },
            { id: "manual", name: "Operations Manual", x: 30, y: 60, description: "Page open to 'Countdown Sequence: Count ALL numbers including start and end'", imagePrompt: "Yellowed operations manual with countdown instructions" },
            { id: "keypad", name: "Security Keypad", x: 70, y: 50, description: "Requires total count of numbers in sequence", imagePrompt: "Numeric keypad with worn buttons" }
        ],
        puzzles: [{
            id: "p78",
            question: "The countdown sequence goes from 10 to 0. How many numbers are spoken in total?",
            type: "code",
            answer: "11",
            hints: [
                "Include both the starting number (10) AND the ending number (0)",
                "Count: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0",
                "Don't forget zero is a number too!"
            ],
            solution_explanation: "Counting from 10 to 0 inclusive: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 = 11 numbers total. Many people forget to count zero!"
        }]
    },
    {
        id: "room-79",
        title: "The Greenhouse Effect",
        difficulty: "Medium",
        duration: "35 mins",
        description: "A high-tech botanical research facility studying climate change through exotic plants.",
        theme: "Sci-Fi",
        imagePrompt: "Advanced greenhouse laboratory, climate control panels, exotic glowing plants, CO2 monitors, temperature gauges, glass dome ceiling, tropical vegetation, scientific equipment, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "main-greenhouse",
                name: "Main Research Dome",
                description: "A vast glass dome filled with exotic plants and monitoring equipment",
                imagePrompt: "Futuristic greenhouse dome, bioluminescent plants, climate monitors, glass walls, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "co2-monitor", name: "CO₂ Monitor", x: 40, y: 35, description: "Display shows: 'Historical: 300 ppm → Current: 400 ppm'", imagePrompt: "Digital CO2 monitoring display with graph" },
            { id: "data-tablet", name: "Research Tablet", x: 60, y: 55, description: "Notes: 'Calculate increase in parts per million'", imagePrompt: "Tablet showing climate data graphs" },
            { id: "plant-sample", name: "Experimental Plant", x: 25, y: 65, description: "Glowing plant responds to CO₂ levels", imagePrompt: "Bioluminescent plant in glass container" }
        ],
        puzzles: [{
            id: "p79",
            question: "CO₂ levels rose from 300 ppm to 400 ppm. What is the increase in parts per million?",
            type: "code",
            answer: "100",
            hints: [
                "Find the difference between current and historical levels",
                "400 - 300 = ?",
                "Subtraction gives you the increase"
            ],
            solution_explanation: "400 ppm (current) - 300 ppm (historical) = 100 ppm increase. The monitor clearly shows both values."
        }]
    },
    {
        id: "room-80",
        title: "The Pet Shop",
        difficulty: "Easy",
        duration: "15 mins",
        description: "A charming pet shop after closing time. The animals need counting!",
        theme: "Cozy",
        imagePrompt: "Cozy pet shop interior, bird cages with colorful parrots, fish tanks with tropical fish, puppy pens, kitten areas, pet toys, food bags, warm lighting, 8k detailed",
        isPremium: false,
        scenes: [
            {
                id: "main-shop",
                name: "Main Shop Floor",
                description: "The central area with various animal enclosures",
                imagePrompt: "Pet shop interior, cages, aquariums, pet supplies, warm atmosphere, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "cat-area", name: "Cat Corner", x: 25, y: 50, description: "3 playful cats (4 legs each)", imagePrompt: "Three cats playing together" },
            { id: "dog-pen", name: "Puppy Pen", x: 50, y: 60, description: "2 adorable dogs (4 legs each)", imagePrompt: "Two puppies in a pen" },
            { id: "bird-cage", name: "Parrot Perch", x: 70, y: 40, description: "1 colorful parrot (2 legs)", imagePrompt: "Colorful parrot on perch" },
            { id: "inventory", name: "Inventory Sheet", x: 40, y: 30, description: "Reminder: Cats & dogs = 4 legs, Birds = 2 legs", imagePrompt: "Clipboard with animal count sheet" }
        ],
        puzzles: [{
            id: "p80",
            question: "The shop has 3 cats, 2 dogs, and 1 parrot. How many legs in total?",
            type: "code",
            answer: "22",
            hints: [
                "Cats have 4 legs each: 3 × 4 = 12",
                "Dogs have 4 legs each: 2 × 4 = 8",
                "Parrots have 2 legs each: 1 × 2 = 2",
                "Add them all together"
            ],
            solution_explanation: "3 cats (12 legs) + 2 dogs (8 legs) + 1 parrot (2 legs) = 22 legs total."
        }]
    },
    {
        id: "room-81",
        title: "The Dojo",
        difficulty: "Hard",
        duration: "40 mins",
        description: "A traditional Japanese martial arts training hall. Master the belt ranking system.",
        theme: "Ancient",
        imagePrompt: "Traditional Japanese dojo, tatami mats, wooden walls, katana swords displayed, training dummies, belt display rack, shoji screens, zen garden visible, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "training-hall",
                name: "Main Training Hall",
                description: "The central dojo with tatami mats and training equipment",
                imagePrompt: "Japanese dojo interior, tatami mats, weapons rack, belt display, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "belt-rack", name: "Belt Display", x: 50, y: 40, description: "Belts in order: White, Yellow, Orange, Green, Blue, Brown, Black", imagePrompt: "Martial arts belts displayed in progression order" },
            { id: "scroll", name: "Ancient Scroll", x: 30, y: 35, description: "Text: 'The path to mastery has seven steps'", imagePrompt: "Japanese scroll with belt progression" },
            { id: "master-portrait", name: "Master's Portrait", x: 70, y: 30, description: "Wearing black belt - the highest rank", imagePrompt: "Portrait of dojo master in black belt" }
        ],
        puzzles: [{
            id: "p81",
            question: "The belt progression is: White, Yellow, Orange, Green, Blue, Brown, Black. Black belt is the highest rank. What position number is the Black belt?",
            type: "code",
            answer: "7",
            hints: [
                "Count from the beginning: White is 1st",
                "Yellow is 2nd, Orange is 3rd...",
                "Count all the way to Black"
            ],
            solution_explanation: "Counting the belts: 1-White, 2-Yellow, 3-Orange, 4-Green, 5-Blue, 6-Brown, 7-Black. Black belt is 7th."
        }]
    },
    {
        id: "room-82",
        title: "The Crystal Cave",
        difficulty: "Medium",
        duration: "30 mins",
        description: "A mystical cave filled with glowing crystals of different colors and values.",
        theme: "Fantasy",
        imagePrompt: "Magical crystal cave, multicolored glowing gems, red rubies, blue sapphires, natural light rays, stalactites, underground lake, ethereal glow, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "crystal-chamber",
                name: "Crystal Chamber",
                description: "The main cavern with valuable crystals embedded in walls",
                imagePrompt: "Crystal cave interior, glowing gems, colored light beams, underground beauty, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "red-crystals", name: "Red Crystals", x: 30, y: 50, description: "3 red crystals, sign says '$10 each'", imagePrompt: "Three glowing red crystals" },
            { id: "blue-crystals", name: "Blue Crystals", x: 60, y: 45, description: "2 blue crystals, sign says '$20 each'", imagePrompt: "Two glowing blue crystals" },
            { id: "price-chart", name: "Crystal Value Chart", x: 50, y: 30, description: "Red = $10, Blue = $20", imagePrompt: "Stone tablet with crystal prices" }
        ],
        puzzles: [{
            id: "p82",
            question: "Red crystals are worth $10 each, Blue crystals are worth $20 each. What is the total value of 3 Red crystals and 2 Blue crystals?",
            type: "code",
            answer: "70",
            hints: [
                "Calculate red crystals: 3 × $10 = $30",
                "Calculate blue crystals: 2 × $20 = $40",
                "Add both amounts together"
            ],
            solution_explanation: "3 red crystals ($30) + 2 blue crystals ($40) = $70 total value."
        }]
    },
    {
        id: "room-83",
        title: "The Firestation",
        difficulty: "Easy",
        duration: "20 mins",
        description: "A vintage fire station with classic red trucks and brass poles.",
        theme: "Historical",
        imagePrompt: "Vintage 1950s fire station, shiny red fire trucks, brass sliding poles, firefighter helmets, hoses coiled, dalmatian dog, checkerboard floor, 8k detailed",
        isPremium: false,
        scenes: [
            {
                id: "garage",
                name: "Fire Truck Garage",
                description: "The main bay with vintage fire trucks",
                imagePrompt: "Fire station garage, red trucks, equipment racks, brass poles, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "truck-1", name: "Engine 1", x: 30, y: 55, description: "Red fire truck with crew of 3", imagePrompt: "Vintage red fire engine" },
            { id: "truck-2", name: "Engine 2", x: 65, y: 55, description: "Red fire truck with crew of 2", imagePrompt: "Second vintage fire truck" },
            { id: "roster", name: "Crew Roster", x: 50, y: 30, description: "5 firefighters total, 2 trucks available", imagePrompt: "Crew assignment board" }
        ],
        puzzles: [{
            id: "p83",
            question: "There are 5 firefighters and 2 trucks. What is the average number of firefighters per truck?",
            type: "code",
            answer: "2.5",
            hints: [
                "Divide total firefighters by number of trucks",
                "5 ÷ 2 = ?",
                "The answer is a decimal"
            ],
            solution_explanation: "5 firefighters ÷ 2 trucks = 2.5 firefighters per truck on average."
        }]
    },
    {
        id: "room-84",
        title: "The Escape Pod",
        difficulty: "Hard",
        duration: "45 mins",
        description: "Your starship is exploding! Find the correct pod ejection sequence before time runs out.",
        theme: "Space",
        imagePrompt: "Emergency escape pod interior, countdown timer, red alert lights, debris floating, control panel with Greek letters, stars visible through window, sparks flying, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "pod-interior",
                name: "Escape Pod",
                description: "The cramped interior of the emergency escape pod",
                imagePrompt: "Escape pod cockpit, emergency controls, countdown display, space visible, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "sequence-panel", name: "Eject Sequence Panel", x: 50, y: 40, description: "Buttons labeled: Alpha, Beta, Gamma", imagePrompt: "Control panel with Greek letter buttons" },
            { id: "manual", name: "Emergency Manual", x: 30, y: 60, description: "Greek alphabet reference: Alpha=1, Beta=2, Gamma=3", imagePrompt: "Emergency procedures manual open to Greek alphabet" },
            { id: "countdown", name: "Countdown Timer", x: 70, y: 30, description: "3 seconds remaining!", imagePrompt: "Digital countdown display" }
        ],
        puzzles: [{
            id: "p84",
            question: "The pod eject sequence requires: Alpha, Beta, Gamma. What position number is Gamma in the Greek alphabet?",
            type: "code",
            answer: "3",
            hints: [
                "Alpha is the 1st letter of the Greek alphabet",
                "Beta is the 2nd letter",
                "Gamma comes right after Beta"
            ],
            solution_explanation: "In the Greek alphabet: Alpha=1, Beta=2, Gamma=3. Gamma is the 3rd letter."
        }]
    },
    {
        id: "room-85",
        title: "The Fortune Teller",
        difficulty: "Medium",
        duration: "25 mins",
        description: "A mystic's tent filled with tarot cards, crystal balls, and ancient wisdom.",
        theme: "Mystery",
        imagePrompt: "Fortune teller's tent, crystal ball glowing, tarot cards spread on velvet cloth, incense smoke, mystical symbols, candles, purple drapes, mysterious atmosphere, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "tent-interior",
                name: "Mystic's Tent",
                description: "The dimly lit interior filled with divination tools",
                imagePrompt: "Fortune teller tent interior, mystical decorations, tarot cards, crystal ball, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "major-arcana", name: "Major Arcana Cards", x: 35, y: 50, description: "22 cards laid out: The Fool through The World", imagePrompt: "Major Arcana tarot cards spread" },
            { id: "minor-arcana", name: "Minor Arcana Cards", x: 60, y: 50, description: "56 cards in 4 suits", imagePrompt: "Minor Arcana cards organized by suit" },
            { id: "tarot-book", name: "Tarot Guidebook", x: 50, y: 30, description: "Page shows: 'Complete deck = Major + Minor'", imagePrompt: "Ancient tarot guidebook" }
        ],
        puzzles: [{
            id: "p85",
            question: "A tarot deck has 22 Major Arcana cards and 56 Minor Arcana cards. How many cards are in a complete tarot deck?",
            type: "code",
            answer: "78",
            hints: [
                "Add the Major Arcana and Minor Arcana together",
                "22 + 56 = ?",
                "Simple addition"
            ],
            solution_explanation: "22 Major Arcana + 56 Minor Arcana = 78 total tarot cards."
        }]
    },
    {
        id: "room-86",
        title: "The Operating Room",
        difficulty: "Hard",
        duration: "40 mins",
        description: "A high-tech surgical suite with life-saving medical equipment and vital sign monitors.",
        theme: "Sci-Fi",
        imagePrompt: "Modern operating room, surgical lights overhead, heart rate monitors, medical instruments on tray, IV stands, sterile environment, blue surgical drapes, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "surgery-room",
                name: "Surgical Suite",
                description: "The sterile operating theater with advanced medical technology",
                imagePrompt: "Operating room interior, surgical equipment, monitors, medical tools, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "heart-monitor", name: "Heart Rate Monitor", x: 50, y: 35, description: "Display shows: 120 BPM (beats per minute)", imagePrompt: "Medical heart rate monitor display" },
            { id: "medical-chart", name: "Patient Chart", x: 30, y: 50, description: "Notes: 'BPM = beats per MINUTE. Calculate for 30 seconds'", imagePrompt: "Medical chart on clipboard" },
            { id: "clock", name: "Surgical Clock", x: 70, y: 30, description: "Shows 30-second intervals marked", imagePrompt: "Large surgical room clock" }
        ],
        puzzles: [{
            id: "p86",
            question: "The patient's heart rate is 120 BPM (beats per minute). How many heartbeats occur in 30 seconds?",
            type: "code",
            answer: "60",
            hints: [
                "BPM means beats per MINUTE (60 seconds)",
                "30 seconds is half a minute",
                "120 ÷ 2 = ?"
            ],
            solution_explanation: "120 beats per minute ÷ 2 = 60 beats in 30 seconds (half a minute)."
        }]
    },
    {
        id: "room-87",
        title: "The Sewer System",
        difficulty: "Medium",
        duration: "35 mins",
        description: "Navigate the underground tunnels beneath the city. Don't get lost!",
        theme: "Industrial",
        imagePrompt: "Underground sewer tunnels, pipes running along walls, water flowing, grates overhead, dim emergency lighting, brick walls, directional arrows, industrial atmosphere, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "main-tunnel",
                name: "Main Sewer Tunnel",
                description: "The primary underground passage with multiple branches",
                imagePrompt: "Sewer tunnel interior, pipes, water channels, directional signs, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "left-arrow", name: "Left Turn Arrow", x: 25, y: 45, description: "Arrow pointing left", imagePrompt: "Directional arrow painted on wall pointing left" },
            { id: "right-arrow", name: "Right Turn Arrow", x: 50, y: 45, description: "Arrow pointing right", imagePrompt: "Directional arrow painted on wall pointing right" },
            { id: "map", name: "Tunnel Map", x: 70, y: 35, description: "Shows: Left + Right = cancel out, then add final Left", imagePrompt: "Sewer system map on wall" }
        ],
        puzzles: [{
            id: "p87",
            question: "You turn left, then right, then left again. What is your net direction?",
            type: "choice",
            options: ["Left", "Right", "Straight", "U-turn"],
            answer: "Left",
            hints: [
                "Left and Right turns cancel each other out",
                "After canceling, you have one Left turn remaining",
                "Net result is Left"
            ],
            solution_explanation: "First left + right = cancel out (back to straight). Then add the final left turn = net direction is Left."
        }]
    },
    {
        id: "room-88",
        title: "The Racetrack",
        difficulty: "Easy",
        duration: "20 mins",
        description: "A futuristic racing circuit with hovercars and speed records to break.",
        theme: "Space",
        imagePrompt: "Futuristic racetrack, sleek hovercars, neon racing lines, checkered flags, pit crew, digital lap timers, holographic displays, night racing, 8k detailed",
        isPremium: false,
        scenes: [
            {
                id: "pit-stop",
                name: "Pit Stop Area",
                description: "The racing pit with timing equipment and crew",
                imagePrompt: "Racing pit stop, hovercars, timing displays, crew equipment, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "lap-timer", name: "Lap Timer Display", x: 50, y: 35, description: "Record lap: 1 minute 30 seconds", imagePrompt: "Digital lap time display" },
            { id: "conversion-chart", name: "Time Conversion Chart", x: 30, y: 50, description: "1 minute = 60 seconds", imagePrompt: "Time conversion reference chart" },
            { id: "hovercar", name: "Racing Hovercar", x: 70, y: 60, description: "Sleek racing vehicle", imagePrompt: "Futuristic racing hovercar" }
        ],
        puzzles: [{
            id: "p88",
            question: "The lap record is 1 minute and 30 seconds. How many seconds is this in total?",
            type: "code",
            answer: "90",
            hints: [
                "Convert minutes to seconds: 1 minute = 60 seconds",
                "Add the remaining 30 seconds",
                "60 + 30 = ?"
            ],
            solution_explanation: "1 minute (60 seconds) + 30 seconds = 90 seconds total."
        }]
    },
    {
        id: "room-89",
        title: "The Symphony Hall",
        difficulty: "Medium",
        duration: "30 mins",
        description: "A grand concert hall with a magnificent pipe organ and musical mysteries.",
        theme: "Cozy",
        imagePrompt: "Grand symphony hall, massive pipe organ, velvet seats, ornate chandeliers, music stands, conductor's podium, acoustic panels, elegant architecture, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "concert-hall",
                name: "Main Concert Hall",
                description: "The majestic performance space with perfect acoustics",
                imagePrompt: "Symphony hall interior, pipe organ, seating, stage, chandeliers, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "orchestra-chart", name: "Orchestra Seating Chart", x: 50, y: 40, description: "Shows 4 sections: Strings, Woodwinds, Brass, Percussion", imagePrompt: "Orchestra layout diagram" },
            { id: "music-stand", name: "Conductor's Stand", x: 40, y: 55, description: "Sheet music showing section divisions", imagePrompt: "Conductor's music stand with score" },
            { id: "pipe-organ", name: "Pipe Organ", x: 60, y: 30, description: "Majestic instrument towering above", imagePrompt: "Grand pipe organ" }
        ],
        puzzles: [{
            id: "p89",
            question: "An orchestra has four main sections: Strings, Woodwinds, Brass, and Percussion. How many sections is that?",
            type: "code",
            answer: "4",
            hints: [
                "Count the sections listed",
                "Strings (1), Woodwinds (2), Brass (3), Percussion (4)",
                "Simple counting"
            ],
            solution_explanation: "The four main orchestra sections are: Strings, Woodwinds, Brass, and Percussion = 4 sections."
        }]
    },
    {
        id: "room-90",
        title: "The Glacier",
        difficulty: "Hard",
        duration: "45 mins",
        description: "Trapped on a melting glacier in the Arctic. Survive the freezing temperatures!",
        theme: "Sci-Fi",
        imagePrompt: "Glacier crevasse, brilliant blue ice walls, survival gear scattered, aurora borealis overhead, ice formations, frozen landscape, temperature gauge, emergency shelter, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "ice-cave",
                name: "Glacier Cave",
                description: "A cave carved into the ancient ice",
                imagePrompt: "Ice cave interior, blue glacial ice, aurora visible, survival equipment, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "thermometer", name: "Digital Thermometer", x: 50, y: 40, description: "Current temperature: -20°C", imagePrompt: "Digital temperature display showing -20°C" },
            { id: "science-note", name: "Research Notes", x: 30, y: 55, description: "Note: 'Ice melts at 0°C. Calculate temperature rise needed'", imagePrompt: "Scientific notebook with ice melting data" },
            { id: "ice-sample", name: "Ice Core Sample", x: 70, y: 50, description: "Ancient glacier ice", imagePrompt: "Cylindrical ice core sample" }
        ],
        puzzles: [{
            id: "p90",
            question: "Ice melts at 0°C. The current temperature is -20°C. How many degrees must the temperature rise for the ice to melt?",
            type: "code",
            answer: "20",
            hints: [
                "Find the distance from -20°C to 0°C",
                "From -20 to 0 is an increase of 20 degrees",
                "Think about the number line"
            ],
            solution_explanation: "From -20°C to 0°C is a rise of 20 degrees. (-20 + 20 = 0)"
        }]
    },
    {
        id: "room-91",
        title: "The Alchemist's Lab",
        difficulty: "Expert",
        duration: "50 mins",
        description: "A medieval laboratory where alchemists sought to turn lead into gold.",
        theme: "Fantasy",
        imagePrompt: "Medieval alchemy laboratory, bubbling potions in flasks, gold bars, ancient texts, periodic table scroll, mortar and pestle, mystical symbols, candles, stone walls, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "lab-chamber",
                name: "Alchemy Chamber",
                description: "The secret laboratory of transmutation",
                imagePrompt: "Alchemist's lab, potion bottles, gold, ancient books, mystical equipment, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "periodic-scroll", name: "Element Scroll", x: 45, y: 35, description: "Shows: Lead (Pb) = Element 82, Gold (Au) = Element 79", imagePrompt: "Ancient scroll with element numbers" },
            { id: "lead-sample", name: "Lead Bar", x: 30, y: 60, description: "Heavy gray metal, labeled '82'", imagePrompt: "Bar of lead metal" },
            { id: "gold-sample", name: "Gold Bar", x: 65, y: 60, description: "Shining gold, labeled '79'", imagePrompt: "Bar of gold" }
        ],
        puzzles: [{
            id: "p91",
            question: "Lead is element number 82 on the periodic table. Gold is element number 79. What is the difference between them?",
            type: "code",
            answer: "3",
            hints: [
                "Subtract the smaller number from the larger",
                "82 - 79 = ?",
                "Simple subtraction"
            ],
            solution_explanation: "Lead (82) - Gold (79) = 3. They differ by 3 atomic numbers."
        }]
    },
    {
        id: "room-92",
        title: "The Movie Set",
        difficulty: "Easy",
        duration: "20 mins",
        description: "Behind the scenes of a Hollywood blockbuster. Lights, camera, action!",
        theme: "Fantasy",
        imagePrompt: "Hollywood movie set, film cameras, green screen, director's chair, clapperboard, lighting rigs, props, crew equipment, studio atmosphere, 8k detailed",
        isPremium: false,
        scenes: [
            {
                id: "sound-stage",
                name: "Sound Stage",
                description: "The main filming area with cameras and lights",
                imagePrompt: "Movie set interior, cameras, green screen, lighting, director's area, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "camera", name: "Film Camera", x: 50, y: 45, description: "Professional cinema camera", imagePrompt: "Professional movie camera on dolly" },
            { id: "clapperboard", name: "Clapperboard", x: 35, y: 50, description: "Shows: '24 FPS - Standard Film Speed'", imagePrompt: "Movie clapperboard with FPS notation" },
            { id: "tech-manual", name: "Camera Manual", x: 65, y: 40, description: "Page open to: 'FPS = Frames Per Second'", imagePrompt: "Camera technical manual" }
        ],
        puzzles: [{
            id: "p92",
            question: "Standard film runs at 24 FPS. What does FPS stand for, and what is the number?",
            type: "code",
            answer: "24",
            hints: [
                "FPS = Frames Per Second",
                "The number is given in the question",
                "24 frames are captured each second"
            ],
            solution_explanation: "FPS stands for Frames Per Second. Standard film runs at 24 frames per second."
        }]
    },
    {
        id: "room-93",
        title: "The Airport",
        difficulty: "Medium",
        duration: "35 mins",
        description: "An empty airport terminal at night. Decode the flight schedules.",
        theme: "Mystery",
        imagePrompt: "Airport terminal at night, departure boards, empty gates, luggage carts, check-in counters, duty-free shops closed, atmospheric lighting, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "terminal",
                name: "Departure Terminal",
                description: "The main terminal with flight information displays",
                imagePrompt: "Airport terminal interior, departure boards, gates, seating areas, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "departure-board", name: "Departure Board", x: 50, y: 35, description: "Flight 247: Departs 14:30, Boarding 30 mins prior", imagePrompt: "Digital departure board display" },
            { id: "clock", name: "Terminal Clock", x: 30, y: 30, description: "Shows 24-hour time format", imagePrompt: "Large terminal clock" },
            { id: "gate-sign", name: "Gate Information", x: 70, y: 45, description: "Reminder: Boarding starts 30 minutes before departure", imagePrompt: "Gate information sign" }
        ],
        puzzles: [{
            id: "p93",
            question: "A flight departs at 14:30. Boarding begins 30 minutes before departure. What time does boarding start?",
            type: "code",
            answer: "14:00",
            hints: [
                "Subtract 30 minutes from 14:30",
                "30 minutes before 14:30 is 14:00",
                "Use 24-hour time format"
            ],
            solution_explanation: "14:30 - 0:30 = 14:00. Boarding starts at 14:00 (2:00 PM)."
        }]
    },
    {
        id: "room-94",
        title: "The Igloo",
        difficulty: "Easy",
        duration: "20 mins",
        description: "An Arctic igloo built from ice blocks. Stay warm and solve the puzzle!",
        theme: "Coastal",
        imagePrompt: "Igloo interior, ice block walls, fur pelts, oil lamp, fishing gear, aurora borealis visible through entrance, cozy Arctic dwelling, 8k detailed",
        isPremium: false,
        scenes: [
            {
                id: "igloo-inside",
                name: "Inside the Igloo",
                description: "The warm interior of the ice dwelling",
                imagePrompt: "Igloo interior, ice blocks, fur blankets, lamp, Arctic home, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "ice-blocks", name: "Ice Block Wall", x: 50, y: 50, description: "6 blocks per layer, 4 layers visible", imagePrompt: "Ice blocks stacked in layers" },
            { id: "building-diagram", name: "Construction Diagram", x: 30, y: 40, description: "Shows: 6 blocks × 4 layers", imagePrompt: "Igloo construction diagram" },
            { id: "tools", name: "Building Tools", x: 70, y: 60, description: "Ice saw and measuring tools", imagePrompt: "Igloo building tools" }
        ],
        puzzles: [{
            id: "p94",
            question: "This igloo has 6 ice blocks per layer and 4 layers. How many ice blocks total?",
            type: "code",
            answer: "24",
            hints: [
                "Multiply blocks per layer by number of layers",
                "6 × 4 = ?",
                "Simple multiplication"
            ],
            solution_explanation: "6 blocks per layer × 4 layers = 24 ice blocks total."
        }]
    },
    {
        id: "room-95",
        title: "The Clock Tower",
        difficulty: "Hard",
        duration: "40 mins",
        description: "Inside a massive clock tower where time itself seems to bend.",
        theme: "Steampunk",
        imagePrompt: "Clock tower interior, massive brass gears, giant clock face, pendulum swinging, Roman numerals, mechanical complexity, Victorian engineering, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "gear-chamber",
                name: "Gear Chamber",
                description: "The mechanical heart of the clock tower",
                imagePrompt: "Clock tower mechanism, giant gears, pendulum, clock face, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "clock-face", name: "Clock Face", x: 50, y: 30, description: "Shows 12 hours marked", imagePrompt: "Giant clock face with Roman numerals" },
            { id: "chime-mechanism", name: "Chime Mechanism", x: 35, y: 50, description: "Chimes once for each hour: 1 chime at 1:00, 2 at 2:00... 12 at 12:00", imagePrompt: "Bell chiming mechanism" },
            { id: "math-scroll", name: "Clockmaker's Notes", x: 65, y: 45, description: "Formula: Sum of 1 to 12 = (12 × 13) ÷ 2", imagePrompt: "Clockmaker's mathematical notes" }
        ],
        puzzles: [{
            id: "p95",
            question: "The clock chimes the hour: 1 chime at 1 o'clock, 2 chimes at 2 o'clock, etc. How many total chimes from 1 o'clock to 12 o'clock?",
            type: "code",
            answer: "78",
            hints: [
                "Add up all the chimes: 1 + 2 + 3 + 4 + ... + 12",
                "Use the formula: n(n+1)/2 where n=12",
                "12 × 13 ÷ 2 = ?"
            ],
            solution_explanation: "Sum of 1 to 12 = 1+2+3+4+5+6+7+8+9+10+11+12 = 78 total chimes. Or use formula: (12×13)÷2 = 78."
        }]
    },
    {
        id: "room-96",
        title: "The Space Casino",
        difficulty: "Expert",
        duration: "55 mins",
        description: "A casino orbiting a black hole. Time dilation affects the stakes!",
        theme: "Space",
        imagePrompt: "Space casino interior, slot machines, roulette tables, black hole visible through windows, neon lights, futuristic gambling, cosmic backdrop, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "casino-floor",
                name: "Casino Floor",
                description: "The main gambling area with cosmic views",
                imagePrompt: "Space casino, gambling tables, black hole view, neon lights, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "betting-table", name: "Betting Table", x: 50, y: 50, description: "Shows doubling sequence: $1, $2, $4, $8, $16", imagePrompt: "Casino betting table with chip stacks" },
            { id: "strategy-card", name: "Martingale Strategy Card", x: 30, y: 40, description: "Double your bet after each loss", imagePrompt: "Betting strategy reference card" },
            { id: "calculator", name: "Cosmic Calculator", x: 70, y: 45, description: "Sum calculator for sequences", imagePrompt: "Futuristic calculator device" }
        ],
        puzzles: [{
            id: "p96",
            question: "Using the Martingale betting system, you double your bet after each loss: $1, $2, $4, $8, $16. After 5 losses, how much have you lost in total?",
            type: "code",
            answer: "31",
            hints: [
                "Add up all the bets: 1 + 2 + 4 + 8 + 16",
                "This is a geometric sequence",
                "Total = 31"
            ],
            solution_explanation: "$1 + $2 + $4 + $8 + $16 = $31 total lost. Each bet doubles, creating a geometric sequence."
        }]
    },
    {
        id: "room-97",
        title: "The Herbalist",
        difficulty: "Medium",
        duration: "30 mins",
        description: "A witch's cottage filled with herbs, potions, and magical ingredients.",
        theme: "Fantasy",
        imagePrompt: "Witch's cottage interior, herbs drying from ceiling, bubbling cauldron, spell books, potion bottles, mortar and pestle, mystical atmosphere, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "cottage-interior",
                name: "Witch's Cottage",
                description: "The cozy interior filled with magical supplies",
                imagePrompt: "Witch cottage, herbs, cauldron, spell books, magical items, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "ingredient-jar", name: "Newt Eye Jar", x: 40, y: 45, description: "Contains 12 newt eyes", imagePrompt: "Glass jar with preserved newt eyes" },
            { id: "recipe-book", name: "Potion Recipe Book", x: 55, y: 35, description: "Recipe: 3 newt eyes per potion", imagePrompt: "Ancient spell book open to potion recipe" },
            { id: "cauldron", name: "Bubbling Cauldron", x: 30, y: 60, description: "Ready for potion brewing", imagePrompt: "Iron cauldron with green potion bubbling" }
        ],
        puzzles: [{
            id: "p97",
            question: "Each potion requires 3 newt eyes. You have 12 newt eyes. How many potions can you make?",
            type: "code",
            answer: "4",
            hints: [
                "Divide total eyes by eyes per potion",
                "12 ÷ 3 = ?",
                "Simple division"
            ],
            solution_explanation: "12 newt eyes ÷ 3 eyes per potion = 4 potions can be made."
        }]
    },
    {
        id: "room-98",
        title: "The Newspaper Office",
        difficulty: "Easy",
        duration: "20 mins",
        description: "A 1940s newsroom with typewriters, printing presses, and breaking stories.",
        theme: "Noir",
        imagePrompt: "1940s newspaper office, vintage typewriters, printing press, stacks of papers, fedora hats, coffee cups, noir atmosphere, black and white aesthetic, 8k detailed",
        isPremium: false,
        scenes: [
            {
                id: "newsroom",
                name: "Newsroom Floor",
                description: "The bustling newsroom with desks and equipment",
                imagePrompt: "Vintage newsroom, typewriters, desks, printing press, noir style, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "newspaper-stack", name: "Newspaper Stack", x: 45, y: 55, description: "Price tag: $0.25 per paper", imagePrompt: "Stack of vintage newspapers" },
            { id: "cash-register", name: "Cash Register", x: 60, y: 40, description: "Shows $1.00 in coins", imagePrompt: "Vintage cash register" },
            { id: "price-sign", name: "Price Sign", x: 30, y: 35, description: "Daily News - 25¢", imagePrompt: "Vintage price sign" }
        ],
        puzzles: [{
            id: "p98",
            question: "Each newspaper costs $0.25. How many newspapers can you buy with $1.00?",
            type: "code",
            answer: "4",
            hints: [
                "Divide total money by price per paper",
                "$1.00 ÷ $0.25 = ?",
                "Think in quarters"
            ],
            solution_explanation: "$1.00 ÷ $0.25 = 4 newspapers. Four quarters make a dollar."
        }]
    },
    {
        id: "room-99",
        title: "The Final Count",
        difficulty: "Expert",
        duration: "60 mins",
        description: "A mathematical dimension where numbers are reality. Master the factorial!",
        theme: "Abstract",
        imagePrompt: "Mathematical dimension, equations floating in space, number portals, geometric patterns, mathematical symbols glowing, abstract reality, 8k detailed",
        isPremium: true,
        scenes: [
            {
                id: "math-realm",
                name: "Mathematical Realm",
                description: "An abstract space where mathematics is physical",
                imagePrompt: "Mathematical dimension, floating equations, number patterns, abstract space, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "factorial-portal", name: "Factorial Portal", x: 50, y: 40, description: "Shows: 5! = 5 × 4 × 3 × 2 × 1", imagePrompt: "Glowing portal with factorial equation" },
            { id: "number-sequence", name: "Number Sequence", x: 35, y: 50, description: "1, 2, 6, 24, 120... (factorials)", imagePrompt: "Floating numbers in sequence" },
            { id: "math-tome", name: "Mathematical Tome", x: 65, y: 45, description: "Definition: n! = n × (n-1) × ... × 1", imagePrompt: "Ancient mathematical textbook" }
        ],
        puzzles: [{
            id: "p99",
            question: "Calculate 5 factorial (5!) which equals 1 × 2 × 3 × 4 × 5. What is the result?",
            type: "code",
            answer: "120",
            hints: [
                "Multiply all numbers from 1 to 5",
                "1 × 2 = 2, then × 3 = 6, then × 4 = 24, then × 5 = ?",
                "5! = 120"
            ],
            solution_explanation: "5! = 1 × 2 × 3 × 4 × 5 = 120. This is called '5 factorial'."
        }]
    },
    {
        id: "room-100",
        title: "The Grand Finale",
        difficulty: "Expert",
        duration: "90 mins",
        description: "The ultimate escape room. A cosmic chamber where all themes merge. Only the most clever will escape!",
        theme: "Abstract",
        imagePrompt: "Grand cosmic chamber, all themes merged together, portals to previous rooms, ultimate challenge, epic scale, mathematical patterns, mystical symbols, futuristic technology, ancient artifacts, 8k detailed masterpiece",
        isPremium: true,
        scenes: [
            {
                id: "cosmic-chamber",
                name: "Cosmic Chamber",
                description: "The ultimate room where all realities converge",
                imagePrompt: "Grand finale chamber, all themes merged, cosmic scale, portals everywhere, 360 panoramic"
            },
            {
                id: "number-realm",
                name: "Number Realm",
                description: "A mathematical subdimension",
                imagePrompt: "Mathematical space, numbers floating, equations glowing, abstract beauty, 360 view"
            },
            {
                id: "riddle-sanctum",
                name: "Riddle Sanctum",
                description: "Ancient chamber of riddles",
                imagePrompt: "Ancient riddle chamber, mysterious symbols, mystical atmosphere, 360 panoramic"
            }
        ],
        hotspots: [
            { id: "number-crystal", name: "Number Crystal", x: 40, y: 40, description: "Glowing with the number 18. Digits: 1 + 8 = 9", imagePrompt: "Crystal glowing with number 18" },
            { id: "math-equation", name: "Floating Equation", x: 55, y: 35, description: "Shows: 9 × 2 = 18", imagePrompt: "Glowing mathematical equation" },
            { id: "fire-portal", name: "Fire Portal", x: 30, y: 60, description: "Flames dancing, needing oxygen", imagePrompt: "Portal made of living fire" },
            { id: "riddle-scroll", name: "Ancient Riddle Scroll", x: 70, y: 50, description: "Riddle about something that grows but isn't alive", imagePrompt: "Ancient scroll with riddle text" },
            { id: "element-chart", name: "Element Chart", x: 50, y: 70, description: "Shows: Fire needs air (oxygen) to grow", imagePrompt: "Chart showing fire's need for oxygen" }
        ],
        puzzles: [
            {
                id: "p100_1",
                question: "What is the only number that is twice the sum of its digits?",
                type: "code",
                answer: "18",
                hints: [
                    "Try numbers and add their digits",
                    "For 18: 1 + 8 = 9",
                    "Is 18 equal to 9 × 2?",
                    "Yes! 18 = 2 × (1 + 8)"
                ],
                solution_explanation: "18 is the only number where the number equals twice the sum of its digits. 1 + 8 = 9, and 9 × 2 = 18."
            },
            {
                id: "p100_2",
                question: "I am not alive, but I grow. I don't have lungs, but I need air. What am I?",
                type: "choice",
                options: ["Fire", "Plant", "Cloud", "Ice"],
                answer: "Fire",
                hints: [
                    "This thing can spread and get bigger",
                    "It needs oxygen to survive",
                    "Plants ARE alive, so not that",
                    "Think about combustion"
                ],
                solution_explanation: "Fire is not alive but it grows and spreads. It doesn't have lungs but needs air (oxygen) to burn. The fire portal shows this clearly!"
            }
        ]
    }
];
