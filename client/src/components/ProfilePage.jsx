import React from 'react';

const ProfilePage = ({ user, onSignOut }) => {
  if (!user) {
    return <div style={{ padding: '20px' }}>Please sign in.</div>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Profile</h2>
      <img 
        src={user.photoURL} 
        alt="Profile" 
        style={{ borderRadius: '50%', width: '100px', height: '100px', marginBottom: '15px' }} 
      />
      <h3>{user.displayName}</h3>
      <p>{user.email}</p>
      <p>User ID: {user.uid}</p>

      <button onClick={onSignOut} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Sign Out
      </button>
    </div>
  );
};
export default ProfilePage;