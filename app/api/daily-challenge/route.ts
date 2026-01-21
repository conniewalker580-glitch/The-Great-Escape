import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { generateEscapeRoom } from "@/lib/ai";

export async function GET(req: NextRequest) {
    const { userId } = await auth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = db.getUser(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Check if Daily Challenge exists for today in DB (Global check)
    // For MVP, we will generate it on the fly if not cached, or just generate a unique one for the user seeded by date.
    // The requirement implies a shared challenge, but for infinite system, let's make it a unique daily based on the seed.

    const today = new Date().toISOString().split('T')[0];
    const dailyId = `daily-${today}`;

    // Check if user has already generated/started it? 
    const existing = db.getGeneratedRooms(userId).find(r => r.id === dailyId);
    if (existing) {
        return NextResponse.json({ roomId: dailyId, alreadyCompleted: false }); // Logic to check completion could be added
    }

    // 2. Generate Daily Room
    // Fixed theme based on day of week?
    const themes = ["Time Travel", "Cyberpunk", "Haunted Mansion", "Deep Sea", "Space Station", "Jungle", "Arctic"];
    const dayIndex = new Date().getDay();
    const dailyTheme = themes[dayIndex];

    const stats = {
        level: 5, // Daily Challenge is balanced
        puzzleSuccessRate: 0.7,
        hintFrequency: 1,
        tier: user.tier
    };

    const roomData = await generateEscapeRoom(`Daily Challenge: ${dailyTheme}`, "Hard", stats);

    // 3. Save to DB
    db.addGeneratedRoom({
        id: dailyId,
        ownerId: userId,
        theme: dailyTheme,
        data: { ...roomData, id: dailyId, title: `DAILY: ${roomData.title}` },
        createdAt: new Date().toISOString()
    });

    return NextResponse.json({ roomId: dailyId });
}
