"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

function OrderSuccess() {
  useEffect(() => {
    const end = Date.now() + 1.5 * 1000;
    const colors = ["#22c55e", "#3b82f6", "#f59e0b"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50/50 via-white to-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-100 rounded-full blur-2xl opacity-60" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-100 rounded-full blur-2xl opacity-60" />

        <div className="relative flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner"
          >
            <motion.div
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <CheckCircle2 className="w-14 h-14 stroke-[2.5]" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Thank you for shopping with us! We've received your order and are
            preparing it for delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-sm text-emerald-600 border border-gray-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Estimated Delivery
              </p>
              <p className="text-sm font-semibold text-gray-800">
                2 - 4 Business Days
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="space-y-3"
        >
          <Link
            href="/user/my-orders"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4 text-gray-500" />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;
