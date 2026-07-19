import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAdc5QKJF4L12XvFstRL6gBeo6NnvSiGk",
  authDomain: "zephyr-fit.firebaseapp.com",
  projectId: "zephyr-fit",
  storageBucket: "zephyr-fit.firebasestorage.app",
  messagingSenderId: "56763663017",
  appId: "1:56763663017:web:537fd4476f96ae34901fb8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
