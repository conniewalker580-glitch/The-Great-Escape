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
