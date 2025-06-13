import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Signed In: ", result.user);
  } catch (error) {
    console.error("Error during sign in: ", error.message);
  }
};

const googleSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User Signed Out");
  } catch (error) {
    console.error("Error during sign out: ", error.message);
  }
};

export { auth, db, googleSignIn, googleSignOut };
