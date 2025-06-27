import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import ProfilePage from './components/ProfilePage';
import HistoryPage from './components/HistoryPage';
import RecordsPage from './components/RecordsPage';
import ExercisesPage from './components/ExercisesPage';
import StatisticsPage from './components/StatisticsPage';
import SplitList from './components/SplitList'; // <-- Import the new SplitList
import SplitForm from './components/SplitForm'; // <-- Import the renamed form

import './App.css';

// A simple header with navigation links
const NavBar = ({ onSignOut, currentPage, onGoBack }) => {
    const showBackButton = currentPage !== 'home';
    return (
        <nav style={{ padding: '20px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '900px', boxSizing: 'border-box', backgroundColor: 'var(--color-card-dark)' }}>
            {showBackButton ? (
                <button onClick={onGoBack}>Back</button>
            ) : (
                <div style={{ width: '100px' }}></div>
            )}
            <h1 style={{ margin: '0', fontSize: '24px', color: 'var(--color-text-light)' }}>FitTrack</h1>
            <button onClick={onSignOut}>Sign Out</button>
        </nav>
    );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSplit, setSelectedSplit] = useState(null); // <-- New state for editing

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
    // Go back to the split list if coming from the form
    if (currentPage === 'create-split') {
        setCurrentPage('split');
    } else {
        setCurrentPage('home');
    }
  };

  const handleSelectSplit = (split) => {
      setSelectedSplit(split);
      setCurrentPage('create-split');
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
      case 'split':
        return <SplitList onSetPage={handleSetPage} onSelectSplit={handleSelectSplit} />; // <-- Render the list
      case 'create-split':
        return <SplitForm split={selectedSplit} onGoBack={handleGoBack} />; // <-- Render the form
      case 'profile':
        return <ProfilePage user={user} onSignOut={handleSignOut} />;
      default:
        return <Dashboard user={user} onSetPage={handleSetPage} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header" style={{ width: '100%' }}>
        <NavBar onSignOut={handleSignOut} currentPage={currentPage} onGoBack={handleGoBack} />
      </header>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;