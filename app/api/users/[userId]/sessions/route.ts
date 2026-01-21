import { NextRequest, NextResponse } from 'next/server';
import { getUserSessionsByUser } from '@/lib/firestore-operations';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const sessions = await getUserSessionsByUser(userId);

        return NextResponse.json({ success: true, data: sessions });
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user sessions' },
            { status: 500 }
        );
    }
}
