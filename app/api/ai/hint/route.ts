import { NextRequest, NextResponse } from "next/server";
import { getAdaptiveHint } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const { puzzle, attempts } = await req.json();
        const hint = await getAdaptiveHint(puzzle, attempts || []);
        return NextResponse.json({ hint });
    } catch (error) {
        console.error('Error generating hint:', error);
        return NextResponse.json({ error: "Hint generation failed" }, { status: 500 });
    }
}
