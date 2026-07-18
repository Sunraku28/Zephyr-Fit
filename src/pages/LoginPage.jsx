import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import BioCore from '../components/BioCore';

export default function LoginPage({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const validE = email.includes('@');
  const validP = password.length >= 6;
  const ready = validE && validP && !loading;

  const handleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const usernameDisplay = userCredential.user.email.split('@')[0];
        onSubmit(usernameDisplay, null, userCredential.user.uid);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        const usernameDisplay = userCredential.user.email.split('@')[0];
        
        let existingData = null;
        try {
          const docRef = doc(db, "users", userCredential.user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().schedule) {
            existingData = docSnap.data();
          }
        } catch (dbError) {
          console.warn("Could not fetch from Firestore, proceeding without saved data:", dbError);
        }
        
        onSubmit(usernameDisplay, existingData, userCredential.user.uid);
      }
    } catch (error) {
      setErrorMsg(error.message.replace('Firebase: ', ''));
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
          {loading ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Start Your Journey')}
        </button>
        <p className="text-center text-xs text-text-dim mt-4">
          {isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }} className="text-accent-base font-bold hover:underline transition-colors">
            {isRegister ? 'Log in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}