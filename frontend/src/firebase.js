import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Replace these placeholder values with your real Firebase Web App configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4cYIiZaAjutV6unJz5suqk2fltJ4FpMc",
  authDomain: "astro-c832d.firebaseapp.com",
  projectId: "astro-c832d",
  storageBucket: "astro-c832d.firebasestorage.app",
  messagingSenderId: "1010833674502",
  appId: "1:1010833674502:web:7074844cd915a65e774e87",
  measurementId: "G-31W0PK02TM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging = null;

// Messaging is only supported in browsers that support Service Workers and Push API
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.error("Firebase Messaging could not be initialized:", err);
  }
}

export const requestForToken = async () => {
  if (!messaging) return null;

  try {
    const currentToken = await getToken(messaging, {
      // TODO: Replace with your actual VAPID key from Firebase Console -> Project Settings -> Cloud Messaging -> Web Push certificates
      vapidKey: "BH96ot47tCMBq4YhN7PNZLfCqnMQiA9bdUTREqkxh7_gZ4bLDLXXdiAm_ouKr0IGlnN6mC5l3EAV2qrASex9t0o"
    });

    if (currentToken) {
      console.log('FCM Token received:', currentToken);
      // In a real app, you would send this token to your FastAPI backend to store it in MongoDB
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { app, messaging };
