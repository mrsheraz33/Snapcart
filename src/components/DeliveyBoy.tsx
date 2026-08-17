import React from 'react'
import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import { auth } from '@/auth'
import connectDB from '@/lib/db'
import Order from '@/model/order.model'

async function DeliveyBoy() {
 await connectDB()
  const session = await auth()
  const deliveryBoyId = session?.user?.id

  const orders = await Order.find({
  assignedDeliveryBoy:deliveryBoyId,
  deliveryOtpVerification:true
  })
 const today = new Date().toDateString()

 const todayOrders = orders.filter((o)=> new Date(o.deliveryAt).toDateString() === today).length
 const todayEarning = todayOrders * 40
  return (
<>
<DeliveryBoyDashboard earning={todayEarning}/>
</>
  )
}

export default DeliveyBoy