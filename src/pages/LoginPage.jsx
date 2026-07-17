import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import BioCore from '../components/BioCore';

// Firebase Setup encapsulated directly inside Login
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

export default function LoginPage({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validE = email.includes('@');
  const validP = password.length >= 6;
  const ready = validE && validP && !loading;

  const handleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const usernameDisplay = userCredential.user.email.split('@')[0];
      onSubmit(usernameDisplay);
    } catch (error) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const usernameDisplay = userCredential.user.email.split('@')[0];
          onSubmit(usernameDisplay);
        } catch (regError) {
          setErrorMsg(regError.message);
        }
      } else {
        setErrorMsg(error.message.replace('Firebase: ', ''));
      }
    }
    setLoading(false);
  };

  return (
    <div className="screen">
      <div className="glass w-full max-w-[420px] pt-10 px-[34px] pb-[34px]">
        <BioCore size={92} />
        <h1 className="brand-title">Zephyr</h1>
        <p className="brand-sub">Fit AI</p>

        <div className="field">
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={(validE ? 'valid ' : '') + (email ? 'has-val' : '')}
          />
          <label htmlFor="email">Email Address</label>
          <span className="check">&#10003;</span>
        </div>

        <div className="field">
          <input
            id="pw"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={(validP ? 'valid ' : '') + (password ? 'has-val' : '')}
          />
          <label htmlFor="pw">Password</label>
          <span className="check">&#10003;</span>
        </div>

        {errorMsg && (
          <p className="text-red text-[13px] text-center mb-4">
            &#9888; {errorMsg}
          </p>
        )}

        <button className="cta-button" disabled={!ready} onClick={handleAuth}>
          {loading ? 'Authenticating...' : 'Start Your Journey'}
        </button>
        <p className="text-center text-xs text-text-dimmer mt-3.5">Valid email required · Password 6+ chars</p>
      </div>
    </div>
  );
}