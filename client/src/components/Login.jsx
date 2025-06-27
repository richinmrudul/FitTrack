import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { MdFitnessCenter } from 'react-icons/md'; // Import an icon

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh', // Take up most of the viewport height
      textAlign: 'center',
      padding: '20px',
    }}>
      <MdFitnessCenter style={{ fontSize: '80px', color: 'var(--color-primary-neon)', marginBottom: '20px' }} />
      <h1 style={{ fontSize: '3rem', color: 'var(--color-text-light)', marginBottom: '10px' }}>FitTrack</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--color-highlight-subtle)', marginBottom: '30px' }}>Your ultimate workout companion.</p>
      <button onClick={signInWithGoogle} style={{
        padding: '15px 30px',
        fontSize: '18px',
        borderRadius: '50px', // More rounded button
        backgroundColor: 'var(--color-primary-neon)',
        color: 'var(--color-background-dark)',
        border: 'none',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
      }}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;