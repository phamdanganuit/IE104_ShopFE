// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAAnU7MX4wb340QPfB2a-nUnK11oDNxCcw",
  authDomain: "appshopfe.firebaseapp.com",
  projectId: "appshopfe",
  storageBucket: "appshopfe.firebasestorage.app",
  messagingSenderId: "373356481988",
  appId: "1:373356481988:web:e1e8f068bc1fb55de0e891",
  measurementId: "G-FXKNH9DW69"
};

// Initialize Firebase
const firebaseApp  = initializeApp(firebaseConfig);

export default firebaseApp