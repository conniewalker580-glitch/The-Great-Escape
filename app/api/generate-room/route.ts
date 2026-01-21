import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { generateEscapeRoom } from "@/lib/ai";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    const { userId } = await auth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let user = db.getUser(userId);
    if (!user) {
        user = db.createUser(userId);
    }

    const { getTierLimit } = await import("@/lib/subscription");
    const { resetIfNewMonth } = await import("@/lib/usageReset");

    resetIfNewMonth(userId);
    user = db.getUser(userId) || user;

    const currentTier = user.tier;
    const limit = getTierLimit(currentTier);

    // Strict Limit Check using roomsPlayed as general usage meter
    if (user.roomsPlayed >= limit) {
        return NextResponse.json({
            error: `Monthly limit reached for ${currentTier} plan. Upgrade to unlock more simulations.`
        }, { status: 403 });
    }

    const { theme, difficulty } = await req.json();

    // Calculate player stats for adaptive AI
    const completedCount = user.completedHistory?.length || 0;
    const playerLevel = Math.min(10, Math.floor(completedCount / 3) + 1);

    const stats = {
        level: playerLevel,
        puzzleSuccessRate: 0.6,
        hintFrequency: 1.5,
        tier: currentTier
    };

    try {
        const roomData = await generateEscapeRoom(theme || "Space Mystery", difficulty || "Medium", stats);

        const newRoom = {
            id: randomUUID(),
            ownerId: userId,
            theme: theme || "Space Mystery",
            data: roomData,
            createdAt: new Date().toISOString()
        };

        db.addGeneratedRoom(newRoom);

        // Increment usage
        db.updateUser(userId, {
            generatedCount: (user.generatedCount || 0) + 1,
            roomsPlayed: (user.roomsPlayed || 0) + 1
        });

        return NextResponse.json({ success: true, room: newRoom });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "AI Generation Failed" }, { status: 500 });
    }
}
