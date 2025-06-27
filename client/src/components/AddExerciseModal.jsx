import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

const AddExerciseModal = ({ isOpen, onClose, onAddExercise }) => {
  const [exerciseName, setExerciseName] = useState('');

  const handleAdd = () => {
    if (exerciseName.trim()) {
      onAddExercise(exerciseName);
      setExerciseName('');
    }
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  };

  const modalContentStyle = {
    backgroundColor: 'var(--color-card-dark)',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '90%',
    position: 'relative',
    textAlign: 'center',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-light)',
    fontSize: '24px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid var(--color-border-subtle)',
    backgroundColor: 'var(--color-background-dark)',
    color: 'var(--color-text-light)',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '2px solid var(--color-highlight-subtle)',
    backgroundColor: 'transparent',
    color: 'var(--color-highlight-subtle)',
    borderRadius: '8px',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeButtonStyle}>
          <MdClose />
        </button>
        <h3>Add Exercise</h3>
        <input
          type="text"
          placeholder="Exercise name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleAdd} style={buttonStyle}>Add</button>
      </div>
    </div>
  );
};

export default AddExerciseModal;