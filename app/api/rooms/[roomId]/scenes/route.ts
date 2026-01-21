import { NextRequest, NextResponse } from 'next/server';
import { getRoomScenesByEscapeRoom } from '@/lib/firestore-operations';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const scenes = await getRoomScenesByEscapeRoom(roomId);

        return NextResponse.json({ success: true, data: scenes });
    } catch (error) {
        console.error('Error fetching room scenes:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch room scenes' },
            { status: 500 }
        );
    }
}
