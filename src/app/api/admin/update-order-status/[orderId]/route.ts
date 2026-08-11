import connectDB from "@/lib/db";
import DeliveryAssignment from "@/model/deliveryAssignment.model";
import Order from "@/model/order.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { orderId } = await params;
    const { status } = await req.json();

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json(
        { message: "order not found!" },
        { status: 400 },
      );
    }

    order.status = status;
    let deliveryBoyPayload: any = [];
    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      const nearByDeliveryBoy = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
        },
      });
      const nearById = nearByDeliveryBoy.map((b) => b._id);
      const busyId = await DeliveryAssignment.find({
        assignedTo: { $in: nearById },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyId.map((b) => String(b)));
      const availableDeliveryBoy = nearByDeliveryBoy.filter(
        (b) => !busyIdSet.has(String(b._id)));

      const candidates = availableDeliveryBoy.map(b=> b._id)
      if(candidates.length===0){
       await order.save()
       return NextResponse.json({message: "No available delivery boy"}, {status:200})
      }

const deliveryAssignment =await DeliveryAssignment.create({
  order: order._id,
   broadCastedTo:candidates,
   status: "broadcasted"
})
order.assignment = deliveryAssignment._id
deliveryBoyPayload =  availableDeliveryBoy.map(b => ({
  id:b._id,
  name :b.name,
  mobile: b.mobile,
  latitude:b.location.coordinates[1],
  longitude:b.location.coordinates[0]
}))

await deliveryAssignment.populate("order")

    }

await order.save()
await order.populate("user")


 return NextResponse.json({
  assignment : order.assignment?._id,
  availableBoys : deliveryBoyPayload
},{ status: 200 });

  } catch (error) {
    return NextResponse.json({ message: `update status error ${error}` }, { status: 500 });
  }
}
