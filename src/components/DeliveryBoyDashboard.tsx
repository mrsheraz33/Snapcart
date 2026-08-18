"use client";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import DeliveryChat from "./DeliveryChat";
import { Loader } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip ,CartesianGrid, Legend} from "recharts";

const LiveMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 bg-gray-100 animate-pulse flex items-center justify-center text-gray-500 rounded-xl">
      Loading Map...
    </div>
  ),
});

interface ILocation {
  latitude: number;
  longitude: number;
}

function DeliveryBoyDashboard({ earning}:{ earning:number}) {
  const [assignment, setAssignment] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] =useState("")
  const [otpError, setOtpError] =useState("")
  const [sendOtpLoading,  setSendOtpLoading] =useState(false)
  const [verifyOtpLoading,  setVerifyOtpLoading] =useState(false)

  const fetchAssignment = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments");
      setAssignment(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (typeof window !== "undefined" && navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setDeliveryBoyLocation({
            latitude: lat,
            longitude: lon,
          });

          socket.emit("update-location", {
            userId: userData._id,
            latitude: lat,
            longitude: lon,
          });
        },
        (err) => {
          console.log(err);
        },
        { enableHighAccuracy: true, maximumAge: 0 },
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignment((prev) => [...prev, deliveryAssignment]);
    });

    return () => socket.off("new-assignment");
  }, []);

  const handelAccept = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${id}/accept-assignment`,
      );
    fetchedCurrentOrder()
    } catch (error) { 
      console.log(error);
    }
  };
  const fetchedCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });

    return () => socket.off("update-deliveryBoy-location");
  }, []);

  useEffect(() => {
    fetchAssignment();
    fetchedCurrentOrder();
  }, [userData]);


const sendOtp =async ()=>{
  setSendOtpLoading(true)
  try {
    const result = await axios.post("/api/delivery/otp/send",{orderId:activeOrder.order._id})
  console.log(result.data)
   setShowOtpBox(true)
    setSendOtpLoading(false)
  } catch (error) {
     console.log(error)
      setSendOtpLoading(false)
  }
}

const verifyOtp  = async ()=>{
  setVerifyOtpLoading(true)
  try {
    const result = await axios.post("/api/delivery/otp/verify",{orderId:activeOrder.order._id, otp})
  console.log(result.data)
  setActiveOrder(null)
    setVerifyOtpLoading(false)
    await fetchedCurrentOrder()
    window.location.reload()
  } catch (error) {
    setOtpError("Otp Verification Error")
     console.log(error)
      setVerifyOtpLoading(false)
  }
}


if(!activeOrder && assignment.length === 0){
  const todayEarning = [
    {name:"Today", earning,delivery:earning /40}
  ]
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-wite to-green-50
    p-6">

<div className="max-w-md w-full text-center">
  <h2 className="text-2xl font-bold text-gray-800">No Active Delivery 🚛</h2>
  <p className="text-gray-500 mb-5">Stay online to receive new orders</p>

<div className="bg-white border rounded-xl p-6">
  <h2 className="font-medium text-green-700 mb-2">Today's Performance</h2>

  <ResponsiveContainer width="100%" height={300}>
        <BarChart data={todayEarning}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend/>
          <Bar dataKey="earning"  name="Earnings" />
          <Bar dataKey="deliveries" name="Deliveries"/>
        </BarChart>
      </ResponsiveContainer>

<p className="mt-4 text-lg font-bold text-green-700">{earning} Earned today</p>
<button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 
rounded-lg" onClick={()=> window.location.reload()}>Refresh Earning</button>

</div>
</div>
    </div>
  )
}


  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-30 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            order# {activeOrder.order._id.slice(-6)}
          </p>

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          <DeliveryChat
            orderId={activeOrder.order._id}
            deliveryBoyId={userData?._id?.toString()!}
          />

<div className="mt-6 bg-white rounded-xl border shadow p-6">
{!activeOrder.order.deliveryOtpVerification && !showOtpBox && (

<button className="w-full py-4 bg-green-600 text-white rounded-lg cursor-pointer flex items-center justify-center"
onClick={sendOtp}>
  {sendOtpLoading ? <Loader className="animate-spin text-white flex items-center" size={16}/> : "Mark as Delivered"} </button>
)}
{
  showOtpBox && 
  <div className="mt-4">
  <input type="text" placeholder="Enter Otp" className="w-full py-3 border border-lg text-center" maxLength={4}
  onChange={(e)=> setOtp(e.target.value)} value={otp}/>
  <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg  flex items-center justify-center"
  onClick={verifyOtp}> 
  {verifyOtpLoading ? <Loader className="animate-spin text-white" size={16}/> : "Verify Otp"} </button>

  {otpError && <div className="text-red-600 mt-2">{otpError}</div>}
  </div>
}

{activeOrder.order.deliveryOtpVerification && <div className="text-green-700 text-center">
  Delivery completed!</div>}

</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-30 mb-7.5">
          Delivery Assignments
        </h2>
        {assignment.map((a, index) => (
          <div
            key={index}
            className="p-5 bg-white rounded-xl shadow mb-4 border"
          >
            <p>Order Id #{a?.order._id.slice(-6)}</p>
            <p className="text-gray-600">{a.order.address.fullAddress}</p>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                onClick={() => handelAccept(a?._id)}
              >
                Accept
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryBoyDashboard;
