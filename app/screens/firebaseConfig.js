// app/firebaseConfig.js



import { initializeApp } from "firebase/app";          // creates the Firebase app
import { getAuth } from "firebase/auth";               // lets you use Firebase Authentication
import { getFirestore } from "firebase/firestore";     // lets you use Firestore (the database)


const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                             
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",      
  projectId: "YOUR_PROJECT_ID",                       
  storageBucket: "YOUR_PROJECT_ID.appspot.com",       
  messagingSenderId: "YOUR_SENDER_ID",                // numbers like "123456789"
  appId: "YOUR_APP_ID",                               // big string starting with "1:"
};


const app = initializeApp(firebaseConfig);             // start the Firebase app
export const auth = getAuth(app);                      // for sign-in / auth stuff
export const db = getFirestore(app);                   // for reading/writing to Firestore


