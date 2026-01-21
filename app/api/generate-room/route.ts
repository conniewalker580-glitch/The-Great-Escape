import { NextRequest, NextResponse } from "next/server";
import { generateEscapeRoom } from "@/lib/ai";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { theme, difficulty, stats } = await req.json();

        const roomData = await generateEscapeRoom(
            theme || "Space Mystery",
            difficulty || "Medium",
            stats || { level: 1, tier: 'free' }
        );

        if (!roomData.id) roomData.id = randomUUID();

        return NextResponse.json({ success: true, room: roomData });
    } catch (e) {
        console.error("AI Generation Error", e);
        return NextResponse.json({ error: "AI Generation Failed" }, { status: 500 });
    }
}
