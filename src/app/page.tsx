import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import DeliveyBoy from '@/components/DeliveyBoy'
import EditRoleMobile from '@/components/EditRoleMobile'
import Footer from '@/components/Footer'
import GeoUpdater from '@/components/GeoUpdater'
import Nav from '@/components/Nav'
import UserDashboard from '@/components/UserDashboard'
import connectDB from '@/lib/db'
import Grocery, { IGrocery } from '@/model/grocery.model'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'

async function Home(props:{
  searchParam:Promise<{
    q:string
  }>
}) {

  const searchParams = await props.searchParam
  console.log(searchParams)
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
const plainUser = JSON.parse(JSON.stringify(user))

let groceryList:IGrocery[]=[]
 

if(user.role === "user"){
  if(searchParams?.q){
    groceryList = await Grocery.find({
      $or:[
        {name:{$regex: searchParams?.q || "", $options:"i"}},
        {category:{$regex: searchParams?.q || "", $options:"i"}},
      ]
    })
  }else{
    groceryList = await  Grocery.find({})
  }
}

  return (
 <>
 <Nav user={plainUser}/>
 <GeoUpdater userId={plainUser._id}/>
 {
  user.role == "user" ? (
  <UserDashboard groceryList={groceryList}/>): user.role == "admin" ? (<AdminDashboard/>): <DeliveyBoy/>
 }
 <Footer/>
 </>
  )
}

export default Home