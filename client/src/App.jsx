import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
// Removed BrowserRouter, Routes, Route, Link as we are no longer using react-router-dom for page switching
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import ProfilePage from './components/ProfilePage';
import HistoryPage from './components/HistoryPage';
import RecordsPage from './components/RecordsPage';
import ExercisesPage from './components/ExercisesPage';
import StatisticsPage from './components/StatisticsPage';
import WorkoutSplitPage from './components/WorkoutSplitPage'; // <-- Import the new WorkoutSplitPage

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully!");
      setCurrentPage('home');
    } catch (error) {
      console.error("Error during sign out:", error.message);
    }
  };

  const handleSetPage = (page) => {
    setCurrentPage(page);
  };

  const handleGoBack = () => {
    setCurrentPage('home');
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }

  // Conditionally render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard user={user} onSetPage={handleSetPage} />;
      case 'log':
        return <WorkoutForm />;
      case 'history':
        return <HistoryPage />;
      case 'records':
        return <RecordsPage />;
      case 'exercises':
        return <ExercisesPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'split': // <-- New case for Workout Split page
        return <WorkoutSplitPage />;
      case 'profile':
        return <ProfilePage user={user} onSignOut={handleSignOut} />;
      default:
        return <Dashboard user={user} onSetPage={handleSetPage} />;
    }
  };

  const showBackButton = currentPage !== 'home';

  return (
    <div className="App">
      <header className="App-header" style={{ width: '100%' }}>
        <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '900px', boxSizing: 'border-box' }}>
          {showBackButton ? (
              <button onClick={handleGoBack}>Back</button>
          ) : (
              <div style={{ width: '100px' }}></div> // Spacer for alignment
          )}
          <h1 style={{ margin: '0', fontSize: '24px' }}>FitTrack</h1>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </header>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;