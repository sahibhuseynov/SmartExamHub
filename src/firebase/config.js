// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

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

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Giriş işlemi
const googleSignIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User Signed In: ", user);
    })
    .catch((error) => {
      console.error("Error during sign in: ", error.message);
    });
};

// Çıkış işlemi
const googleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("User Signed Out");
    })
    .catch((error) => {
      console.error("Error during sign out: ", error.message);
    });
};

export { auth, googleSignIn, googleSignOut };
