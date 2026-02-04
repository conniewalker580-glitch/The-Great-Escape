import { create } from 'zustand';
import aiService from '../services/aiService';


/**
 * Room configurations with Quiz Logic and Visual Clues
 * Updated by C.S. Walker
 * Each room is a visual quiz where answers are discovered through interaction.
 */
export const roomConfigs = {
    1: {
        id: 1,
        name: "The Victorian Study",
        panorama: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=4096",
        background: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90",
        objective: "Professor Thorne has locked the exit. To escape this study, you must find the 4-digit code for the wall safe—which he always sets to his own birth year.",
        ambientColor: "#2a1810",
        atmosphere: "dark",
        quiz: {
            question: "What is the 4-digit combination for the wall safe?",
            correctAnswer: "1874",
            options: ["1865", "1874", "1882", "1890"]
        },
        hotspots: [
            {
                id: 'old-book',
                x: 15, y: 40, width: 80, height: 100,
                label: 'Leather Journal', icon: '📚',
                clue: "Journal Entry: 'I started my apprenticeship exactly 20 years before the Great War (1914).'",
                description: 'A personal journal with a lot of dates.',
                collectible: true, glowColor: '#8b5cf6',
                hintText: 'Check the dates in the journal'
            },
            {
                id: 'painting',
                x: 45, y: 20, width: 120, height: 100,
                label: 'Family Portrait', icon: '🖼️',
                clue: "A small inscription: 'Painted on my 20th Birthday, 1894.'",
                description: 'A painting of a young man.',
                collectible: true, glowColor: '#06b6d4',
                hintText: 'Look for an inscription on the frame'
            },
            {
                id: 'decorative-vase',
                x: 75, y: 55, width: 50, height: 60,
                label: 'Antique Vase', icon: '🏺',
                clue: "Just a dusty old vase from the Ming Dynasty. Nothing useful here.",
                description: 'A beautiful but irrelevant decorative piece.',
                collectible: true, glowColor: '#6b7280', // Gray for neutral
                hintText: 'Not everything is a clue',
                isMisleading: true
            },
            {
                id: 'safe',
                x: 85, y: 35, width: 70, height: 80,
                label: 'Wall Safe', icon: '🔐',
                description: 'Requires the birth year to open.',
                collectible: false, glowColor: '#22c55e',
                hintText: 'Summon the clues to find the year'
            }
        ],
        hints: [
            "Check the family portrait for a specific date.",
            "The journal mentioned the Great War of 1914. Subtract 20.",
            "If he was 20 in 1894, when was he born?"
        ]
    },
    2: {
        id: 2,
        name: "The Scientist's Lab",
        panorama: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=4096",
        background: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=90",
        objective: "The emergency containment system has been triggered! To override the lockdown, you must identify the chemical symbol of the element needed to stabilize the core.",
        ambientColor: "#0a1628",
        atmosphere: "neon",
        quiz: {
            question: "Which element symbol overrides the lockdown?",
            correctAnswer: "Ag",
            options: ["Au", "Ag", "Fe", "Cu"]
        },
        hotspots: [
            {
                id: 'microscope',
                x: 20, y: 45, width: 70, height: 90,
                label: 'Microscope', icon: '🔬',
                clue: "Slide 42: Atomic Number 47 is the stabilizer.",
                description: 'Microscopic view of a metallic structure.',
                collectible: true, glowColor: '#06b6d4',
                hintText: 'Note the atomic number'
            },
            {
                id: 'chemical-set',
                x: 60, y: 50, width: 80, height: 70,
                label: 'Periodic Table Rubbing', icon: '⚗️',
                clue: "Periodic Table Scrap: '...46 (Pd), 47 (?), 48 (Cd)...'",
                description: 'A torn piece of the periodic table.',
                collectible: true, glowColor: '#22c55e',
                hintText: 'Find what comes between Pd and Cd'
            },
            {
                id: 'beaker',
                x: 40, y: 65, width: 50, height: 50,
                label: 'Empty Beaker', icon: '🧪',
                clue: "Just an empty beaker with H2O residue.",
                description: 'Nothing but water.',
                collectible: true, glowColor: '#6b7280',
                isMisleading: true
            },
            {
                id: 'control-panel',
                x: 80, y: 30, width: 100, height: 80,
                label: 'Reactor Terminal', icon: '🎛️',
                description: 'Input the symbol for Atomic Number 47.',
                collectible: false, glowColor: '#8b5cf6',
                hintText: '47 is Silver'
            }
        ],
        hints: [
            "What is the atomic number for Silver?",
            "Look for evidence near the Periodic Table scrap.",
            "Chemistry students know 47 is Ag."
        ]
    },
    3: {
        id: 3,
        name: "Ancient Temple",
        panorama: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=4096",
        background: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=90",
        objective: "The pharaoh's name is the key to the tomb. Translate the symbols to escape.",
        ambientColor: "#1a1206",
        atmosphere: "warm",
        quiz: {
            question: "What is the name of the Pharaoh buried here?",
            correctAnswer: "RA-HOTEP",
            options: ["KHUFU", "RA-HOTEP", "TUT", "RAMSES"]
        },
        hotspots: [
            {
                id: 'hieroglyph',
                x: 10, y: 30, width: 90, height: 120,
                label: 'Sun Disc Carving', icon: '☀️',
                clue: "The Sun Disc symbol translates to 'RA'.",
                description: 'A bright sun-shaped carving.',
                collectible: true, glowColor: '#f59e0b',
                hintText: 'Translate the sun'
            },
            {
                id: 'altar-scroll',
                x: 50, y: 55, width: 100, height: 70,
                label: 'Priest\'s Scroll', icon: '📜',
                clue: "Scroll suffix: '...HOTEP means Peace.' Full name: [Sun Disc]-[Peace].",
                description: 'A translation guide.',
                collectible: true, glowColor: '#8b5cf6',
                hintText: 'Combine the prefix and suffix'
            },
            {
                id: 'skeleton',
                x: 75, y: 70, width: 60, height: 60,
                label: 'Fallen Explorer', icon: '💀',
                clue: "The explorer's notes: 'I thought it was ANUBIS... I was wrong.'",
                description: 'A warning from the past.',
                collectible: true, glowColor: '#ef4444',
                hintText: 'Don\'t make his mistake'
            }
        ],
        hints: [
            "Combine 'RA' with 'HOTEP'.",
            "The sun symbol is the start of the name.",
            "The name means 'Ra is at Peace'."
        ]
    },
    4: {
        id: 4,
        name: "Space Station Alpha",
        panorama: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=4096",
        background: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=90",
        objective: "The airlock code is based on the distance to the nearest star. Scan the data crystals.",
        ambientColor: "#0d0d1a",
        atmosphere: "space",
        quiz: {
            question: "What is the airlock access code?",
            correctAnswer: "422",
            options: ["314", "422", "999", "101"]
        },
        hotspots: [
            {
                id: 'terminal',
                x: 15, y: 35, width: 80, height: 90,
                label: 'Main Computer', icon: '💻',
                clue: "Log: 'Distance to Proxima Centauri is 4.22 light years.'",
                description: 'Navigation logs.',
                collectible: true, glowColor: '#06b6d4',
                hintText: 'The code is a distance'
            },
            {
                id: 'star-map',
                x: 45, y: 20, width: 100, height: 80,
                label: 'Astro-Chart', icon: '🗺️',
                clue: "Airlock memo: 'The code is the light-year distance of the nearest star, ignoring decimals.'",
                description: 'A map of the local cluster.',
                collectible: true, glowColor: '#8b5cf6',
                hintText: 'Look at the memo'
            },
            {
                id: 'space-junk',
                x: 70, y: 60, width: 60, height: 60,
                label: 'Floating Debris', icon: '🛸',
                clue: "Just a piece of hull from a Russian satellite. 'CCCP'.",
                description: 'Space trash.',
                collectible: true, glowColor: '#6b7280',
                isMisleading: true
            }
        ],
        hints: [
            "Proxima Centauri is the nearest star.",
            "4.22 becomes 422 for the keypad.",
            "Look at the navigation logs for distances."
        ]
    }
};

