"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function DeliveryBoyDashboard() {

  const [assignment , setAssignment]= useState<any[]>([])

  useEffect(()=>{
const fetchAssignment = async ()=>{
  try {
    const result = await axios.get("/api/delivery/get-assignments")
    setAssignment(result.data)
  } catch (error) {
    console.log(error)
  }
}

fetchAssignment ()
  },)


  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
   <div className='max-w-3xl mx-auto'>
<h2 className='text-2xl font-bold mb-4'>Delivery Assignments</h2>
{assignment.map(a => (
<div key={a._id} className=''>
  <p>{a?.order._id.slice(-6)}</p>
</div>
))}
   </div>
    </div>
  )
}

export default DeliveryBoyDashboard