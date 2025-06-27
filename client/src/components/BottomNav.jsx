import React from 'react';
import { Link } from 'react-router-dom';

const BottomNav = () => {
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    flex: 1,
    textAlign: 'center',
    padding: '15px 0',
    fontSize: '14px'
  };

  return (
    <nav style={{ 
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      backgroundColor: '#1c1c1c', // Dark background for the nav bar
      borderTop: '1px solid #333',
      zIndex: 1000 // Ensure it's on top
    }}>
      <Link to="/" style={linkStyle}>
        Home
      </Link>
      <Link to="/history" style={linkStyle}>
        History
      </Link>
      <Link to="/log" style={linkStyle}>
        Log
      </Link>
      <Link to="/profile" style={linkStyle}>
        Profile
      </Link>
    </nav>
  );
};

export default BottomNav;