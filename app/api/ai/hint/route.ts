import { NextRequest, NextResponse } from "next/server";
import { getAdaptiveHint } from "@/lib/ai";

export async function POST(req: NextRequest) {
    const { puzzle, attempts } = await req.json();

    try {
        const hint = await getAdaptiveHint(puzzle, attempts || []);
        return NextResponse.json({ hint });
    } catch (e) {
        return NextResponse.json({ error: "Hint generation failed" }, { status: 500 });
    }
}
