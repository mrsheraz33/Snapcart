import { auth } from '@/auth'
import EditRoleMobile from '@/components/EditRoleMobile'
import Nav from '@/components/Nav'
import connectDB from '@/lib/db'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'

async function Home() {
  await connectDB()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  if(!user){
    redirect("/login")
  }
const inComplete = !user.mobile || !user.role || (!user.mobile && user.role==="user")
if(inComplete){
   return <EditRoleMobile/>
}
  return (
 <>
 <Nav user={user}/>
 </>
  )
}

export default Home