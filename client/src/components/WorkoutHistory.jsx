import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [personalRecords, setPersonalRecords] = useState({}); // <-- New state for PRs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('date', 'desc')
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedWorkouts = [];
      const prs = {}; // Local object to calculate PRs

      querySnapshot.forEach((doc) => {
        const workoutData = { id: doc.id, ...doc.data() };
        fetchedWorkouts.push(workoutData);

        // Calculate PRs from the fetched data
        if (workoutData.exercises) {
          workoutData.exercises.forEach(ex => {
            const weight = parseFloat(ex.weight);
            const name = ex.name.toLowerCase();
            if (!isNaN(weight)) {
              if (!prs[name] || weight > prs[name].weight) {
                prs[name] = { weight, date: workoutData.date.toDate() };
              }
            }
          });
        }
      });

      setWorkouts(fetchedWorkouts);
      setPersonalRecords(prs); // <-- Update the PR state
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching workouts:", err);
      setError("Failed to load workout history.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading workout history...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // Format PRs for display
  const prEntries = Object.entries(personalRecords);

  return (
    <div style={{ marginTop: '40px', width: '100%' }}>
      <h3>Personal Records (PRs)</h3>
      {prEntries.length === 0 ? (
        <p>Log a workout to see your PRs!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', textAlign: 'left' }}>
          {prEntries.map(([name, pr]) => (
            <div key={name} style={{ border: '1px solid gold', padding: '15px', borderRadius: '8px', backgroundColor: '#333' }}>
              <h4>{name.toUpperCase()}</h4>
              <p><strong>Max Weight:</strong> {pr.weight} kg</p>
              <p><strong>Date:</strong> {pr.date.toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: '40px' }}>Workout History</h3>
      {workouts.length === 0 ? (
        <p>No workouts logged yet. Log your first workout!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {workouts.map((workout) => (
            <div key={workout.id} style={{ border: '1px solid gray', padding: '15px', borderRadius: '8px', textAlign: 'left' }}>
              <h4>Workout on {new Date(workout.date.toDate()).toLocaleDateString()}</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {workout.exercises.map((ex, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    - {ex.name}: {ex.sets} sets x {ex.reps} reps @ {ex.weight} kg
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;