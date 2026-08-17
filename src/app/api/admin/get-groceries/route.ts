import Grocery from "@/model/grocery.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const groceries = await Grocery.find({})

        return NextResponse.json(groceries, {status:200})
    } catch (error) {
          return NextResponse.json({message: `get droceries error ${error}`}, {status:500})
    }
}