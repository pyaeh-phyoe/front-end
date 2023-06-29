import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import productReducer from '../features/productSlice'
import orderReducer from '../features/orderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
    product: productReducer,
  },
})