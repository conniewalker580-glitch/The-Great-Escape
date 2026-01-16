import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = await req.json();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId, // e.g., 'price_1...' from environment or client
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        customer_email: user.emailAddresses[0].emailAddress,
        metadata: {
            userId: userId,
            tier: priceId === "price_pro" ? "pro" : "elite" // Mapping logic to be refined with real IDs
        },
    });

    return NextResponse.json({ url: session.url });
}
