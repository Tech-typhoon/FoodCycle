 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXVDMlxC6IttbArwGkYPPINyYqjQHX1-0",
  authDomain: "foodcycle-7bcd5.firebaseapp.com",
  projectId: "foodcycle-7bcd5",
  storageBucket: "foodcycle-7bcd5.firebasestorage.app",
  messagingSenderId: "691967883371",
  appId: "1:691967883371:web:9f71d68b740c7295a4592e",
  
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();