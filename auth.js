// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// ВСТАВЬ СЮДА СВОЙ firebaseConfig ИЗ FIREBASE CONSOLE
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtxLMUG883UGtubHvH6V_418I8ga1eIpU",
  authDomain: "pipiska-d2fe6.firebaseapp.com",
  projectId: "pipiska-d2fe6",
  storageBucket: "pipiska-d2fe6.firebasestorage.app",
  messagingSenderId: "414167313955",
  appId: "1:414167313955:web:f0107175e3c942fbcb8b96",
  measurementId: "G-NSCEB7SW34"
};
window.__firebaseConfig = firebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// делаем удобный доступ
window.__auth = { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut };
