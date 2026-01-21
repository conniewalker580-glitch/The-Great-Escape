import { NextRequest, NextResponse } from 'next/server';
import { getEscapeRoom } from '@/lib/firestore-operations';

export async function GET(
    request: NextRequest,
    { params }: { params: { roomId: string } }
) {
    try {
        const { roomId } = params;
        const room = await getEscapeRoom(roomId);

        if (!room) {
            return NextResponse.json(
                { success: false, error: 'Room not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: room });
    } catch (error) {
        console.error('Error fetching escape room:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch escape room' },
            { status: 500 }
        );
    }
}
