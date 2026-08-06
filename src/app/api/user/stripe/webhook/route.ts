import connectDB from "@/lib/db";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Signature verification failed!", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session?.metadata?.orderId;

    if (orderId) {
      await connectDB();
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
      });
      console.log(`Order ${orderId} marked as paid successfully!`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}