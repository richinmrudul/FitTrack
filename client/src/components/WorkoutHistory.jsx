import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MdDelete } from 'react-icons/md';

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
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

    return () => unsubscribe();
  }, []);

  const handleDeleteWorkout = async (workoutId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this workout?");
      if (confirmDelete) {
          try {
              await deleteDoc(doc(db, "workouts", workoutId));
              alert("Workout deleted successfully!");
          } catch (e) {
              console.error("Error deleting workout:", e);
              alert("Failed to delete workout.");
          }
      }
  };

  if (loading) {
    return <p>Loading workout history...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h3>Workout History</h3>
      {workouts.length === 0 ? (
        <p>No workouts logged yet. Log your first workout!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {workouts.map((workout) => (
            <div key={workout.id} className="card" style={{ border: '1px solid var(--color-border-subtle)', padding: '15px', borderRadius: '8px', textAlign: 'left', position: 'relative' }}>
              <h4>Workout on {new Date(workout.date.toDate()).toLocaleDateString()}</h4>

              {/* Delete button */}
              <button onClick={() => handleDeleteWorkout(workout.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--color-secondary-red)', fontSize: '24px', cursor: 'pointer' }}>
                  <MdDelete />
              </button>

              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {workout.exercises.map((ex, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    - {ex.name}: {ex.sets?.length || 0} sets
                    <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
                      {ex.sets?.map((set, setIndex) => (
                        <li key={setIndex}>
                            Weight: {set.weight} lbs, Reps: {set.reps}
                        </li>
                      ))}
                    </ul>
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