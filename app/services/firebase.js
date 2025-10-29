import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArWbYT4-bXV3nKv8-WCn9ZRSNgK788DCs",
  authDomain: "partnerandpump.firebaseapp.com",
  projectId: "partnerandpump",
  storageBucket: "partnerandpump.firebasestorage.app",
  messagingSenderId: "266137880793",
  appId: "1:266137880793:web:863a252a2118a38d1916c8",
  measurementId: "G-J87WQ6KB0G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);