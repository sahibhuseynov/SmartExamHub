import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const createNotification = async ({ userId, title, message, link = null }) => {
  try {
    // Kullanıcının alt koleksiyonuna bildirim ekle
    await addDoc(collection(db, "Users", userId, "notifications"), {
      title,
      message,
      link,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Bildirim oluşturulamadı:", error);
  }
};