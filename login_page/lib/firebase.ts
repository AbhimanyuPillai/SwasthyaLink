import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPHmyJzWBxpTgT7yWcjQ5nZsK9CT_66CA",
  authDomain: "swasthyalink-371ad.firebaseapp.com",
  projectId: "swasthyalink-371ad",
  storageBucket: "swasthyalink-371ad.firebasestorage.app",
  messagingSenderId: "865166032383",
  appId: "1:865166032383:web:03a11e22a4756d33267bca"
};

// NEXT.JS FIX: Check if an app is already running before starting a new one!
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);