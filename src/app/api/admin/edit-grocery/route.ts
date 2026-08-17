import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/model/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "you are not admin" },
        { status: 400 },
      );
    }

    const formDasta = await req.formData();
    const name = formDasta.get("name") as string;
    const groceryId = formDasta.get("groceryId") as string;
    const category = formDasta.get("category") as string;
    const price = formDasta.get("price") as string;
    const unit = formDasta.get("unit") as string;
    const file = formDasta.get("image") as Blob | null;

    let imageUrl;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }

    const grocery = await Grocery.findByIdAndUpdate(groceryId ,{
      name,
      price,
      category,
      unit,
      image: imageUrl,
    }, {new:true});

    return NextResponse.json({message: "Grocery successfully edit!", grocery}, {status:200})
  } catch (error) {
    console.log(error)
      return NextResponse.json({message:`edit grocery error ${error}`}, {status:500})
  }
}
