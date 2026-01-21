import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { getUser, getSubscription, resetMonthlyUsage } from "@/lib/database";
import { getTierLimit } from "@/lib/subscription";

export async function POST(req: NextRequest) {
    const { userId: authUserId } = await auth(req);
    if (!authUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await req.json(); // Consume body

        // Check if we need to reset monthly usage
        const today = new Date();
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Get user from database
        const user = await getUser(authUserId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Reset if it's a new month
        const lastReset = new Date(user.last_reset_date);
        if (lastReset < firstOfMonth) {
            await resetMonthlyUsage();
        }

        // Get current subscription to determine tier
        const subscription = await getSubscription(authUserId);
        const currentTier = subscription?.tier || user.tier || 'free';

        // Get tier limit
        const limit = getTierLimit(currentTier);

        // Check if user has exceeded limit
        if (user.rooms_played_this_month >= limit) {
            return NextResponse.json({
                allowed: false,
                limit,
                tier: currentTier,
                used: user.rooms_played_this_month
            }, { status: 403 });
        }

        // Allow access
        return NextResponse.json({
            allowed: true,
            remaining: limit === Infinity ? 'Unlimited' : limit - user.rooms_played_this_month,
            tier: currentTier,
            used: user.rooms_played_this_month
        });
    } catch (error) {
        console.error('Error tracking play:', error);
        return NextResponse.json(
            { error: "Failed to track usage" },
            { status: 500 }
        );
    }
}
