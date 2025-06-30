import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDoc, getDocs, setDoc, doc } from 'firebase/firestore'; 

import { auth, db } from './firebase';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import ProfilePage from './components/ProfilePage';
import HistoryPage from './components/HistoryPage';
import RecordsPage from './components/RecordsPage';
import ExercisesPage from './components/ExercisesPage';
import StatisticsPage from './components/StatisticsPage';
import WorkoutSplitPage from './components/WorkoutSplitPage'; 
import SplitList from './components/SplitList';
import SplitForm from './components/SplitForm';
import AISplitGenerator from './components/AISplitGenerator'; 

import { MdArrowBack } from 'react-icons/md';
import './App.css';

// NavBar component
const NavBar = ({ currentPage, onGoBack }) => {
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
      <div style={{ width: '50px' }}></div>
    </nav>
  );
};

// Onboarding Form component 
const OnboardingForm = ({ user, onFinishOnboarding }) => {
    const [heightFt, setHeightFt] = useState(''); 
    const [heightIn, setHeightIn] = useState(''); 
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [frequency, setFrequency] = useState('3');
    const [goal, setGoal] = useState('lose-fat');
    const [loading, setLoading] = useState(false);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        const totalInches = (parseInt(heightFt) * 12) + parseInt(heightIn);
        const heightInCm = totalInches * 2.54;

        try {
            await setDoc(doc(db, "users", user.uid), {
                userId: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                height: parseFloat(heightInCm.toFixed(2)),
                weight: parseFloat(weight),
                age: parseInt(age),
                gender: gender,
                workoutFrequency: parseInt(frequency),
                goal: goal,
                onboarded: true,
            });
            onFinishOnboarding();
        } catch (error) {
            console.error("Error saving profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h2>Welcome to FitTrack!</h2>
            <p>Please tell us a little about yourself to get started.</p>
            <form onSubmit={handleSaveProfile} className="form-layout" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <label>
                    Height:
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="feet" required style={{ flex: 1 }} />
                        <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="inches" required style={{ flex: 1 }} />
                    </div>
                </label>
                <label>
                    Weight (lbs):
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                </label>
                <label>
                    Age:
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                </label>
                <label>
                    Gender:
                    <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </label>
                <label>
                    Workout Frequency (per week):
                    <input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} required />
                </label>
                <label>
                    Goal:
                    <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
                        <option value="lose-fat">Lose Fat</option>
                        <option value="build-muscle">Build Muscle</option>
                        <option value="maintain">Maintain</option>
                    </select>
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Get Started'}</button>
            </form>
        </div>
    );
};


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
      const checkOnboardingStatus = async () => {
          if (user) {
              const userDocRef = doc(db, "users", user.uid);
              const userDocSnap = await getDoc(userDocRef);
              if (userDocSnap.exists()) {
                  setIsOnboarded(userDocSnap.data().onboarded);
              } else {
                  setIsOnboarded(false);
              }
          }
      };
      if (!loading && user) {
        checkOnboardingStatus();
      } else if (!loading && !user) {
        setIsOnboarded(false);
      }
  }, [user, loading]);

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

    if (!loading && user && isOnboarded) {
        fetchSelectedSplit();
    } else if (!loading && !user) {
        setSelectedSplit(null);
    }
  }, [user, loading, isOnboarded]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully!');
      setCurrentPage('home');
      setIsOnboarded(false);
      setSelectedSplit(null);
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
    return (
        <div className="App">
            <h1 className="app-title">FitTrack</h1>
            <p>Loading app...</p>
        </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }

  if (!isOnboarded) {
      return (
          <div className="App">
              <OnboardingForm user={user} onFinishOnboarding={() => setIsOnboarded(true)} />
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
      case 'ai-split': // <-- ADDED THIS CASE
        return <AISplitGenerator user={user} onSetPage={handleSetPage} />; // <-- RENDER THE COMPONENT
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