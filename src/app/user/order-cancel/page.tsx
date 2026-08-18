"use client";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

function OrderCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center"
      >
 
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <XCircle size={48} strokeWidth={2.2} />
        </motion.div>

    
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Order Cancelled
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-sm mb-8 leading-relaxed"
        >
          Your payment was not completed, and your order has been cancelled.
          Don't worry, no charges were made to your account.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push("/user/cart")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            <span>Try Again / Return to Cart</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            <span>Continue Shopping</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OrderCancel;