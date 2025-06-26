import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // <-- ADD signOut here
import { auth } from './firebase'; // Import the auth instance
import Login from './components/Login';

// ... imports at the top

// Updated Dashboard component with a sign-out button
const Dashboard = ({ onSignOut }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Welcome to your FitTrack Dashboard!</h2>
      <p>You are signed in.</p>
      <button onClick={onSignOut} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Sign Out
      </button>
    </div>
  );
};

// ... rest of the App component code below

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully!");
    } catch (error) {
      console.error("Error during sign out:", error.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        {user ? <Dashboard onSignOut={handleSignOut} /> : <Login />}
      </header>
    </div>
  );
}

export default App;