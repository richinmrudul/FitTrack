import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProfilePage = ({ user, onSignOut }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  // Helper function to convert cm to ft/in
  const convertCmToFtIn = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet} ft ${inches} in`;
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profileData) {
    return <p>Profile data not found.</p>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Profile</h2>
      <img 
        src={user.photoURL} 
        alt="Profile" 
        style={{ borderRadius: '50%', width: '100px', height: '100px', marginBottom: '15px' }} 
      />
      <h3>{profileData.name}</h3>
      <p>{profileData.email}</p>
      <p>User ID: {profileData.userId}</p>

      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '30px auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Height:</strong> {convertCmToFtIn(profileData.height)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Weight:</strong> {profileData.weight} lbs
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Age:</strong> {profileData.age}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Gender:</strong> {profileData.gender}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Frequency:</strong> {profileData.workoutFrequency} times/week
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Goal:</strong> {profileData.goal}
          </div>
      </div>

      <button onClick={onSignOut} style={{ marginTop: '20px' }}>
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;