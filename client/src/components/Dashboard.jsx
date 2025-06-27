import React from 'react';

// The Dashboard component no longer renders the form and charts directly.
// They are now rendered on their own dedicated pages.
const Dashboard = ({ user }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Welcome, {user.displayName || 'FitTrack User'}!</h2>
      <p>You are signed in.</p>
      {/* We will add a "Recents" section here later, just like the mockups */}
    </div>
  );
};

export default Dashboard;