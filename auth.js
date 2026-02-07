// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// ВСТАВЬ СЮДА СВОЙ firebaseConfig ИЗ FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "…",
  authDomain: "…",
  projectId: "…",
  appId: "…",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// делаем удобный доступ
window.__auth = { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut };
