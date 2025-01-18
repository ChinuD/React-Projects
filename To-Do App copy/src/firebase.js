import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_xo5QOr0xY0PPRNs1E9VhfOsaj-ddLWg",
  authDomain: "todo-app-42253.firebaseapp.com",
  projectId: "todo-app-42253",
  storageBucket: "todo-app-42253.firebasestorage.app",
  messagingSenderId: "404373175179",
  appId: "1:404373175179:web:2061c77bce8cecd5358d8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
