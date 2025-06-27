import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed in successfully!");
    } catch (error) {
      console.error("Error during sign in:", error.message);
    }
  };

  return (
    <div>
      <h2>Sign in to FitTrack</h2>
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;