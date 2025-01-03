// /src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';  // userSlice'ı import ediyoruz

// Redux store'unu oluşturuyoruz
export const store = configureStore({
  reducer: {
    user: userReducer,  // userSlice reducer'ını burada kullanıyoruz
  },
});
