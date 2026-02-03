// Game state management using Zustand
import { create } from 'zustand';

const useGameStore = create((set, get) => ({
    // Inventory items
    inventory: [],

    // Game progress state
    gameState: {
        hasKey: false,
        hasUsedKey: false,
        hasNote: false,
        hasExitKey: false,
        safeOpened: false,
        escaped: false,
        drawerOpened: false,
    },

    // Timer
    timerStarted: false,
    elapsedTime: 0,

    // Modals
    activeModal: null,

    // Hints
    hintsUsed: 0,

    // Selected inventory item for use
    selectedItem: null,

    // Actions
    addToInventory: (item) => set((state) => ({
        inventory: [...state.inventory, item]
    })),

    removeFromInventory: (itemId) => set((state) => ({
        inventory: state.inventory.filter(item => item.id !== itemId)
    })),

    updateGameState: (updates) => set((state) => ({
        gameState: { ...state.gameState, ...updates }
    })),

    setActiveModal: (modal) => set({ activeModal: modal }),

    closeModal: () => set({ activeModal: null }),

    startTimer: () => set({ timerStarted: true }),

    updateElapsedTime: (time) => set({ elapsedTime: time }),

    useHint: () => set((state) => ({
        hintsUsed: Math.min(state.hintsUsed + 1, 3)
    })),

    selectItem: (item) => set({ selectedItem: item }),

    clearSelectedItem: () => set({ selectedItem: null }),

    resetGame: () => set({
        inventory: [],
        gameState: {
            hasKey: false,
            hasUsedKey: false,
            hasNote: false,
            hasExitKey: false,
            safeOpened: false,
            escaped: false,
            drawerOpened: false,
        },
        timerStarted: false,
        elapsedTime: 0,
        activeModal: null,
        hintsUsed: 0,
        selectedItem: null,
    }),

    // Get current hint based on game state
    getCurrentHint: () => {
        const state = get();
        const { gameState, hintsUsed } = state;

        const hints = [];

        if (!gameState.hasKey) {
            hints.push(
                "Look around the room carefully. Something might be hiding in plain sight.",
                "There's a book on the shelf that looks interesting...",
                "Click on the book to examine it. There's a key inside!"
            );
        } else if (!gameState.drawerOpened) {
            hints.push(
                "You have a key. What can you open with it?",
                "The vase looks like it might hide something...",
                "Click the vase and use your key to open the hidden drawer!"
            );
        } else if (!gameState.safeOpened) {
            hints.push(
                "You found a note with a code. There must be a safe somewhere.",
                "Look at the painting on the wall...",
                "Click the painting and enter the code from your note: 1234"
            );
        } else if (!gameState.escaped) {
            hints.push(
                "You have the exit key! Now find the door.",
                "Look for the door to escape!",
                "Click on the door to escape the room!"
            );
        }

        return hints[Math.min(hintsUsed, hints.length - 1)] || "You've escaped! Well done!";
    }
}));

export default useGameStore;
