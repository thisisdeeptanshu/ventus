import { initializeApp } from "firebase/app";
import { getAuth } from '@firebase/auth';
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCbZAVLaKq1oiXxz3YGlkxtOh2NaRE0New",
    authDomain: "ventus2-26798.firebaseapp.com",
    projectId: "ventus2-26798",
    storageBucket: "ventus2-26798.appspot.com",
    messagingSenderId: "389687199257",
    appId: "1:389687199257:web:3e09187bddf3b40b5c8c88"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);