import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV !== 'development') return NextResponse.json({}, { status: 404 });

    const { userId } = await auth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { tier } = await req.json();

    db.updateUser(userId, {
        tier: tier,
        credits: tier === 'elite' ? 999 : 5
    });

    return NextResponse.json({ success: true, message: `Upgraded to ${tier}` });
}
