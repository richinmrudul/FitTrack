import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    // Create a Firestore query to get workouts for the current user, ordered by date
    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('date', 'desc')
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedWorkouts = [];
      querySnapshot.forEach((doc) => {
        fetchedWorkouts.push({ id: doc.id, ...doc.data() });
      });
      setWorkouts(fetchedWorkouts);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching workouts:", err);
      setError("Failed to load workout history.");
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once

  if (loading) {
    return <p>Loading workout history...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ marginTop: '40px', width: '100%' }}>
      <h3>Workout History</h3>
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