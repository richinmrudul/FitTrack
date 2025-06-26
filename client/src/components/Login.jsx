import React from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // <-- Add signOut
import { auth } from '../firebase';

const Login = ({ onSignOut }) => { // <-- Accept a prop for sign out
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed in successfully!");
    } catch (error) {
      console.error("Error during sign in:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully!");
      if (onSignOut) onSignOut(); // Optional callback
    } catch (error) {
      console.error("Error during sign out:", error.message);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Sign in to FitTrack</h2>
      <button onClick={signInWithGoogle} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;