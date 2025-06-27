import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const WorkoutForm = () => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [exercisesList, setExercisesList] = useState([]); // State to hold exercises for the current workout

  const handleAddExercise = (e) => {
    e.preventDefault();
    // Validate inputs before adding
    if (!exercise || !sets || !reps || !weight) {
      alert("Please fill in all exercise fields.");
      return;
    }

    const newExercise = {
      name: exercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight)
    };

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
        exercises: exercisesList,
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
    <div className="card" style={{ maxWidth: '400px', margin: '20px auto' }}> {/* Apply card class and center */}
      <h2>Log Your Workout</h2>
      <form onSubmit={handleAddExercise} className="form-layout"> {/* Apply a flex layout class */}
        <div className="form-group">
          <label htmlFor="workout-date">Date:</label>
          <input 
            id="workout-date"
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="exercise-name">Exercise Name:</label>
          <input
            id="exercise-name"
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g., Bench Press"
            required
          />
        </div>
        
        <div className="form-row"> {/* Use a flex row for sets, reps, weight */}
          <div className="form-group-inline">
            <label htmlFor="sets">Sets:</label>
            <input
              id="sets"
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </div>
          <div className="form-group-inline">
            <label htmlFor="reps">Reps:</label>
            <input
              id="reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
          <div className="form-group-inline">
            <label htmlFor="weight">Weight (kg):</label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.5"
            />
          </div>
        </div>
        
        <button type="submit">Add Exercise</button>
      </form>

      {/* Display the list of added exercises */}
      {exercisesList.length > 0 && (
        <div className="card" style={{ marginTop: '20px' }}> {/* Reuse card style */}
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

      <button onClick={handleSaveWorkout} style={{ marginTop: '20px' }}>
        Save Workout
      </button>
    </div>
  );
};

export default WorkoutForm;