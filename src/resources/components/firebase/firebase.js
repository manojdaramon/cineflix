import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJD6_kkvxON1DTrN1CtEVi4tODh9Iszdc",
    authDomain: "cineflix-28.firebaseapp.com",
    projectId: "cineflix-28",
    storageBucket: "cineflix-28.firebasestorage.app",
    messagingSenderId: "426415448364",
    appId: "1:426415448364:web:895b63fb6e5f17080e4c89",
    measurementId: "G-TMJBW73D3E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics — only on the client
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, analytics };