import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';

// Import the new page components from their files
import HistoryPage from './components/HistoryPage'; // <-- Import from file
import LogPage from './components/LogPage';         // <-- Import from file
import ProfilePage from './components/ProfilePage'; // <-- Import from file

import './App.css'; 

// A simple header with navigation links (we'll replace this with a better UI later)
const NavBar = ({ onSignOut }) => {
    return (
        <nav style={{ padding: '20px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>FitTrack</Link>
            <div>
                <button onClick={onSignOut} style={{ padding: '8px 15px', fontSize: '14px', cursor: 'pointer' }}>
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

// Remove these placeholder component definitions as they are now in separate files
// const HistoryPage = () => <div>History Page Content</div>;
// const ProfilePage = () => <div>Profile Page Content</div>;
// const LogPage = () => <div>Log Page Content</div>;


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error during sign out:", error.message);
    }
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="App">
        <header className="App-header">
          <Login />
        </header>
      </div>
    );
  }

  // If the user is logged in, show the router and protected routes
  return (
    <Router>
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavBar onSignOut={handleSignOut} />
            <main style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '70px', width: '100%' }}>
                <Routes>
                    {/* Pass the user prop to the Dashboard and other pages */}
                    <Route path="/" element={<Dashboard user={user} />} /> 
                    <Route path="/history" element={<HistoryPage user={user} />} />
                    <Route path="/log" element={<LogPage user={user} />} />
                    <Route path="/profile" element={<ProfilePage user={user} onSignOut={handleSignOut} />} />
                </Routes>
            </main>
            <BottomNav />
        </div>
    </Router>
  );
}

export default App;