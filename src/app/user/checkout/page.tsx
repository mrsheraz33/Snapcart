"use client";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  Building,
  Home,
  MapPin,
  Navigation,
  Phone,
  PinIcon,
  Search,
  User as UserIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import axios from "axios";
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

  // Initial State: Safe empty strings to avoid controlled-to-uncontrolled warning
  const [address, setAddress] = useState({
    fullname: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setPosition] = useState<[number, number] | null>(null);

  // Sync Redux User Data
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
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position[0]}&longitude=${position[1]}&localityLanguage=en`
      );

      console.log("BigDataCloud Result:", result.data);

      setAddress((prev) => ({
        ...prev,
        city: result.data.city || result.data.locality || "",
        state: result.data.principalSubdivision || "",
        pincode: result.data.postcode || "", 
      }));
    } catch (error) {
      console.log("hello error", error);
    }
  };

  fetchedAddress();
}, [position]);
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
                placeholder="search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium">
                Search
              </button>
            </div>

            {/* Direct Map Rendering */}
            <div className="relative mt-6 h-80 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <DynamicInlineMap position={position} setPosition={setPosition} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
