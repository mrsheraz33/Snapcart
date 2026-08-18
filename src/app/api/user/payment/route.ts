import connectDB from "@/lib/db";
import Order from "@/model/order.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!userId || !items || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "please send all data!" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "user not found!" }, { status: 400 });
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

 
    const line_items = items.map((item: any) => {
      const isPublicUrl =
        item.image &&
        (item.image.startsWith("http://") || item.image.startsWith("https://"));

      return {
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.name,
            images: isPublicUrl ? [item.image] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100), 
        },
        quantity: item.quantity || 1,
      };
    });

   
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
      line_items: line_items,
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { message: `order payment error: ${error?.message || error}` },
      { status: 500 },
    );
  }
}