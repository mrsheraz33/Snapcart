import { IOrder } from "@/model/order.model";
import { motion } from "motion/react";

function AdminOrderCard({ order }: { order: IOrder }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="bg-white shadow-md hover:shadow-lg border
       border-gray-100 rounded-2xl p-6 transition-all">

    </motion.div>
  );
}

export default AdminOrderCard;
