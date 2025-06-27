import React from 'react';
import { NavLink } from 'react-router-dom'; // <-- Use NavLink

const BottomNav = () => {
  // isActive is provided by NavLink to apply a style to the active link
  const activeStyle = ({ isActive }) => ({
    color: isActive ? 'var(--color-highlight-neon)' : 'var(--color-text-light)',
  });

  return (
    <nav className="bottom-nav">
      <NavLink to="/" style={activeStyle}>
        Home
      </NavLink>
      <NavLink to="/history" style={activeStyle}>
        History
      </NavLink>
      <NavLink to="/log" style={activeStyle}>
        Log
      </NavLink>
      <NavLink to="/profile" style={activeStyle}>
        Profile
      </NavLink>
    </nav>
  );
};

export default BottomNav;