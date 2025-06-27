import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase'; // Ensure 'db' is also imported
import Login from './components/Login';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';
import ProgressCharts from './components/ProgressCharts'; // <-- Add this import

// Updated Dashboard component with a sign-out button, WorkoutForm, WorkoutHistory, and ProgressCharts
const Dashboard = ({ onSignOut }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Welcome to your FitTrack Dashboard!</h2>
      <p>You are signed in.</p>
      <button onClick={onSignOut} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Sign Out
      </button>
      <WorkoutForm />
      <WorkoutHistory />
      <ProgressCharts /> {/* <-- Add the ProgressCharts component here */}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up the subscription on unmount
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
      {/* The App-header class from App.css will handle centering for its content */}
      <header className="App-header">
        {user ? <Dashboard onSignOut={handleSignOut} /> : <Login />}
      </header>
    </div>
  );
}

export default App;