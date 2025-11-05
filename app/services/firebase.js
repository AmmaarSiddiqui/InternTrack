import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeFirestore, setLogLevel } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArWbYT4-bXV3nKv8-WCn9ZRSNgK788DCs",
  authDomain: "partnerandpump.firebaseapp.com",
  projectId: "partnerandpump",
  storageBucket: "partnerandpump.firebasestorage.app",
  messagingSenderId: "266137880793",
  appId: "1:266137880793:web:863a252a2118a38d1916c8",
  measurementId: "G-J87WQ6KB0G",
};

// Ensure we only initialize once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,  // lets it use WebSockets when possible
  useFetchStreams: true,                    // streams when available
  longPollingOptions: { timeoutSeconds: 5 } // faster retries if it *must* long-poll
});

// optional: silence verbose Firestore logs
setLogLevel("error");
