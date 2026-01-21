import { NextRequest, NextResponse } from 'next/server';
import { getAllEscapeRooms, getEscapeRoomsByDifficulty } from '@/lib/firestore-operations';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const difficulty = searchParams.get('difficulty');

        let rooms;
        if (difficulty) {
            rooms = await getEscapeRoomsByDifficulty(difficulty);
        } else {
            rooms = await getAllEscapeRooms();
        }

        return NextResponse.json({ success: true, data: rooms });
    } catch (error) {
        console.error('Error fetching escape rooms:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch escape rooms' },
            { status: 500 }
        );
    }
}
