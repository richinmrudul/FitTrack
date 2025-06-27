import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

const RecentWorkouts = () => {
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('date', 'desc'),
      limit(4) // Fetch only the 4 most recent workouts
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedWorkouts = [];
      querySnapshot.forEach((doc) => {
        fetchedWorkouts.push({ id: doc.id, ...doc.data() });
      });
      setRecentWorkouts(fetchedWorkouts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  if (loading) {
    return <p>Loading recent workouts...</p>;
  }

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h3>Recent Workouts</h3>
      {recentWorkouts.length === 0 ? (
        <p>No recent workouts to display.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {recentWorkouts.map(workout => (
            <div key={workout.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b2b2b', padding: '15px', borderRadius: '12px' }}>
              <span>Workout on {new Date(workout.date.toDate()).toLocaleDateString()}</span>
              <span>{workout.exercises.length} exercises</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentWorkouts;