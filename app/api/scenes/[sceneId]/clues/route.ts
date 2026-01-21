import { NextRequest, NextResponse } from 'next/server';
import { getCluesByRoomScene } from '@/lib/firestore-operations';

export async function GET(
    request: NextRequest,
    { params }: { params: { sceneId: string } }
) {
    try {
        const { sceneId } = params;
        const clues = await getCluesByRoomScene(sceneId);

        return NextResponse.json({ success: true, data: clues });
    } catch (error) {
        console.error('Error fetching clues:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch clues' },
            { status: 500 }
        );
    }
}
