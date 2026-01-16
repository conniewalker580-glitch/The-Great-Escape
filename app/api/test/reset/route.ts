import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV !== 'development') return NextResponse.json({}, { status: 404 });

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Hard reset
    const data = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'data', 'db.json'), 'utf-8'));
    if (data.users[userId]) {
        data.users[userId] = {
            id: userId,
            tier: 'free',
            credits: 2,
            generatedCount: 0,
            unlockedRooms: ['room-1', 'room-2', 'room-3']
        };
        // Also wipe generated rooms for this user from the array for clean test
        data.generatedRooms = data.generatedRooms.filter((r: any) => r.ownerId !== userId);

        require('fs').writeFileSync(require('path').join(process.cwd(), 'data', 'db.json'), JSON.stringify(data, null, 2));
    }

    return NextResponse.json({ success: true, message: "User reset to FREE tier." });
}
