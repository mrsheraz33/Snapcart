import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB()
        const {orderId, otp}= await req.json()
console.log(orderId, otp)
        if(!orderId || !otp){
            return NextResponse.json({message: "orderId or otp not found"}, {status:400})
        }

        const order = await Order.findById(orderId)

          if (!order) {
              return NextResponse.json({ message: "order not found" }, { status: 400 });
            }

            if(order.deliveryOtp !== otp){
                 return NextResponse.json({ message: "Incorrect or expired otp" }, { status: 400 });
            }


            console.log("otp code",order.deliveryOtp, order)

            order.status = "delivered"
            order.deliveryOtpVerification = true
            order.deliveryAt= new Date()
            await order.save()

              await emitEventHandler("order-status-update", {orderId:order._id,status:order.status})

           await DeliveryAssignment.updateOne(
            {order:orderId},
            {$set:{assignedTo:null, status: "completed"}}
           )

            return NextResponse.json({ message: "Delivery successfully completed!" }, { status: 200 });
        
    } catch (error) {
         return NextResponse.json({ message: `otp verify error ${error}`}, { status: 500 });
    }
}