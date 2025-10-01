// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyAHU5GdFQCirzRxy1FXiXfWsgB0sN9cEvY",
  authDomain: "storynest-8facb.firebaseapp.com",
  projectId: "storynest-8facb",
  storageBucket: "storynest-8facb.firebasestorage.app",
  messagingSenderId: "650624901533",
  appId: "1:650624901533:web:6568ca42551c31a32c4f74",
  measurementId: "G-EBYD133YH6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
