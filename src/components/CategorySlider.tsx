"use client";
import {
  Apple,
  Egg,
  Fish,
  Croissant,
  Coffee,
  Cookie,
  Wheat,
  IceCream,
  Leaf,
  Sparkles,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function CategorySlider() {
  const categories = [
    {
      id: 1,
      name: "Fruits & Vegetables",
      icon: Apple,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      id: 2,
      name: "Dairy & Eggs",
      icon: Egg,
      color: "bg-amber-100 text-amber-600",
    },
    {
      id: 3,
      name: "Meat & Seafood",
      icon: Fish,
      color: "bg-rose-100 text-rose-600",
    },
    {
      id: 4,
      name: "Bakery & Bread",
      icon: Croissant,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: 5,
      name: "Beverages",
      icon: Coffee,
      color: "bg-sky-100 text-sky-600",
    },
    {
      id: 6,
      name: "Snacks & Sweets",
      icon: Cookie,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 7,
      name: "Pantry & Staples",
      icon: Wheat,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: 8,
      name: "Frozen Foods",
      icon: IceCream,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 9,
      name: "Organic & Health",
      icon: Leaf,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 10,
      name: "Personal Care",
      icon: Sparkles,
      color: "bg-pink-100 text-pink-600",
    },
  ];
  const [showLeft, setShowLeft] = useState<Boolean>();
  const [showRight, setShowRight] = useState<Boolean>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sceroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth <= scrollWidth - 5);
  };

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(autoScroll);
  }, []);

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <motion.div
      className="w-[90%] md:w-[80%] mx-auto mt-10 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 flex items-center justify-center gap-2 text-center">
        <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />
        <span>Shop by category</span>
      </h2>
      {showLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100
rounded-full w-10 h-10 flex items-center justify-center transition-all"
          onClick={() => sceroll("left")}
        >
          <ChevronLeft className="w-6 h-6 text-green-700" />
        </button>
      )}

      <div
        className="flex gap-6 overflow-x-auto px-10 pb-4 no-scrollbar scroll-smooth"
        ref={scrollRef}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              className={`min-w-36 md:min-w-45 flex flex-col items-center justify-center rounded-2xl
   ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="flex flex-col items-center justify-center p-5">
                <Icon className="w-10 h-10 mb-3" />
                <p className="text-center text-sm md:text-base font-semidold text-gray-700">
                  {cat.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {showRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100
rounded-full w-10 h-10 flex items-center justify-center transition-all"
          onClick={() => sceroll("right")}
        >
          <ChevronRight className="w-6 h-6 text-green-700" />
        </button>
      )}
    </motion.div>
  );
}

export default CategorySlider;
