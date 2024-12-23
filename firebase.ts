/* eslint-disable @typescript-eslint/no-unused-vars */
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAV0b0r7aN1TevVTTUKaxIhzeYPVRpwZCM",
  authDomain: "chat-with-pdf-challenge-39f7e.firebaseapp.com",
  projectId: "chat-with-pdf-challenge-39f7e",
  storageBucket: "chat-with-pdf-challenge-39f7e.firebasestorage.app",
  messagingSenderId: "989978570625",
  appId: "1:989978570625:web:56727cc9e914288ba78280",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
