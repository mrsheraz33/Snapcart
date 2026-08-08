import connectDB from "@/lib/db";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function POST(req:NextRequest,{params}:Params) {
    try {
      await  connectDB()
      const {orderId} = await params
      const {status} = await req.json()

      const order = await Order.findById(orderId).populate("user")
      if(!order) {
        return NextResponse.json({message: "order not found!"}, {status:400})
      }

      order.status = status
      let availableDeliveryBoy:any=[]
      if(status === "out of delivery" && !order.assignment){
        
      }
    } catch (error) {
         return NextResponse.json({message: "order not found!"}, {status:400})
    }
}