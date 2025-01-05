import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore fonksiyonları eklendi

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

// Çıkış Yap
const googleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("User Signed Out");
    })
    .catch((error) => {
      console.error("Error during sign out: ", error.message);
    });
};

// ✅ GÜNCELLENMİŞ: Sınav ve alt koleksiyonları ekleyen fonksiyon
const createExam = async (title, category, questions) => {
  try {
      const examRef = await addDoc(collection(db, "Exams"), {
          title: title,
          categoryId: category,
          createdBy: auth.currentUser?.uid || "admin", // Kullanıcı kimliği ekliyoruz
          status: "active",
          createdAt: serverTimestamp()
      });

      // ✅ Questions alt koleksiyonunu ekliyoruz
      for (const question of questions) {
          await addDoc(collection(db, `Exams/${examRef.id}/Questions`), {
              questionText: question.questionText,
              options: question.options,
              correctAnswer: question.correctAnswer
          });
      }

      console.log("Exam and Questions created successfully!");
      alert("Sınav ve sorular başarıyla oluşturuldu!");
  } catch (error) {
      console.error("Error creating exam: ", error);
      alert("Sınav oluşturulurken hata oluştu.");
  }
};

export { auth, googleSignIn, googleSignOut, db, createExam }; // Yeni fonksiyon export edildi.
