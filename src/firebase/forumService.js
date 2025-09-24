// src/firebase/forumService.js
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Yeni forum gönderisi ekle
export const addForumPost = async (postData) => {
  try {
    console.log("Firestore'a veri gönderiliyor:", postData);
    
    const docRef = await addDoc(collection(db, "forumPosts"), {
      tc: postData.tc,
      name: postData.name,
      phone: postData.phone,
      message: postData.message,
      createdAt: Timestamp.now(),
      likes: 0
    });
    
    console.log("Veri başarıyla gönderildi, ID:", docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error("Gönderi eklenirken hata oluştu:", error);
    console.error("Hata detayları:", error.code, error.message);
    throw error;
  }
};