const useGameStore = create((set, get) => ({
    // Current room
    currentRoom: null,

    // Collected clue IDs (for the current room)
    collectedItems: [], // Keeping name for compatibility, but acts as clues

    // The actual clue data found
    foundClues: [],

    // Game progress state
    gameState: {
        escaped: false,
        lastAnswerCorrect: null, // null, true, or false
    },

    // Timer
    timerStarted: false,
    elapsedTime: 0,

    activeModal: null,
    hintsUsed: 0,
    isGenerating: false,

    // Actions
    setCurrentRoom: async (room) => {
        let fullRoomConfig = roomConfigs[room.id] || room;

        // If it's a static room with Unsplash URLs, upgrade it to HF visual
        if (!fullRoomConfig.isDynamic && fullRoomConfig.background?.includes('unsplash')) {
            set({ isGenerating: true });
            try {
                const prompt = `${fullRoomConfig.name}: ${fullRoomConfig.objective}`;
                const hfVisual = await aiService.generateVisual(prompt, 'panorama');
                if (hfVisual) {
                    fullRoomConfig = {
                        ...fullRoomConfig,
                        background: hfVisual,
                        panorama: hfVisual,
                        isHFUpgraded: true
                    };
                }
            } catch (err) {
                console.error("Failed to upgrade static room to HF:", err);
            } finally {
                set({ isGenerating: false });
            }
        }

        set({
            currentRoom: fullRoomConfig,
            collectedItems: [],
            foundClues: [],
            hintsUsed: 0,
            gameState: { escaped: false, lastAnswerCorrect: null }
        });
    },

    collectHotspot: (hotspotId, clue) => set((state) => {
        if (state.collectedItems.includes(hotspotId)) return state;

        return {
            collectedItems: [...state.collectedItems, hotspotId],
            foundClues: clue ? [...state.foundClues, clue] : state.foundClues
        };
    }),

    submitAnswer: (answer) => {
        const state = get();
        const correct = state.currentRoom?.quiz?.correctAnswer === answer;

        set((state) => ({
            gameState: { ...state.gameState, lastAnswerCorrect: correct }
        }));

        if (correct) {
            // Handle room completion logic
            // In a real app, this might trigger the next room or a success modal
        }

        return correct;
    },

    isHotspotCollected: (hotspotId) => get().collectedItems.includes(hotspotId),

    canInteractWithHotspot: (hotspot) => {
        // In the new quiz logic, all hotspots are generally interactable to find clues
        // unless there's a specific 'required' property for a sequence.
        // For this update, we assume all are interactable if not explicitly required.
        if (!hotspot.required) return true;
        return get().collectedItems.includes(hotspot.required);
    },

    updateGameState: (updates) => set((state) => ({
        gameState: { ...state.gameState, ...updates }
    })),

    setActiveModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null }),
    startTimer: () => set({ timerStarted: true }),
    updateElapsedTime: (time) => set({ elapsedTime: time }),

    showNextHint: () => set((state) => ({
        hintsUsed: Math.min(state.hintsUsed + 1, 3)
    })),

    resetGame: () => set({
        currentRoom: null,
        collectedItems: [],
        foundClues: [],
        gameState: { escaped: false, lastAnswerCorrect: null },
        timerStarted: false,
        elapsedTime: 0,
        activeModal: null,
        hintsUsed: 0,
        isGenerating: false
    }),

    generateDynamicRoom: async (theme, is360 = true) => {
        set({ isGenerating: true });
        try {
            // 1. Generate Room Metadata via Gemini
            const roomConfig = await aiService.generateRoomContent(theme);
            if (!roomConfig) throw new Error("Failed to generate room content");

            // 2. Generate Room Visual via Hugging Face
            const panoramaUrl = await aiService.generateVisual(theme, is360 ? 'panorama' : 'room');

            // 3. Assemble full room config
            const fullRoom = {
                ...roomConfig,
                id: `dynamic-${Date.now()}`,
                panorama: panoramaUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=4096", // Fallback
                background: panoramaUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920",
                isDynamic: true,
                imagePrompts: {
                    room: theme,
                    items: roomConfig.hotspots.reduce((acc, h) => {
                        acc[h.id] = h.description || h.label;
                        return acc;
                    }, {})
                }
            };

            // 4. Update store and set as current room
            set({
                currentRoom: fullRoom,
                collectedItems: [],
                foundClues: [],
                hintsUsed: 0,
                isGenerating: false,
                gameState: { escaped: false, lastAnswerCorrect: null }
            });

            return fullRoom;
        } catch (error) {
            console.error("Dynamic room generation failed:", error);
            set({ isGenerating: false });
            return null;
        }
    },

    // Get current hint
    getCurrentHint: () => {
        const state = get();
        const { currentRoom, hintsUsed } = state;

        if (!currentRoom) return "Select a room to begin!";

        const hints = currentRoom.hints || [];
        const hintIndex = Math.min(hintsUsed, hints.length - 1);

        if (hintsUsed === 0) return "Explore the room and find visible clues!";
        return hints[hintIndex] || "Keep observing the visual details.";
    }
}));

export default useGameStore;
