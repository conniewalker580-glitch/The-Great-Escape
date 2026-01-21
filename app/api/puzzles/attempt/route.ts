import { NextRequest, NextResponse } from 'next/server';
import {
    createPuzzleAttempt,
    getPuzzle,
    getUserSession,
    updateUserSession
} from '@/lib/firestore-operations';
import { Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userSessionId, puzzleId, userAnswer } = body;

        if (!userSessionId || !puzzleId || !userAnswer) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get the puzzle to check the answer
        const puzzle = await getPuzzle(puzzleId);
        if (!puzzle) {
            return NextResponse.json(
                { success: false, error: 'Puzzle not found' },
                { status: 404 }
            );
        }

        // Check if answer is correct (case-insensitive comparison)
        const isCorrect = userAnswer.trim().toLowerCase() === puzzle.correctAnswer.trim().toLowerCase();

        // Create the puzzle attempt
        const attemptId = await createPuzzleAttempt({
            userSessionId,
            puzzleId,
            userAnswer,
            isCorrect,
            attemptTime: Timestamp.now(),
        });

        // If correct, update session score
        if (isCorrect) {
            const session = await getUserSession(userSessionId);
            if (session) {
                const newScore = (session.score || 0) + 100; // Award 100 points per correct answer
                await updateUserSession(userSessionId, { score: newScore });
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                id: attemptId,
                isCorrect,
                hint: !isCorrect ? puzzle.hint : undefined
            },
            message: isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again!'
        });
    } catch (error) {
        console.error('Error submitting puzzle attempt:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit answer' },
            { status: 500 }
        );
    }
}
