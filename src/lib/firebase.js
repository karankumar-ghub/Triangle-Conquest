import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxehsr6mPBnUJ5sMHCpv9zBmmxUwWNWkU",
    authDomain: "triangleconquest.firebaseapp.com",
    projectId: "triangleconquest",
    storageBucket: "triangleconquest.firebasestorage.app",
    messagingSenderId: "989751740628",
    appId: "1:989751740628:web:3acb3f477153e963b59341",
    measurementId: "G-RT6M259ZE5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);