import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice";
import cartSlice from "./cartSlice";

export const store = configureStore({
    reducer:{
    user: userReducer,
    cart:cartSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
