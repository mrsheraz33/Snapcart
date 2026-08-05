"use client";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  Building,
  CreditCard,
  CreditCardIcon,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  PinIcon,
  Search,
  Truck,
  User as UserIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { BsStripe } from "react-icons/bs";
import("leaflet/dist/leaflet.css");

interface MapProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

const DynamicInlineMap = dynamic(
  async () => {
    const L = await import("leaflet");
    const { MapContainer, TileLayer, Marker, useMap } =
      await import("react-leaflet");

    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      iconRetinaUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    function RecenterMap({ pos }: { pos: [number, number] }) {
      const map = useMap();
      useEffect(() => {
        if (pos) {
          map.flyTo(pos, 15, { animate: true });
        }
      }, [pos, map]);
      return null;
    }

    return function InlineMap({ position, setPosition }: MapProps) {
      const defaultPos: [number, number] = position || [28.6139, 77.209];

      return (
        <MapContainer
          center={defaultPos}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full rounded-xl z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && (
            <>
              <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target as L.Marker;
                    const latLng = marker.getLatLng();

                    setPosition([latLng.lat, latLng.lng]);
                  },
                }}
              />

              <RecenterMap pos={position} />
            </>
          )}
        </MapContainer>
      );
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 font-medium animate-pulse">
        Loading Map...
      </div>
    ),
  },
);

function Checkout() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryfee, finalTotal , cartData} = useSelector(
    (state: RootState) => state.cart,
  );

  const [address, setAddress] = useState({
    fullname: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullname: userData.name || "",
        mobile: userData.mobile || "",
      }));
    }
  }, [userData]);

  // Fetch Browser Geolocation
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.warn("Location permission denied or error:", err.message);
          // Fallback location to prevent map breaking
          setPosition([31.5204, 74.3587]);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);

  useEffect(() => {
    const fetchedAddress = async () => {
      if (!position) return;

      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );

        console.log("hello", result.data);

        setAddress((prev) => ({
          ...prev,
          city: result.data.address.district || result.data.address.city,
          state: result.data.address.state,
          pincode: result.data.address.postcode || "",
          fullAddress: result.data.display_name,
        }));
      } catch (error) {
        console.log("hello error", error);
      }
    };

    fetchedAddress();
  }, [position]);

  const handelSearchQuery = async () => {
    setSearchLoading(true);
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results) {
      setSearchLoading(false);
      setPosition([results[0].y, results[0].x]);
    }
  };

  const handelCurrentLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.warn("Location permission denied or error:", err.message);
          // Fallback location to prevent map breaking
          setPosition([31.5204, 74.3587]);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  };


  const   handelCod = async ()=>{
    if(!position) {
      return null
    }
    try {
      const  result = await axios.post("/api/user/order", {
        userId:userData?._id,
        items:cartData.map(item => (
          {
            grocery:item._id,
            name:item.name,
            price:item.price,
            unit: item.unit,
            quantity: item.quantity,
            image:item.image
          }
        )),
        totalAmount:finalTotal,
        address:{
          fullName: address.fullname,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          fullAddress:address.fullAddress,
          pincode:address.pincode,
          latitude:position[0],
          longitude:position[1]
        },
        paymentMethod
      })

     router.push("/user/order-success")
    } catch (error) {
      console.log(error)
    }
  }

  const  handelOnlinePayment = async ()=>{
      if(!position) {
      return null
    }
try {
  const result = await axios.post("/api/user/payment",  {
        userId:userData?._id,
        items:cartData.map(item => (
          {
            grocery:item._id,
            name:item.name,
            price:item.price,
            unit: item.unit,
            quantity: item.quantity,
            image:item.image
          }
        )),
        totalAmount:finalTotal,
        address:{
          fullName: address.fullname,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          fullAddress:address.fullAddress,
          pincode:address.pincode,
          latitude:position[0],
          longitude:position[1]
        },
        paymentMethod
      })
      window.location.href = result.data.url
} catch (error) {
  console.log(error)
}
  }

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        onClick={() => router.push("/user/cart")}
        whileTap={{ scale: 0.97 }}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
      >
        <ArrowLeft size={16} />
        <span>Back to cart</span>
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <UserIcon
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullname || ""}
                placeholder="Full Name"
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, fullname: e.target.value }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 text-gray-800"
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.mobile || ""}
                placeholder="Mobile Number"
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 text-gray-800"
              />
            </div>

            {/* Full Address */}
            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullAddress || ""}
                placeholder="Full Address"
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 text-gray-800"
              />
            </div>

            {/* City / State / Pincode */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.city || ""}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="city"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 text-gray-800"
                />
              </div>

              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.state || ""}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  placeholder="state"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 text-gray-800"
                />
              </div>

              <div className="relative">
                <PinIcon
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.pincode || ""}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, pincode: e.target.value }))
                  }
                  placeholder="Pincode (e.g. 57000)"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50 text-gray-800"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={searchQuery}
                placeholder="search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-5 rounded-lg
               hover:bg-green-700 transition-all font-medium"
                onClick={handelSearchQuery}
              >
                {searchLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* Direct Map Rendering */}
            <div className="relative mt-6 h-80 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <DynamicInlineMap position={position} setPosition={setPosition} />
              <motion.button
                whileTap={{ scale: 0.93 }}
                className="absolute bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700
               not-only-of-type: transition-all flex items-center justify-center z-999"
                onClick={handelCurrentLocation}
              >
                <LocateFixed size={22} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all
        duration-300 p-6 border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-green-600" /> Payment Method
          </h2>

          <div className="space-y-4 mb-6">
            <button
              className={`flex items-center gap-3 w-full border rounded-lg p-3 
            transition-all ${
              paymentMethod === "online"
                ? "border-green-600 bg-green-50 shadow-sm"
                : "hover:bg-gray-50"
            }`}
              onClick={() => setPaymentMethod("online")}
            >
              <CreditCardIcon className="text-green-600" />{" "}
              <span className="font-medium text-gray-700">
                Pay Online (stripe)
              </span>
            </button>

            <button
              className={`flex items-center gap-3 w-full border rounded-lg p-3 
            transition-all ${
              paymentMethod === "cod"
                ? "border-green-600 bg-green-50 shadow-sm"
                : "hover:bg-gray-50"
            }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <Truck className="text-green-600" />
              <span className="font-medium text-gray-700">
                Cash on Delivery
              </span>
            </button>
          </div>

          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold text-green-600">RS.{subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery Fee</span>
              <span className="font-semibold text-green-600">RS.{deliveryfee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Final Total</span>
              <span className="text-green-600">RS.{finalTotal}</span>
            </div>
          </div>

          <motion.button
          whileTap={{scale:0.93}}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all
          font-semibold"
          onClick={()=>{
            if(paymentMethod === "cod"){
              handelCod()
            }else{
            handelOnlinePayment()
            }
          }}>
            {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
