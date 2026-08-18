import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Iuser {
  _id?: string
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string
}

interface IUserSlice{
    userData:Iuser | null
}

const  initialState:IUserSlice ={
    userData:null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserData: (state,action:PayloadAction<Iuser | null>)=>{
         state.userData = action.payload

        }
    }
})



export const {setUserData} = userSlice.actions
export default userSlice.reducer