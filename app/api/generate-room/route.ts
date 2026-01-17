import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateEscapeRoom } from "@/lib/ai";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let user = db.getUser(userId);
    if (!user) {
        user = db.createUser(userId);
    }

    // Tier Logic
    const currentTier = user.tier || 'free';
    const limit = currentTier === 'elite' ? 999 : (currentTier === 'pro' ? 5 : 0);
    const hasCredits = user.credits > 0;

    // Strict Limit Check
    if ((user.generatedCount || 0) >= limit && !hasCredits) {
        return NextResponse.json({
            error: `Monthly generation limit reached for ${currentTier} tier. Upgrade to Elite for unlimited access.`
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
            theme,
            data: roomData,
            createdAt: new Date().toISOString()
        };

        db.addGeneratedRoom(newRoom);

        // Increment Count
        db.updateUser(userId, {
            generatedCount: (user.generatedCount || 0) + 1,
            credits: hasCredits ? user.credits - 1 : user.credits
        });

        return NextResponse.json({ success: true, room: newRoom });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "AI Generation Failed" }, { status: 500 });
    }
}
