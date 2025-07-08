import React, { useState, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'; 
import { getFunctions, httpsCallable } from 'firebase/functions';

import { db, auth } from '../firebase';

const ChatGPTSplitGenerator = ({ user, onSetPage }) => {
  const [generatedSplit, setGeneratedSplit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const functions = getFunctions();
  const generateSplitCallable = httpsCallable(functions, 'generateChatGPTSplit');

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
            setError("Profile data not found. Please complete your profile to generate a split.");
        }
      }
    };
    fetchProfile();
  }, [user]);

  const generateSplit = async () => {
    if (!profileData) {
      setError("Please complete your profile to generate a split.");
      return;
    }

    setLoading(true);
    setGeneratedSplit(null);
    setError(null);

    const payload = {
      goal: profileData.goal,
      frequency: profileData.workoutFrequency,
      gender: profileData.gender,
      currentWeight: profileData.weight,
      workoutDays: 7 
    };

    try {
      const result = await generateSplitCallable(payload);
      let data = result.data;

      console.log("Raw AI response data (from function.data):", data); 

      if (data && typeof data === 'object' && !Array.isArray(data) && data.name && data.dayOfWeek && data.exercises) {
          console.warn("AI returned a single object, wrapping it in an array.");
          data = [data]; // Wrap the single object in an array
      }

      if (Array.isArray(data)) {
          setGeneratedSplit(data);
      } else {
          setError("AI response was not in the expected array format. Please try again or check AI output.");
          console.error("Unexpected AI response format (not array):", data);
      }

    } catch (err) {
      console.error("Error generating split (client-side):", err.code, err.message, err.details);
      setError(`Failed to generate split: ${err.message}. Details: ${JSON.stringify(err.details || "N/A")}. Please try again.`); 
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneratedSplit = async () => {
    if (!generatedSplit || !auth.currentUser) return;

    setIsSaving(true);
    try {
        await addDoc(collection(db, "splits"), {
            userId: auth.currentUser.uid,
            name: `AI Generated Split - ${new Date().toLocaleDateString()}`,
            days: generatedSplit.map(day => ({ 
                name: day.name,
                dayOfWeek: day.dayOfWeek,
                exercises: day.exercises.map(ex => String(ex)) 
            })),
            generatedByAI: true,
            selected: false 
        });
        alert("AI Split saved successfully!");
        onSetPage('split'); 
    } catch (error) {
        console.error("Error saving AI split:", error);
        alert("Failed to save AI split.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!profileData) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'center' }}>
        <h2>Personalized Split Generator</h2>
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'center' }}>
      <h2>Personalized Split Generator</h2>
      <p>Generate a custom workout split based on your profile.</p>
      <button onClick={generateSplit} disabled={loading} style={{ marginTop: '20px' }}>
        {loading ? 'Generating...' : 'Generate New Split'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      {generatedSplit && Array.isArray(generatedSplit) && (
        <div style={{ marginTop: '30px' }}>
          <h3>Generated Split Preview:</h3>
          <div className="split-day-list-container" style={{ textAlign: 'left' }}>
            {generatedSplit.map((day, index) => (
              <div key={index} className="split-day-item">
                <div className="day-number-circle">{index + 1}</div>
                <div className="day-content">
                  <h4>{day.name} ({day.dayOfWeek})</h4>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.9em' }}>
                    {day.exercises.length === 0 ? (
                      <li style={{ color: 'var(--color-highlight-subtle)' }}>Rest Day</li>
                    ) : (
                      day.exercises.map((ex, exIndex) => (
                        <li key={exIndex}>{ex}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSaveGeneratedSplit} disabled={isSaving} style={{ marginTop: '20px' }}>
            {isSaving ? 'Saving...' : 'Save This Split'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatGPTSplitGenerator; 