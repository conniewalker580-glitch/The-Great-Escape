import { Room } from "./types";

export const rooms31to50: Room[] = [
    {
        id: "room-31", title: "The Haunted Lighthouse", difficulty: "Medium", duration: "25 mins",
        description: "A storm-battered lighthouse on a rocky cliff. The light is out, and something lurks in the shadows.",
        theme: "Horror", imagePrompt: "Haunted lighthouse interior, stormy night, flickering lantern, spiral staircase",
        isPremium: true, puzzles: [{ id: "p31", question: "The logbook shows dates: 1888, 1918, 1948, 1978. What pattern year comes next?", type: "code", answer: "2008", hints: ["Add 30 to each year", "1978 + 30 = ?"], solution_explanation: "Pattern adds 30 years each time" }]
    },
    {
        id: "room-32", title: "Pirate's Cove", difficulty: "Easy", duration: "15 mins",
        description: "A hidden cave filled with treasure. The exit is blocked by a riddle carved in stone.",
        theme: "Mystery", imagePrompt: "Pirate cave with treasure chests, torches, skull decorations",
        isPremium: false, puzzles: [{ id: "p32", question: "What has keys but no locks, space but no room, and you can enter but can't go inside?", type: "choice", options: ["A house", "A keyboard", "A car", "A safe"], answer: "A keyboard", hints: ["Think about something you type on"], solution_explanation: "A keyboard has keys, a space bar, and an enter key" }]
    },
    {
        id: "room-33", title: "The Wizard's Tower", difficulty: "Hard", duration: "35 mins",
        description: "An ancient wizard's study filled with floating spell books and bubbling potions.",
        theme: "Fantasy", imagePrompt: "Magical wizard tower interior, glowing runes, floating books, crystal balls",
        isPremium: true, puzzles: [{ id: "p33", question: "The spell requires elements in order: Fire, Water, Earth, Air, then Fire again. How many elements total?", type: "code", answer: "5", hints: ["Count each mention", "Fire appears twice"], solution_explanation: "Fire(1) + Water(1) + Earth(1) + Air(1) + Fire(1) = 5" }]
    },
    {
        id: "room-34", title: "Arctic Research Station", difficulty: "Medium", duration: "30 mins",
        description: "An isolated research station in Antarctica. The heating system has failed. Find the override code.",
        theme: "Sci-Fi", imagePrompt: "Arctic research station interior, frozen windows, emergency lights, ice forming",
        isPremium: true, puzzles: [{ id: "p34", question: "Temperature dropped from 20°C to -40°C. What is the total temperature change?", type: "code", answer: "60", hints: ["Calculate the difference", "20 - (-40) = 20 + 40"], solution_explanation: "20 - (-40) = 60 degrees total change" }]
    },
    {
        id: "room-35", title: "The Casino Heist", difficulty: "Hard", duration: "40 mins",
        description: "You're trapped in the vault of a high-stakes casino. Security is closing in.",
        theme: "Noir", imagePrompt: "Casino vault interior, gold bars, security lasers, poker chips",
        isPremium: true, puzzles: [{ id: "p35", question: "The vault combination is a winning blackjack hand: Ace + King = ?", type: "code", answer: "21", hints: ["Ace can be 11", "King is 10", "11 + 10 = ?"], solution_explanation: "Blackjack: Ace (11) + King (10) = 21" }]
    },
    {
        id: "room-36", title: "Jurassic Lab", difficulty: "Medium", duration: "25 mins",
        description: "A genetics laboratory where dinosaurs were recreated. The power is failing and specimens are waking up.",
        theme: "Sci-Fi", imagePrompt: "Dinosaur lab, DNA helixes, embryo tanks, amber specimens",
        isPremium: true, puzzles: [{ id: "p36", question: "DNA sequence: ATCG repeats. If A pairs with T, and C pairs with G, what pairs with ATCG?", type: "code", answer: "TAGC", hints: ["A-T are pairs", "C-G are pairs"], solution_explanation: "A pairs with T, T with A, C with G, G with C = TAGC" }]
    },
    {
        id: "room-37", title: "The Enchanted Forest", difficulty: "Easy", duration: "20 mins",
        description: "A mystical forest where trees whisper secrets and paths shift in the moonlight.",
        theme: "Fantasy", imagePrompt: "Enchanted forest, glowing mushrooms, fairy lights, mystical creatures",
        isPremium: false, puzzles: [{ id: "p37", question: "The fairy's riddle: I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", type: "choice", options: ["A dream", "A map", "A painting", "A photograph"], answer: "A map", hints: ["It represents real things", "Used for navigation"], solution_explanation: "A map has representations but not real objects" }]
    },
    {
        id: "room-38", title: "Submarine Crisis", difficulty: "Hard", duration: "45 mins",
        description: "A nuclear submarine losing oxygen. You must restore life support systems.",
        theme: "Sci-Fi", imagePrompt: "Submarine control room, pressure gauges, red warning lights, periscope",
        isPremium: true, puzzles: [{ id: "p38", question: "Pressure at depth: Surface is 1 atm, +1 atm per 10m. At 30m depth, what is total pressure?", type: "code", answer: "4", hints: ["Start with 1 atm", "Add 1 for every 10m", "30m = 3 additional"], solution_explanation: "1 + (30/10) = 1 + 3 = 4 atmospheres" }]
    },
    {
        id: "room-39", title: "The Art Gallery Mystery", difficulty: "Medium", duration: "30 mins",
        description: "A prestigious gallery after hours. One painting is a forgery. Find and remove it.",
        theme: "Mystery", imagePrompt: "Art gallery at night, masterpiece paintings, marble floors, security beams",
        isPremium: true, puzzles: [{ id: "p39", question: "A painting is dated 50 BC. The artist signed it '50 BC'. Why is this a forgery?", type: "choice", options: ["Wrong brush strokes", "People didn't use BC dates then", "Canvas didn't exist", "Colors are wrong"], answer: "People didn't use BC dates then", hints: ["Think about when BC was coined", "They didn't know they were 'before Christ'"], solution_explanation: "BC dating system was created after Christ, so no one in 50 BC would use it" }]
    },
    {
        id: "room-40", title: "Dragon's Lair", difficulty: "Expert", duration: "50 mins",
        description: "The cave of an ancient dragon. Gold and bones litter the floor. The dragon sleeps... for now.",
        theme: "Fantasy", imagePrompt: "Dragon's cave, treasure hoard, sleeping dragon, ancient runes",
        isPremium: true, puzzles: [{ id: "p40", question: "The dragon's riddle: What can fill a room but takes no space?", type: "choice", options: ["Air", "Light", "Sound", "Time"], answer: "Light", hints: ["It illuminates everything", "Has no physical form"], solution_explanation: "Light fills a room visually but has no physical mass" }]
    },
    {
        id: "room-41", title: "The Bank Vault", difficulty: "Hard", duration: "35 mins",
        description: "The most secure vault in the city. You have ten minutes before the alarm resets.",
        theme: "Noir", imagePrompt: "Bank vault, safety deposit boxes, massive door, time lock",
        isPremium: true, puzzles: [{ id: "p41", question: "Safe dial sequence: Right 3x to 25, Left 2x to 50, Right 1x to 10. What is 25+50+10?", type: "code", answer: "85", hints: ["Simple addition", "25 + 50 + 10"], solution_explanation: "25 + 50 + 10 = 85" }]
    },
    {
        id: "room-42", title: "Alien Mothership", difficulty: "Expert", duration: "55 mins",
        description: "Abducted aboard an alien vessel. Decipher their technology to find the escape pod.",
        theme: "Sci-Fi", imagePrompt: "Alien spacecraft interior, organic technology, holographic displays, pods",
        isPremium: true, puzzles: [{ id: "p42", question: "The aliens use base-3. Their symbol for '12' in base-10 is what in base-3?", type: "code", answer: "110", hints: ["12 = 1×9 + 1×3 + 0×1", "9+3+0 = 12"], solution_explanation: "12 in base-3 is 110 (1×9 + 1×3 + 0×1)" }]
    },
    {
        id: "room-43", title: "The Circus Tent", difficulty: "Easy", duration: "20 mins",
        description: "A mysterious abandoned circus. The ringmaster left a puzzle behind.",
        theme: "Mystery", imagePrompt: "Vintage circus tent interior, trapeze, spotlights, mysterious props",
        isPremium: false, puzzles: [{ id: "p43", question: "How many letters are in 'the alphabet'?", type: "code", answer: "11", hints: ["Count the letters in the phrase itself", "Not 26"], solution_explanation: "'the alphabet' has 11 letters (t-h-e-a-l-p-h-a-b-e-t)" }]
    },
    {
        id: "room-44", title: "Medieval Dungeon", difficulty: "Medium", duration: "30 mins",
        description: "Chained in a stone dungeon. Ancient puzzles guard your freedom.",
        theme: "Historical", imagePrompt: "Medieval dungeon, chains, torch light, stone walls, iron bars",
        isPremium: true, puzzles: [{ id: "p44", question: "The guard changes every 4 hours. If it's 2PM now and you need the midnight guard, how many hours until then?", type: "code", answer: "10", hints: ["Count from 2PM to midnight", "2PM to 12AM"], solution_explanation: "From 2PM to midnight is 10 hours" }]
    },
    {
        id: "room-45", title: "Space Shuttle Launch", difficulty: "Hard", duration: "40 mins",
        description: "Mission control has gone dark. You must launch manually.",
        theme: "Space", imagePrompt: "Shuttle cockpit, countdown displays, Earth visible through window",
        isPremium: true, puzzles: [{ id: "p45", question: "Launch sequence: Ignition at T-10, liftoff at T-0. If current time is T-30, how many seconds until liftoff?", type: "code", answer: "30", hints: ["T-0 is launch", "Current is T-30"], solution_explanation: "T-30 to T-0 is 30 seconds" }]
    },
    {
        id: "room-46", title: "The Music Box", difficulty: "Easy", duration: "15 mins",
        description: "An antique music box holds the key. Listen for the pattern.",
        theme: "Cozy", imagePrompt: "Antique music box, delicate mechanisms, dancing figurine",
        isPremium: false, puzzles: [{ id: "p46", question: "Musical notes: Do, Re, Mi, Fa, Sol, La, Ti, Do. How many unique notes?", type: "code", answer: "7", hints: ["Do repeats", "Count unique only"], solution_explanation: "7 unique notes: Do, Re, Mi, Fa, Sol, La, Ti" }]
    },
    {
        id: "room-47", title: "Volcano Temple", difficulty: "Hard", duration: "45 mins",
        description: "An ancient temple inside an active volcano. The lava is rising.",
        theme: "Ancient", imagePrompt: "Temple interior, lava flows, ancient statues, glowing runes",
        isPremium: true, puzzles: [{ id: "p47", question: "The sacrifice riddle: 'When you have me, you feel like sharing. When you share me, I am gone.' What am I?", type: "choice", options: ["Money", "A secret", "Food", "Time"], answer: "A secret", hints: ["Once told, it's no longer secret", "Sharing changes its nature"], solution_explanation: "When you share a secret, it's no longer a secret" }]
    },
    {
        id: "room-48", title: "The Greenhouse", difficulty: "Easy", duration: "20 mins",
        description: "A beautiful Victorian greenhouse hiding a botanical puzzle.",
        theme: "Cozy", imagePrompt: "Victorian greenhouse, exotic plants, glass ceiling, potting bench",
        isPremium: false, puzzles: [{ id: "p48", question: "🌱 + 🌱 = 🌿. If 🌱 = 3, what does 🌿 equal?", type: "code", answer: "6", hints: ["Simple addition", "3 + 3 = ?"], solution_explanation: "3 + 3 = 6" }]
    },
    {
        id: "room-49", title: "Cyberpunk Market", difficulty: "Medium", duration: "30 mins",
        description: "A neon-lit underground market. Find the data chip before the enforcers arrive.",
        theme: "Cyberpunk", imagePrompt: "Cyberpunk market, neon signs, vendors, holographic displays",
        isPremium: true, puzzles: [{ id: "p49", question: "Binary code on the chip: 1010. What is this in decimal?", type: "code", answer: "10", hints: ["Binary: 8+0+2+0", "From right: 1,2,4,8"], solution_explanation: "1010 in binary = 8+0+2+0 = 10 in decimal" }]
    },
    {
        id: "room-50", title: "The Chess Master", difficulty: "Expert", duration: "50 mins",
        description: "A giant chess room. You must checkmate the phantom king to escape.",
        theme: "Abstract", imagePrompt: "Giant chess board room, oversized pieces, checkered floor",
        isPremium: true, puzzles: [{ id: "p50", question: "In chess notation, what does 'e4' refer to?", type: "choice", options: ["A piece", "A square", "A move", "A player"], answer: "A square", hints: ["Letters are columns, numbers are rows"], solution_explanation: "e4 refers to the square at column e, row 4" }]
    }
];
