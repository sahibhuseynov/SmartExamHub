import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore başlatma

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAIusQbtHF4NBFhtaelP3meCYzfbV-o_E4",
  authDomain: "cirtdan-8e37b.firebaseapp.com",
  projectId: "cirtdan-8e37b",
  storageBucket: "cirtdan-8e37b.firebasestorage.app",
  messagingSenderId: "460487643008",
  appId: "1:460487643008:web:6c84df88d4c1a93c76bb65",
  measurementId: "G-9HSZ6VGVLV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore başlatma

const provider = new GoogleAuthProvider();

// Google ile Giriş
const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Signed In: ", result.user);
  } catch (error) {
    console.error("Error during sign in: ", error.message);
  }
};

// Çıkış Yap
const googleSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User Signed Out");
  } catch (error) {
    console.error("Error during sign out: ", error.message);
  }
};

export { auth, db, googleSignIn, googleSignOut };
