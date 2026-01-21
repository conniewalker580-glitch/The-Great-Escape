import { NextRequest, NextResponse } from 'next/server';
import { getPuzzlesByRoomScene } from '@/lib/firestore-operations';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sceneId: string }> }
) {
    try {
        const { sceneId } = await params;
        const puzzles = await getPuzzlesByRoomScene(sceneId);

        return NextResponse.json({ success: true, data: puzzles });
    } catch (error) {
        console.error('Error fetching puzzles:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch puzzles' },
            { status: 500 }
        );
    }
}
