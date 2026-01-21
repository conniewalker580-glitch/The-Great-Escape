import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { getAdaptiveHint } from "@/lib/ai";
import { saveAIHint, trackUsage } from "@/lib/database";

export async function POST(req: NextRequest) {
    const { userId } = await auth(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { puzzle, attempts, roomId, puzzleId } = await req.json();

        // Generate AI hint
        const hint = await getAdaptiveHint(puzzle, attempts || []);

        // Save hint to database
        await saveAIHint({
            userId,
            roomId: roomId || 'unknown',
            puzzleId: puzzleId || undefined,
            hintText: hint
        });

        // Track usage
        await trackUsage({
            userId,
            actionType: 'hint_used',
            roomId: roomId || undefined,
            metadata: { puzzleId, wasAI: true }
        });

        return NextResponse.json({ hint });
    } catch (error) {
        console.error('Error generating hint:', error);
        return NextResponse.json(
            { error: "Hint generation failed" },
            { status: 500 }
        );
    }
}
