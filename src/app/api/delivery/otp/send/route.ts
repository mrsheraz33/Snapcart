import connectDB from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findById(orderId).populate("user");
    console.log("hello order id", order);
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOtp = otp;
    await order.save();


    console.log("your new code", otp)
    await sendMail(
      order.user.email,
      "Your Delivery Otp",
      `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2>SnapCart Delivery Verification</h2>
    <p>Your OTP for order delivery is:</p>
    <h1 style="color: #16a34a; letter-spacing: 2px;">${otp}</h1>
  </div>
`,
    );

    return NextResponse.json(
      { message: "opt send successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `opt error ${error}` },
      { status: 500 },
    );
  }
}
