import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from './config';
import { setUser, logout } from '../redux/userSlice';
import { db } from './config'; // Firestore'u import et
import { doc, setDoc } from "firebase/firestore"; // Firestore'a veri eklemek için gerekli metodlar

const provider = new GoogleAuthProvider();

// Google ile giriş fonksiyonu (Promise döndürüyor)
export const googleSignIn = async (dispatch) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Kullanıcıyı Redux'a ekle
        dispatch(setUser(user));

        // Kullanıcı verilerini Firestore'da 'users' koleksiyonuna kaydet
        const userRef = doc(db, "Users", user.uid); // Kullanıcıyı 'Users' koleksiyonunda UID ile referans alıyoruz
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            hasStarterBadge: false, // Varsayılan olarak 'Başlanğıc' rozetini ekle
            points: 0, // Başlangıç puanı
        });

        return true; // Başarı durumu döndürüyor
    } catch (error) {
        console.error("Error during sign in: ", error.message);
        return false; // Hata durumunda false döndürüyor
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
