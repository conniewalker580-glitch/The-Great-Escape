import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV !== 'development') return NextResponse.json({}, { status: 404 });

    const { userId } = await auth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Hard reset
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (data.users && data.users[userId]) {
        data.users[userId] = {
            id: userId,
            tier: 'free',
            credits: 2,
            generatedCount: 0,
            unlockedRooms: ['room-1', 'room-2', 'room-3']
        };
        // Also wipe generated rooms for this user from the array for clean test
        if (Array.isArray(data.generatedRooms)) {
            data.generatedRooms = data.generatedRooms.filter((r: { ownerId: string }) => r.ownerId !== userId);
        }

        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ success: true, message: "User reset to FREE tier." });
}
