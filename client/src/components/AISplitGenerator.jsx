import React, { useState, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { db, auth } from '../firebase'; // Import db and auth

const AISplitGenerator = ({ user, onSetPage }) => {
  const [generatedSplit, setGeneratedSplit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
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

    // Your deployed Firebase Function URL
    const FUNCTION_URL = "https://generateworkoutsplit-xyxgaybga-uc.a.run.app"; // <-- REPLACE WITH YOUR ACTUAL FUNCTION URL

    const payload = {
      goal: profileData.goal,
      frequency: profileData.workoutFrequency,
      gender: profileData.gender,
      currentWeight: profileData.weight,
      workoutDays: 7 // Always generate a 7-day split for now
    };

    try {
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedSplit(data);
    } catch (err) {
      console.error("Error generating split:", err);
      setError(`Failed to generate split: ${err.message}. Please try again.`);
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
            days: generatedSplit.map(day => ({ // Ensure exercises are saved as strings
                name: day.name,
                dayOfWeek: day.dayOfWeek,
                exercises: day.exercises.map(ex => String(ex)) // Ensure exercises are strings
            })),
            generatedByAI: true,
            selected: false // Don't auto-select
        });
        alert("AI Split saved successfully!");
        onSetPage('split'); // Go to split list after saving
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
        <h2>AI Split Generator</h2>
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'center' }}>
      <h2>AI Personalized Split Generator</h2>
      <p>Generate a custom workout split based on your profile.</p>
      <button onClick={generateSplit} disabled={loading} style={{ marginTop: '20px' }}>
        {loading ? 'Generating...' : 'Generate New Split'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      {generatedSplit && (
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

export default AISplitGenerator;