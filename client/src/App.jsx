import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { auth, db } from './firebase';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import ProfilePage from './components/ProfilePage';
import HistoryPage from './components/HistoryPage';
import RecordsPage from './components/RecordsPage';
import ExercisesPage from './components/ExercisesPage';
import StatisticsPage from './components/StatisticsPage';
import WorkoutSplitPage from './components/WorkoutSplitPage'; // (Keep if used later)
import SplitList from './components/SplitList';
import SplitForm from './components/SplitForm';

import { MdArrowBack } from 'react-icons/md';
import './App.css';

const NavBar = ({ currentPage, onGoBack, onSignOut }) => {
  const showBackButton = currentPage !== 'home';

  return (
    <nav className="top-nav">
      {showBackButton ? (
        <button onClick={onGoBack} className="icon-button">
          <MdArrowBack />
        </button>
      ) : (
        <div style={{ width: '50px' }}></div>
      )}
      <h1 className="app-title">FitTrack</h1>
      <button onClick={onSignOut} className="icon-button">Sign Out</button>
    </nav>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSplit, setSelectedSplit] = useState(null);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch selected split from Firestore
  useEffect(() => {
    const fetchSelectedSplit = async () => {
      if (user) {
        const q = query(
          collection(db, 'splits'),
          where('userId', '==', user.uid),
          where('selected', '==', true)
        );

        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const selected = {
              id: querySnapshot.docs[0].id,
              ...querySnapshot.docs[0].data(),
            };

            // Ensure 'days' field exists and is not empty
            if (selected.days && selected.days.length > 0) {
              setSelectedSplit(selected);
            } else {
              console.warn("Selected split exists but 'days' array is missing or empty:", selected);
              setSelectedSplit(null);
            }
          } else {
            console.log("No split currently selected for this user.");
            setSelectedSplit(null);
          }
        } catch (error) {
          console.error("Error fetching selected split:", error);
          setSelectedSplit(null);
        }
      }
    };

    if (!loading && user) {
      fetchSelectedSplit();
    } else if (!loading && !user) {
      setSelectedSplit(null);
    }
  }, [user, loading]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully!');
      setCurrentPage('home');
    } catch (error) {
      console.error('Error during sign out:', error.message);
    }
  };

  const handleSetPage = (page) => {
    setCurrentPage(page);
  };

  const handleGoBack = () => {
    if (currentPage === 'create-split') {
      setCurrentPage('split');
    } else {
      setCurrentPage('home');
    }
  };

  const handleGoToHistory = () => {
    setCurrentPage('history');
  };

  const handleSelectSplitToEdit = (split) => {
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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard user={user} onSetPage={handleSetPage} />;
      case 'log':
        return (
          <WorkoutLogger
            selectedSplit={selectedSplit}
            onGoToHistory={handleGoToHistory}
          />
        );
      case 'history':
        return <HistoryPage />;
      case 'records':
        return <RecordsPage />;
      case 'exercises':
        return <ExercisesPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'split':
        return (
          <SplitList
            onSetPage={handleSetPage}
            onSelectSplit={handleSelectSplitToEdit}
          />
        );
      case 'create-split':
        return <SplitForm split={selectedSplit} onGoBack={handleGoBack} />;
      case 'profile':
        return <ProfilePage user={user} onSignOut={handleSignOut} />;
      default:
        return <Dashboard user={user} onSetPage={handleSetPage} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <NavBar
          currentPage={currentPage}
          onGoBack={handleGoBack}
          onSignOut={handleSignOut}
        />
      </header>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
