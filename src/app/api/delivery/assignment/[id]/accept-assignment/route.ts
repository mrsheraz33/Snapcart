import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 400 });
    }
    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "assignment not found" },
        { status: 400 },
      );
    }

    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "assignment expire1" },
        { status: 400 },
      );
    }

    const alreadyassigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "completed"] },
    });
    if (alreadyassigned) {
      return NextResponse.json(
        { message: "already assigned to other order!" },
        { status: 400 },
      );
    }
    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return NextResponse.json(
        { message: "order not found!" },
        { status: 400 },
      );
    }

    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadCastedTo: deliveryBoyId,
        status: "broadcasted",
      },
      { $pull: { broadCastedTo: deliveryBoyId } },
    );
    return NextResponse.json(
      { message: "order accepted successfully!" },
      { status: 200 },
    );
  } catch (error) {
       return NextResponse.json({message: `accept assignment error ${error}`},{status:500})
  }
}
