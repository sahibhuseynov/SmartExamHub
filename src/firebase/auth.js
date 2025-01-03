import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from './config';
import { setUser, logout } from '../redux/userSlice';

const provider = new GoogleAuthProvider();

// Google ile giriş fonksiyonu (Promise döndürüyor)
export const googleSignIn = async (dispatch) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        dispatch(setUser(user));
        return true;  // Başarı durumu döndürüyor
    } catch (error) {
        console.error("Error during sign in: ", error.message);
        return false;  // Hata durumunda false döndürüyor
    }
};

// Çıkış fonksiyonu
export const googleSignOut = async (dispatch) => {
    try {
        await signOut(auth);
        dispatch(logout());
    } catch (error) {
        console.error("Error during sign out: ", error.message);
    }
};
