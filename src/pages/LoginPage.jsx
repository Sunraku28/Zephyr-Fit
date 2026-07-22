import { useState } from 'react';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from '../firebase';


import BioCore from '../components/BioCore';

export default function LoginPage({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const validE = email.includes('@');
  const validP = password.length >= 6;
  const validName = firstName.trim().length > 0 && lastName.trim().length > 0 && country.trim().length > 0;

  const ready = isRegister
    ? validE && validP && validName && !loading
    : validE && validP && !loading;

  const checkOnboardingStatus = async (user) => {
    let profilePic = user?.photoURL || 'default.png';
    let fullName = user?.displayName || (email ? email.split('@')[0] : 'User');
    let firstNameVal = firstName || (fullName ? fullName.split(' ')[0] : 'User');
    let lastNameVal = lastName || (fullName && fullName.includes(' ') ? fullName.split(' ').slice(1).join(' ') : '');

    try {
      // Add a timeout to getDoc in case Firestore hangs indefinitely
      const userRef = doc(db, 'users', user.uid);

      const docPromise = getDoc(userRef);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), 5000));

      const userSnap = await Promise.race([docPromise, timeoutPromise]);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.onboardingComplete && data.payload?.schedule) {
          onSubmit({
            needsOnboarding: false,
            payload: data.payload
          });
          return;
        }
      }
    } catch (err) {
      console.warn("Firestore check failed or timed out, falling back to local files:", err);
    }

    // Note: Local file API fallback was removed per user request.

    // Check local storage fallback
    const localFallbackStr = localStorage.getItem(`zephyr_onboarding_${user.uid}`);
    if (localFallbackStr) {
      try {
        const localData = JSON.parse(localFallbackStr);
        if (localData.onboardingComplete && localData.payload?.schedule) {
          onSubmit({
            needsOnboarding: false,
            payload: localData.payload
          });
          return;
        }
      } catch (e) {
        console.error("Failed to parse local data", e);
      }
    }

    // If we reach here, no existing onboarding data was found.
    // Whether they clicked "Log In" or "Register", since they successfully authenticated
    // with Firebase, we just send them to the onboarding flow to build their profile!
    onSubmit({
      needsOnboarding: true,
      payload: {
        account: {
          username: fullName,
          firstName: firstNameVal,
          lastName: lastNameVal,
          country: country.trim(),
          profilePic: profilePic,
          profileFrame: 'none',
          uid: user.uid
        },
        stats: { age: 21, weightKg: 75, diet: null },
        activityRank: null,
        bodyConstraints: []
      }
    });
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`.trim()
          });
        } catch (e) {
          console.warn("Profile update failed", e);
        }
        await checkOnboardingStatus(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await checkOnboardingStatus(userCredential.user);
      }
    } catch (error) {
      console.error(error);
      let userFriendlyMsg = "Authentication failed. Please try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        userFriendlyMsg = "Invalid email or password.";
      } else if (error.code === 'auth/email-already-in-use') {
        userFriendlyMsg = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        userFriendlyMsg = "Password should be at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        userFriendlyMsg = "Invalid email address format.";
      } else if (error.message) {
        userFriendlyMsg = error.message.replace('Firebase: ', '');
      }
      setErrorMsg(userFriendlyMsg);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await checkOnboardingStatus(userCredential.user);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message.replace('Firebase: ', ''));
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <div className="glass w-full max-w-[420px] pt-10 px-[34px] pb-[34px] flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center">
          <BioCore size={92} />
          <h1 className="brand-title mt-2">Zephyr</h1>
          <p className="brand-sub">Fit AI</p>
        </div>

        {isRegister && (
          <div className="flex gap-2 w-full">
            <div className="field flex-1">
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={(firstName ? 'has-val' : '')}
              />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="field flex-1">
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={(lastName ? 'has-val' : '')}
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>
        )}
        {isRegister && (
          <div className="field">
            <input
              id="country"
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              className={(country ? 'has-val' : '')}
            />
            <label htmlFor="country">Country</label>
          </div>
        )}

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
          <p className="text-red-500 text-[13px] text-center">
            &#9888; {errorMsg}
          </p>
        )}

        <button className="cta-button w-full" disabled={!ready} onClick={handleEmailAuth}>
          {loading ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Sign In')}
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-xs text-text-dim uppercase tracking-wider">or</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <button
          className="bg-[var(--glass-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--glass-border)] text-[var(--color-text)] rounded-lg py-3 px-4 font-semibold transition-colors flex items-center justify-center gap-3"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-text-dim mt-2">
          {isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }} className="text-accent-base font-bold hover:underline transition-colors">
            {isRegister ? 'Log in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}