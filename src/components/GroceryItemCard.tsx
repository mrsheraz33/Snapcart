"use client";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function GroceryItemCard({ item }: { item: IGrocery }) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((i) => i._id.toString() === item._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-white rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300
        overflow-hidden border border-gray-100 flex flex-col h-full"
    >
  

  <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden group p-2">
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Image
        src={item.image}
        fill
        alt={item.name}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  </div>
      
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1 line-clamp-1">
            {item.category}
          </p>
          <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-snug line-clamp-2 h-10">
            {item.name}
          </h3>
        </div>

        <div className="mt-3 pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              {item.unit}
            </span>
            <span className="text-green-700 font-bold text-base md:text-lg">
              Rs. {item.price}
            </span>
          </div>

          {!cartItem ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700
                text-white rounded-full py-2 text-sm font-medium transition-colors shadow-xs"
              onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
            >
              <ShoppingCart size={16} /> Add to Cart
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-between bg-green-50 border border-green-200 rounded-full
                py-1.5 px-3"
            >
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100
                  hover:bg-green-200 text-green-700 transition-all"
                onClick={() => dispatch(decreaseQuantity(item._id))}
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold text-gray-800">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100
                  hover:bg-green-200 text-green-700 transition-all"
                onClick={() => dispatch(increaseQuantity(item._id))}
              >
                <Plus size={14} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default GroceryItemCard;