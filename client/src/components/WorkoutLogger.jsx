import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MdClose, MdDelete } from 'react-icons/md';
import WorkoutSummaryModal from './WorkoutSummaryModal';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WorkoutLogger = ({ selectedSplit, onGoToHistory }) => {
  const [currentWorkout, setCurrentWorkout] = useState({
    exercises: []
  });
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[new Date().getDay()]); 
  const [currentDayData, setCurrentDayData] = useState(null);

  // Get the exercises for the selected day from the split
  useEffect(() => {
    if (selectedSplit && selectedSplit.days) {
        const dayData = selectedSplit.days.find(day => day.dayOfWeek === selectedDay);

        if (dayData) {
            setCurrentDayData(dayData);
            const initialExercises = dayData.exercises.map(name => ({
                name: name,
                sets: [{ reps: '', weight: '', completed: false }]
            }));
            setCurrentWorkout({ exercises: initialExercises });
        } else {
            setCurrentDayData(null);
            setCurrentWorkout({ exercises: [] });
        }
    }
  }, [selectedSplit, selectedDay]); 

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (!timerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!selectedSplit) {
    return <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}><h2>Log a Workout</h2><p>Please select a split from the splits page to log a workout.</p></div>;
  }

  const handleAddSet = (exerciseIndex) => {
      const lastSet = currentWorkout.exercises[exerciseIndex].sets.slice(-1)[0];
      if (lastSet && (!lastSet.reps || !lastSet.weight)) {
          alert("Please fill out the last set before adding a new one.");
          return;
      }

      const newSet = { reps: '', weight: '', completed: false };
      const updatedExercises = [...currentWorkout.exercises];
      updatedExercises[exerciseIndex].sets.push(newSet);
      setCurrentWorkout(prev => ({ ...prev, exercises: updatedExercises }));

      setSeconds(3 * 60);
      setTimerRunning(true);
      setShowRestTimer(true);
  };

  const handleUpdateSet = (exerciseIndex, setIndex, field, value) => {
      const updatedExercises = [...currentWorkout.exercises];
      updatedExercises[exerciseIndex].sets[setIndex][field] = value;
      setCurrentWorkout(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this set?");
      if (confirmDelete) {
          const updatedExercises = [...currentWorkout.exercises];
          updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
          setCurrentWorkout(prev => ({ ...prev, exercises: updatedExercises }));
      }
  };

  const handleAddExercise = () => {
    const newExercise = { name: "New Exercise", sets: [] };
    setCurrentWorkout(prev => ({ ...prev, exercises: [...prev.exercises, newExercise] }));
  };

  const handleSaveWorkout = async () => {
    if (!auth.currentUser) return;

    const finishedExercises = currentWorkout.exercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets.filter(set => set.reps || set.weight),
    })).filter(exercise => exercise.sets.length > 0);

    if (finishedExercises.length === 0) {
        alert("Please log at least one set to finish the workout.");
        return;
    }

    try {
        await addDoc(collection(db, "workouts"), {
            userId: auth.currentUser.uid,
            date: serverTimestamp(),
            exercises: finishedExercises,
        });
        setShowFinishModal(true);
    } catch (e) {
        console.error("Error finishing workout:", e);
        alert("Failed to save workout. Check console.");
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Workout Logger</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{selectedSplit.name}</h3>
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{ width: '150px' }}>
              {selectedSplit.days.map((day, index) => (
                  <option key={index} value={day.dayOfWeek}>{day.name} ({day.dayOfWeek})</option>
              ))}
          </select>
      </div>

      {!currentDayData && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>No workout is scheduled for {selectedDay}.</p>
              <p>Please select another day or check your split.</p>
          </div>
      )}

      {showRestTimer && (
          <div className="rest-timer-modal">
              <div className="rest-timer-modal-content">
                  <button onClick={() => { setTimerRunning(false); setShowRestTimer(false); }} className="icon-button close-button"><MdClose /></button>
                  <p>Rest Timer</p>
                  <div className="rest-timer-countdown">
                      {formatTime(seconds)}
                  </div>
              </div>
          </div>
      )}

      {currentDayData && currentWorkout.exercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex} className="card" style={{ marginTop: '20px' }}>
          <h4>{exercise.name}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#2b2b2b', padding: '10px', borderRadius: '8px' }}>
                <input type="checkbox" checked={set.completed} onChange={() => handleToggleSetComplete(exerciseIndex, setIndex)} />
                <input type="number" placeholder="Weight (lbs)" value={set.weight} onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'weight', e.target.value)} style={{ flex: 1 }} />
                <input type="number" placeholder="Reps" value={set.reps} onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'reps', e.target.value)} style={{ flex: 1 }} />
                <button onClick={() => handleRemoveSet(exerciseIndex, setIndex)} className="icon-button delete-button"><MdDelete /></button>
              </div>
            ))}
            <button onClick={() => handleAddSet(exerciseIndex)} style={{ border: '1px dashed var(--color-highlight-subtle)' }}>Add Set</button>
          </div>
        </div>
      ))}
      <button onClick={handleAddExercise}>Add Exercise</button>
      <button onClick={handleSaveWorkout}>Finish Workout</button>

      <WorkoutSummaryModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        workout={currentWorkout}
        onFinish={() => { setShowFinishModal(false); onGoToHistory(); }}
      />
    </div>
  );
};

export default WorkoutLogger;