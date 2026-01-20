import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resetIfNewMonth } = await import("@/lib/usageReset");
    resetIfNewMonth(userId);

    let user = db.getUser(userId);
    const generatedRooms = db.getGeneratedRooms(userId);

    if (!user) {
        user = db.createUser(userId);
    }

    return NextResponse.json({ user, generatedRooms });
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { roomId, stars } = body;
    const user = db.getUser(userId);

    if (user && roomId) {
        // Save history
        const newHistory = [...(user.completedHistory || []), { roomId, stars: stars || 1, completedAt: new Date().toISOString() }];

        // Unlock next room logic (Simple incremental for now)
        // Only unlock if current room is valid format "room-X"
        let newUnlocked = user.unlockedRooms;
        if (roomId.startsWith('room-')) {
            const currentIdNum = parseInt(roomId.split('-')[1]);
            const nextRoomId = `room-${currentIdNum + 1}`;
            newUnlocked = user.unlockedRooms.includes(nextRoomId) ? user.unlockedRooms : [...user.unlockedRooms, nextRoomId];
        }

        db.updateUser(userId, {
            completedHistory: newHistory,
            unlockedRooms: newUnlocked
        });

        return NextResponse.json({ success: true, nextRoom: roomId, unlocked: true });
    }

    // Fallback for just updating credits or other stats if needed
    if (user && body.credits !== undefined) {
        db.updateUser(userId, { credits: body.credits });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
}
