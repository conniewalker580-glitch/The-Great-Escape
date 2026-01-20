import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getTierLimit } from "@/lib/subscription";
import { resetIfNewMonth } from "@/lib/usageReset";

export async function POST(req: NextRequest) {
    const { userId: authUserId } = await auth();
    if (!authUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await req.json();

    // Ensure monthly reset
    resetIfNewMonth(authUserId);

    const user = db.getUser(authUserId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const limit = getTierLimit(user.tier);

    if (user.roomsPlayed >= limit) {
        return NextResponse.json({
            allowed: false,
            limit,
            tier: user.tier
        }, { status: 403 });
    }

    // Increment usage
    db.updateUser(authUserId, {
        roomsPlayed: user.roomsPlayed + 1
    });

    return NextResponse.json({
        allowed: true,
        remaining: limit === Infinity ? 'Unlimited' : limit - (user.roomsPlayed + 1)
    });
}
