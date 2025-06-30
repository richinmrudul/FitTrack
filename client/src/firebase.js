
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 

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
export const auth = getAuth(app); 
export const db = getFirestore(app); 


export default app;