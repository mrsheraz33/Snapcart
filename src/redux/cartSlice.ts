import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";
import { number } from "motion";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal:number,
  deliveryfee:number,
  finalTotal: number
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal:0,
  deliveryfee:40,
  finalTotal:40

};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
  
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
    },
    increaseQuantity: (state, action: PayloadAction<mongoose.Types.ObjectId>)=>{
       const item = state.cartData.find(i=> i._id === action.payload)
        if(item){
        item.quantity = item.quantity + 1
        }
    },

     decreaseQuantity: (state, action: PayloadAction<mongoose.Types.ObjectId>)=>{
      const item = state.cartData.find(i=> i._id === action.payload)
        if(item?.quantity && item.quantity>1){
        item.quantity = item.quantity - 1
        }else{
       state.cartData =  state.cartData.filter(i=> i._id !== action.payload)
        }
    },

removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>)=>{
     state.cartData =  state.cartData.filter(i=> i._id !== action.payload)
},

calculateTotal: (state)=>{
  state.subTotal = state.cartData.reduce((sum,item)=>sum + Number(item.price)*item.quantity ,0)
}
  },
});

export const { addToCart,  increaseQuantity,  decreaseQuantity , removeFromCart} = cartSlice.actions;
export default cartSlice.reducer;



    
      