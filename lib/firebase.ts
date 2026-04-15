import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize Firebase only if we have minimum required config
const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.messagingSenderId;

let app: any;
try {
  if (isConfigValid) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  const isSupported = typeof window !== "undefined" && "serviceWorker" in navigator;
  if (!isSupported || !app) return null;

  try {
    return getMessaging(app);
  } catch (error) {
    console.error("Firebase Messaging not supported in this browser:", error);
    return null;
  }
};

export { app };
