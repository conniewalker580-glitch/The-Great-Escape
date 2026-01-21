import { NextRequest, NextResponse } from "next/server";
import { auth, getCurrentUserInfo } from "@/lib/firebase-admin";
import {
    createUser,
    getUser,
    getAllUserProgress,
    saveRoomProgress,
    incrementRoomsPlayed,
    checkAndAwardBadges,
    trackUsage
} from "@/lib/database";

export async function GET(req: NextRequest) {
    const { userId } = await auth(req);
    const user = await getCurrentUserInfo(req);

    if (!userId || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get or create user in database
        let dbUser = await getUser(userId);

        if (!dbUser) {
            dbUser = await createUser(
                userId,
                user.email || '',
                user.displayName || undefined
            );
        }

        // Get all room progress
        const progress = await getAllUserProgress(userId);

        // Format response
        const completedHistory = progress
            .filter(p => p.completed)
            .map(p => ({
                roomId: p.room_id,
                stars: p.stars,
                rank: p.rank,
                timeSeconds: p.time_seconds,
                completedAt: p.first_completed_at
            }));

        const unlockedRooms = ['room-1', 'room-2', 'room-3']; // Free rooms always unlocked

        // Unlock next room based on completed rooms
        progress.forEach(p => {
            if (p.completed && p.room_id.startsWith('room-')) {
                const currentNum = parseInt(p.room_id.split('-')[1]);
                const nextRoom = `room-${currentNum + 1}`;
                if (!unlockedRooms.includes(nextRoom)) {
                    unlockedRooms.push(nextRoom);
                }
            }
        });

        return NextResponse.json({
            user: {
                id: dbUser.clerk_id,
                email: dbUser.email,
                tier: dbUser.tier,
                roomsPlayedThisMonth: dbUser.rooms_played_this_month,
                totalRoomsCompleted: dbUser.total_rooms_completed,
                completedHistory,
                unlockedRooms,
                createdAt: dbUser.created_at
            },
            generatedRooms: [] // Placeholder for future AI-generated rooms
        });
    } catch (error) {
        console.error('Error fetching user progress:', error);
        return NextResponse.json(
            { error: "Failed to fetch user progress" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const { userId } = await auth(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { roomId, stars, timeSeconds, rank, hintsUsed } = body;

        if (!roomId) {
            return NextResponse.json({ error: "Room ID required" }, { status: 400 });
        }

        // Save room progress
        await saveRoomProgress({
            userId,
            roomId,
            completed: true,
            stars: stars || 1,
            rank: rank || 'C',
            timeSeconds: timeSeconds || 0,
            hintsUsed: hintsUsed || 0
        });

        // Increment rooms played counter
        const userStats = await incrementRoomsPlayed(userId);

        // Track usage
        await trackUsage({
            userId,
            actionType: 'room_complete',
            roomId,
            metadata: { stars, rank, timeSeconds, hintsUsed }
        });

        // Check and award badges
        const newBadges = await checkAndAwardBadges(userId);

        // Determine next room
        let nextRoom = null;
        if (roomId.startsWith('room-')) {
            const currentNum = parseInt(roomId.split('-')[1]);
            nextRoom = `room-${currentNum + 1}`;
        }

        return NextResponse.json({
            success: true,
            nextRoom,
            unlocked: true,
            newBadges: newBadges.map(b => ({
                id: b.badge_id,
                name: b.name,
                description: b.description,
                icon: b.icon
            })),
            stats: {
                roomsPlayedThisMonth: userStats?.rooms_played_this_month,
                tier: userStats?.tier
            }
        });
    } catch (error) {
        console.error('Error saving room progress:', error);
        return NextResponse.json(
            { error: "Failed to save progress" },
            { status: 500 }
        );
    }
}
