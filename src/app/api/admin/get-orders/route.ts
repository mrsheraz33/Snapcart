import connectDB from "@/lib/db";
import Order from "@/model/order.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).populate("user").sort({createdAt:-1});
    return NextResponse.json(orders, { status: 200 });

  } catch (error) {
    
    return NextResponse.json(
      { message: `get orders error ${error}` },
      { status: 500 },
    );
  }
}
