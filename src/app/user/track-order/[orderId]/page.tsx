"use client";

import dynamic from "next/dynamic";
import { getSocket } from "@/lib/socket";
import { Iuser } from "@/model/user.model";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import mongoose from "mongoose";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 bg-gray-100 animate-pulse flex items-center justify-center text-gray-500 rounded-3xl">
      Map Loading...
    </div>
  ),
});

interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    }
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: string;
    longitude: string;
  };
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: Iuser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<IOrder>();
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        const data = result.data;
        setOrder(data);

        if (data?.address) {
          setUserLocation({
            latitude: Number(data.address.latitude) || 0,
            longitude: Number(data.address.longitude) || 0,
          });
        }

        if (data?.assignedDeliveryBoy?.location?.coordinates) {
          setDeliveryBoyLocation({
            latitude: data.assignedDeliveryBoy.location.coordinates[1], 
            longitude: data.assignedDeliveryBoy.location.coordinates[0], 
          });
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    if (orderId) {
      getOrder();
    }
  }, [orderId, userData?._id]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
  
      if (
        order?.assignedDeliveryBoy?._id &&
        userId.toString() === order.assignedDeliveryBoy._id.toString()
      ) {
        setDeliveryBoyLocation({
          latitude: location.coordinates[1], 
          longitude: location.coordinates[0], 
        });
      }
    });

    return () => {
      socket.off("update-deliveryBoy-location");
    };
  }, [order]);

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">
        <div className="sticky top-4 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-50">
          <button
            className="p-2 bg-green-100 rounded-full cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="text-green-700" size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Track Order</h2>
            <p className="text-sm text-gray-600">
              order#{order?._id?.toString().slice(-6)}{" "}
              <span className="text-green-700 font-semibold">
                {order?.status}
              </span>{" "}
            </p>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="rounded-3xl overflow-hidden border shadow">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;