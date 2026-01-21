import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    const email = req.headers.get("x-user-email");

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await req.json();
    const priceId = process.env[`NEXT_PUBLIC_STRIPE_PRICE_${tier.toUpperCase()}`];

    if (!priceId) {
        return NextResponse.json({ error: "Invalid tier or configuration" }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
            customer_email: email || undefined,
            metadata: { userId, tier },
        });

        return NextResponse.json({ url: session.url });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || "Checkout failed" }, { status: 500 });
    }
}
