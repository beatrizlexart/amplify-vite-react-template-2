// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXFxpDi-sWa6v5J7m2vuPfJKtTCArnum8",
  authDomain: "fans-experience.firebaseapp.com",
  projectId: "fans-experience",
  storageBucket: "fans-experience.firebasestorage.app",
  messagingSenderId: "974460317774",
  appId: "1:974460317774:web:e28c8033c55ed250ae131f",
  measurementId: "G-PTPXECV148",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { auth, googleProvider, facebookProvider };
