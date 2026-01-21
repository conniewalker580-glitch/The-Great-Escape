import { Timestamp } from 'firebase/firestore';

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Timestamp;
    avatarUrl?: string;
    totalEscapeRoomsCompleted?: number;
    lastLogin?: Timestamp;
}

export interface EscapeRoom {
    id: string;
    name: string;
    description: string;
    createdAt: Timestamp;
    difficulty: string;
    thumbnailUrl?: string;
    estimatedCompletionTime?: number;
}

export interface RoomScene {
    id: string;
    name: string;
    panoramicUrl: string;
    description?: string;
    escapeRoomId: string;
    order: number;
}

export interface Clue {
    id: string;
    name: string;
    imageUrl: string;
    description?: string;
    revealedText?: string;
    roomSceneId: string;
    positionX?: number;
    positionY?: number;
}

export interface Puzzle {
    id: string;
    name: string;
    description: string;
    correctAnswer: string;
    puzzleType: string;
    hint?: string;
    createdAt: Timestamp;
    roomSceneId: string;
    order: number;
}

export interface UserSession {
    id: string;
    startTime: Timestamp;
    endTime?: Timestamp;
    completed: boolean;
    score?: number;
    userId: string;
    escapeRoomId: string;
    currentRoomSceneId?: string;
}

export interface PuzzleAttempt {
    id: string;
    userAnswer: string;
    isCorrect: boolean;
    attemptTime: Timestamp;
    userSessionId: string;
    puzzleId: string;
}

// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    ESCAPE_ROOMS: 'escapeRooms',
    ROOM_SCENES: 'roomScenes',
    CLUES: 'clues',
    PUZZLES: 'puzzles',
    USER_SESSIONS: 'userSessions',
    PUZZLE_ATTEMPTS: 'puzzleAttempts',
} as const;
