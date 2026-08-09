import connectDB from "@/lib/db";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const {userId, location} = await req.json()
        if(!userId || !location){
            return NextResponse.json({message: "missing userid or location!"}, {status:400})
        }
      
        const user = await User.findByIdAndUpdate(userId, {location})
        if(!user){
       return NextResponse.json({message: "user not found!"}, {status:400})
        }

         return NextResponse.json({success:true}, {status:200})
    } catch (error) {
         return NextResponse.json({message: "mupdate location error"}, {status:500})
    }
}