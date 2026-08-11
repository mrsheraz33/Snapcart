import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectDB()
        const session = await auth()
        const assignment = await DeliveryAssignment.find({
        broadCastedTo:session?.user?.id,
        status:"broadcasted"
        }).populate("order")

        return NextResponse.json(assignment , {status:200})
    } catch (error) {
         return NextResponse.json({message : `get assignment error ${error}`}, {status:500})
    }
}