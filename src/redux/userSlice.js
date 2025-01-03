// /src/redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Başlangıç durumu
const initialState = {
  user: null,  // Kullanıcı bilgisi başlangıçta null olacak
  isAuthenticated: false,  // Kullanıcı giriş yapmadı
};

// userSlice'ı oluşturuyoruz
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Kullanıcıyı set et
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Kullanıcıyı çıkış yap
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Reducer'ı dışa aktarıyoruz
export const { setUser, logout } = userSlice.actions;

// Slice'ı dışa aktarıyoruz
export default userSlice.reducer;
