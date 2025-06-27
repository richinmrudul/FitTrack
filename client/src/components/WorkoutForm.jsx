import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const WorkoutForm = () => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [exercisesList, setExercisesList] = useState([]); // <-- New state to hold exercises

  const handleAddExercise = (e) => {
    e.preventDefault();
    // Create a new exercise object from the form state
    const newExercise = {
      name: exercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight)
    };

    // Add the new exercise to the list
    setExercisesList([...exercisesList, newExercise]);

    // Clear form fields for the next exercise
    setExercise('');
    setSets('');
    setReps('');
    setWeight('');

    console.log("Exercise added to list:", newExercise);
  };

  const handleSaveWorkout = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to save a workout!");
      return;
    }

    if (exercisesList.length === 0) {
      alert("Please add at least one exercise to save the workout.");
      return;
    }

    try {
      // Save the entire list of exercises to Firestore
      const docRef = await addDoc(collection(db, "workouts"), {
        userId: auth.currentUser.uid,
        date: new Date(workoutDate),
        exercises: exercisesList, // <-- Save the list
      });

      console.log("Workout saved with ID: ", docRef.id);
      alert("Workout saved successfully!");

      // Reset the form and the exercise list
      setExercisesList([]);
      setWorkoutDate(new Date().toISOString().split('T')[0]);

    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save workout. Check console for details.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Log Your Workout</h2>
      <form onSubmit={handleAddExercise} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>
          Date:
          <input 
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
        <label>
          Exercise Name:
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g., Bench Press"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <label style={{ flex: 1 }}>
            Sets:
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Reps:
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Weight (kg):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.5"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>Add Exercise</button>
      </form>

      {/* Display the list of added exercises */}
      {exercisesList.length > 0 && (
        <div style={{ marginTop: '20px', border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
          <h3>Exercises Added:</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {exercisesList.map((ex, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {ex.name} - {ex.sets} sets, {ex.reps} reps, {ex.weight} kg
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSaveWorkout} style={{ marginTop: '20px', padding: '12px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>
        Save Workout
      </button>
    </div>
  );
};

export default WorkoutForm;