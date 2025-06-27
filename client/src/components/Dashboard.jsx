import React from 'react';
import QuickActions from './QuickActions';

const Dashboard = ({ user, onSetPage }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Good morning, {user.displayName}!</h2>
      <p>You are signed in.</p>
      <QuickActions onSetPage={onSetPage} />
    </div>
  );
};
export default Dashboard;