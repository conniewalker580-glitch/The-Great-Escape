import fs from 'fs';
import path from 'path';

import { Room } from './game-data';

const DB_PATH = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'db.json');

type RoomResult = {
    roomId: string;
    stars: 1 | 2 | 3;
    completedAt: string;
};

type User = {
    id: string;
    tier: 'free' | 'explorer' | 'adventurer' | 'master';
    credits: number;
    generatedCount: number;
    unlockedRooms: string[];
    completedHistory: RoomResult[]; // Track performance
    roomsPlayed: number; // rooms played in current month
    usageMonth: string; // e.g. "2026-01"
    stripeCustomerId?: string;
};

type GeneratedRoom = {
    id: string;
    ownerId: string;
    theme: string;
    data: Room; // Full room object
    createdAt: string;
};

type DB = {
    users: Record<string, User>;
    generatedRooms: GeneratedRoom[];
};

// Initialize DB
if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH);
}
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: {}, generatedRooms: [] }, null, 2));
}

function readDB(): DB {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data: DB) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export const db = {
    getUser: (userId: string) => {
        const data = readDB();
        return data.users[userId] || null;
    },
    createUser: (userId: string) => {
        const data = readDB();
        if (!data.users[userId]) {
            const now = new Date();
            const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            data.users[userId] = {
                id: userId,
                tier: 'free',
                credits: 0,
                generatedCount: 0,
                unlockedRooms: ['room-1', 'room-2', 'room-3'],
                completedHistory: [],
                roomsPlayed: 0,
                usageMonth: month
            };
            writeDB(data);
        }
        return data.users[userId];
    },
    updateUser: (userId: string, updates: Partial<User>) => {
        const data = readDB();
        if (data.users[userId]) {
            data.users[userId] = { ...data.users[userId], ...updates };
            writeDB(data);
        }
        return data.users[userId];
    },
    addGeneratedRoom: (room: GeneratedRoom) => {
        const data = readDB();
        data.generatedRooms.push(room);
        writeDB(data);
        return room;
    },
    getGeneratedRooms: (userId: string) => {
        const data = readDB();
        return data.generatedRooms.filter(r => r.ownerId === userId);
    }
};
