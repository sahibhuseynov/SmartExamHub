import { GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from './config'; // auth və db konfiqurasiyaları
import { setUser, logout } from '../redux/userSlice';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

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

    // Kullanıcı verisini alalım
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();

      // Kullanıcının hasStarterBadge'inin false olduğunu kontrol et
      if (!userData.hasStarterBadge) {
        // Eğer false ise rozet ver ve güncelle
        await updateDoc(userRef, { hasStarterBadge: true }); // Rozeti ekle
      }
    } else {
      // Eğer kullanıcı verisi yoksa, yeni kullanıcıyı ekle
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: userName,
        photoURL: user.photoURL,
        hasStarterBadge: false,  // Başlangıçta false olarak ekle
        points: 0,
      });
    }

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

    const userName = name || 'Bilinmeyen Kullanıcı';
    const userRef = doc(db, "Users", user.uid);

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: userName,
      points: 0,
      hasStarterBadge: false,
    });

    dispatch(setUser({
      uid: user.uid,
      email: user.email,
      displayName: userName,
    }));

    return true;
  } catch (error) {
    console.error("Email ilə qeydiyyat zamanı xəta baş verdi: ", error.message);

    // Hatanın üst fonksiyona iletilmesi için tekrar fırlatıyoruz
    throw error;
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
