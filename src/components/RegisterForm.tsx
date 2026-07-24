import { ArrowLeft, Leaf } from 'lucide-react'
import React from 'react'
import {motion} from "motion/react"

type propType = {
    previousStep: (s:number)=> void
} 

function RegisterForm({previousStep}:propType) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
        <div className='absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-700 
        transition-colors cursor-pointer'>
        <ArrowLeft className='w-5 h-5'/>
        <span className='font-medium' onClick={()=> previousStep(1)}>Back</span>
        </div>

      <motion.h1
        initial={{
        opacity:0,
        y:-10
    }}
    animate={{
        opacity:1,
        y : 0
    }}
    transition={{
        duration: 0.6
    }}
      className='text-4xl font-extrabold text-green-700 mb-2'>
       Create Account
      </motion.h1>
      <p className='text-gray-600 mb-8 flex items-center gap-1'>Join Snapcart today
       <Leaf className='w-5 h-5 text-green-600'/>
       </p>

       <motion.form
         initial={{
        opacity:0,
        y:-10
    }}
    animate={{
        opacity:1,
        y : 0
    }}
    transition={{
        duration: 0.6
    }}
    className='flex flex-col gap-5 w-full max-w-sm'>

       </motion.form>
      
        
    </div>
  )                                                                                                                                                                                                                                                                                 
}

export default RegisterForm