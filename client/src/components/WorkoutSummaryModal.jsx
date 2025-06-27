import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

const WorkoutSummaryModal = ({ isOpen, onClose, workout, onFinish }) => {
  const [summary, setSummary] = useState({ totalSets: 0, totalReps: 0, totalWeight: 0, totalExercises: 0 });

  useEffect(() => {
    if (workout) {
      let totalSets = 0;
      let totalReps = 0;
      let totalWeight = 0;

      workout.exercises.forEach(exercise => {
        totalSets += exercise.sets.length;
        exercise.sets.forEach(set => {
          totalReps += parseInt(set.reps) || 0;
          totalWeight += parseFloat(set.weight) || 0;
        });
      });

      setSummary({
        totalSets,
        totalReps,
        totalWeight,
        totalExercises: workout.exercises.length,
      });
    }
  }, [workout]);

  if (!isOpen || !workout) return null;

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000,
  };

  const modalContentStyle = {
    backgroundColor: 'var(--color-card-dark)', padding: '40px',
    borderRadius: '20px', maxWidth: '500px', width: '90%', position: 'relative',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
  };

  const closeButtonStyle = {
    position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)', fontSize: '24px',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeButtonStyle}><MdClose /></button>
        <h2 style={{ color: 'var(--color-primary-neon)' }}>Workout Finished!</h2>
        <h3>Workout Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' }}>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <h4>Exercises</h4>
            <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{summary.totalExercises}</p>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <h4>Total Sets</h4>
            <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{summary.totalSets}</p>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <h4>Total Reps</h4>
            <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{summary.totalReps}</p>
          </div>
          <div className="card" style={{ padding: '15px', textAlign: 'center' }}>
            <h4>Total Volume</h4>
            <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{summary.totalWeight} lbs</p>
          </div>
        </div>
        <button onClick={onFinish} style={{ marginTop: '20px', width: '100%' }}>View History</button>
      </div>
    </div>
  );
};

export default WorkoutSummaryModal;