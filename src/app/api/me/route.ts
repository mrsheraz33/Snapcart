import { auth } from "@/auth";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "user is not authenticated" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: session.user.email }).select(
      "-password",
    );
    if (!user) {
      return NextResponse.json(
        { message: "user is not found" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "user successfully founded!", user },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `get me error ${error}` },
      { status: 500 },
    );
  }
}
