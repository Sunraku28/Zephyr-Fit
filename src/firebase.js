import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAB1mdheOFoDGRGX4I4tPF_BqrCiIGscEE",
  authDomain: "zephyr-fit.firebaseapp.com",
  projectId: "zephyr-fit",
  storageBucket: "zephyr-fit.firebasestorage.app",
  messagingSenderId: "56763663017",
  appId: "1:56763663017:web:537fd4476f96ae34901fb8"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
