import {  GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from './config'; // auth və db konfiqurasiyaları
import { setUser, logout } from '../redux/userSlice';
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

// Google ilə giriş
export const googleSignIn = async (dispatch) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Eğer displayName yoksa, bir yedek değer ekleyelim
      const userName = user.displayName || "Bilinmeyen Kullanıcı";
  
      dispatch(setUser(user));
  
      const userRef = doc(db, "Users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: userName,  // displayName'ı burada manuel olarak güncelliyoruz
        photoURL: user.photoURL,
        hasStarterBadge: false,
        points: 0,
      }, { merge: true });
  
      return true;
    } catch (error) {
      console.error("Error during Google sign in: ", error.message);
      return false;
    }
  };
  

// E-poçt və parol ilə qeydiyyat
export const emailSignUp = async (email, password, name, dispatch) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Eğer name boşsa, varsayılan bir kullanıcı adı atıyoruz
      const userName = name || 'Bilinmeyen Kullanıcı';  // Eğer `name` boşdursa, "Bilinmeyen Kullanıcı" təyin edilir
  
      // Firestore'da istifadəçi məlumatlarını saxlayırıq
      const userRef = doc(db, "Users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: userName,  // Burada displayName olaraq `userName` təyin edirik
        points: 0,
        hasStarterBadge: false,
      });
  
      // Redux'a istifadəçi məlumatını göndəririk
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: userName,  // Redux'da da adı düzgün əlavə edirik
      }));
  
      return true;
    } catch (error) {
      console.error("Email ilə qeydiyyat zamanı xəta baş verdi: ", error.message);
      return false;
    }
  };
  
  
  

// E-poçt və parol ilə giriş
export const emailSignIn = async (email, password, dispatch) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch(setUser(userCredential.user));
    return true;
  } catch (error) {
    console.error("Error during email sign in: ", error.message);
    return false;
  }
};

// Çıxış
export const googleSignOut = async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error) {
    console.error("Error during sign out: ", error.message);
  }
};

export { auth, db };
