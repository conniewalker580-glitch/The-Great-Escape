import { NextRequest, NextResponse } from 'next/server';
import {
    createUserSession,
    getActiveUserSession,
    updateUserSession
} from '@/lib/firestore-operations';
import { Timestamp } from 'firebase/firestore';

// Start a new session
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, escapeRoomId } = body;

        if (!userId || !escapeRoomId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if there's already an active session
        const existingSession = await getActiveUserSession(userId, escapeRoomId);
        if (existingSession) {
            return NextResponse.json({
                success: true,
                data: existingSession,
                message: 'Resuming existing session'
            });
        }

        // Create new session
        const sessionId = await createUserSession({
            userId,
            escapeRoomId,
            startTime: Timestamp.now(),
            completed: false,
            score: 0,
        });

        return NextResponse.json({
            success: true,
            data: { id: sessionId },
            message: 'Session started'
        });
    } catch (error) {
        console.error('Error starting session:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to start session' },
            { status: 500 }
        );
    }
}

// Update session progress
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, currentRoomSceneId, score, completed } = body;

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: 'Session ID required' },
                { status: 400 }
            );
        }

        const updates: any = {};
        if (currentRoomSceneId !== undefined) updates.currentRoomSceneId = currentRoomSceneId;
        if (score !== undefined) updates.score = score;
        if (completed !== undefined) {
            updates.completed = completed;
            if (completed) {
                updates.endTime = Timestamp.now();
            }
        }

        await updateUserSession(sessionId, updates);

        return NextResponse.json({
            success: true,
            message: 'Session updated'
        });
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update session' },
            { status: 500 }
        );
    }
}
