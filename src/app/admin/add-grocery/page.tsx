"use client"
import { ArrowLeft, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from "motion/react";

function AddGrocery() {

    const categories = [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Meat & Seafood",
        "Bakery & Bread",
        "Beverages",
        "Snacks & Sweets",
        "Pantry & Staples",
        "Frozen Foods",
        "Organic & Health",
        "Personal Care",
    ]
    const units =["Kg", "Gram", "Liter", "Ml", "Piece", "Pack"]
  return (
    <div className='min-h-screen flex items-center justify-center
     bg-linear-to-br from-green-50 to-white py-16 px-4 relative'>

    <Link href={"/"}
    className='absolute top-6  left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2
    rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all'>
   <ArrowLeft className='w-5 h-5'/>
   <span className='hidden md:flex'>Back to home</span>
    </Link>

<motion.div
initial={{y:20, opacity:0}}
animate={{y:0, opacity:1}}
transition={{duration:0.4}}
className='bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8'>

<div className='flex flex-col items-center mb-8'>
<div className='flex items-center gap-3'>
    <PlusCircle className='text-green-600 w-8 h-8'/>
    <h1>Add Your Grocery</h1>
</div>
 <p className='text-gray-500 text-sm mt-2 text-center'>Fill out the details below to add a new grocery item.</p>
</div>

<form className='flex flex-col gap-6 w-full'>
<div>
    <label htmlFor="name" className='block text-gray-700 font-medium mb-1'>Grocery Name
    <span className='text-red-500'>*</span>
    </label>
    <input id='name' type="text" placeholder='eg: sweets,Milk, ...'
    className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none
              focus:ring-2 focus:ring-green-400 transition-all'/>
</div>

<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
    <div>
        <label className='block text-gray-700 font-medium mb-1'>Category
        <span className='text-red-500'>*</span>
        </label>
        <select name="category">
            <option value="" disabled >Select Category</option>
        </select>
    </div>



    <div></div>
</div>


</form>

</motion.div>
    </div>
  )
}

export default AddGrocery