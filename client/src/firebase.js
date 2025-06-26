// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // <-- Add this import
import { getFirestore } from "firebase/firestore"; // <-- Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKkDvhxNV_IYb26oWYUQ-QyyPABq7h5s8",
  authDomain: "fittrack-5145b.firebaseapp.com",
  projectId: "fittrack-5145b",
  storageBucket: "fittrack-5145b.firebasestorage.app",
  messagingSenderId: "975182647630",
  appId: "1:975182647630:web:c00064604d79a34bebce1f",
  measurementId: "G-50FS1ZNK6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // <-- Export auth service
export const db = getFirestore(app); // <-- Export Firestore database service

// Export the app instance (optional, but good practice)
export default app;