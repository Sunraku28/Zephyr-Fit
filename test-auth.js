import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAB1mdheOFoDGRGX4I4tPF_BqrCiIGscEE",
  authDomain: "zephyr-fit.firebaseapp.com",
  projectId: "zephyr-fit",
  storageBucket: "zephyr-fit.firebasestorage.app",
  messagingSenderId: "56763663017",
  appId: "1:56763663017:web:537fd4476f96ae34901fb8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, "test@example.com", "password123")
  .then(() => console.log("Success!"))
  .catch(e => console.error("Error:", e.message));
