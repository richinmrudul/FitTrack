import React, { useState, useEffect } from 'react';
import { MdClose, MdDelete, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DayModal = ({ isOpen, onClose, dayData, onSave }) => {
  const [dayName, setDayName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(daysOfWeek[0]);
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('chest');

  const categories = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'cardio', 'all'];

  useEffect(() => {
    if (dayData) {
      setDayName(dayData.name || '');
      setDayOfWeek(dayData.dayOfWeek || daysOfWeek[0]);
      setExercises(dayData.exercises.map(name => ({ name, category: 'all' }))); // Assuming 'all' if category is not saved
    } else {
      setDayName('');
      setDayOfWeek(daysOfWeek[0]);
      setExercises([]);
    }
  }, [dayData, isOpen]);

  const handleAddExercise = (e) => {
    if (e) e.preventDefault();
    if (newExercise.trim()) {
      setExercises([...exercises, { name: newExercise, category: newExerciseCategory }]);
      setNewExercise('');
    }
  };

  const handleRemoveExercise = (indexToRemove) => {
    setExercises(exercises.filter((_, index) => index !== indexToRemove));
  };

  const handleMove = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newExercises = [...exercises];
      [newExercises[index - 1], newExercises[index]] = [newExercises[index], newExercises[index - 1]];
      setExercises(newExercises);
    } else if (direction === 'down' && index < exercises.length - 1) {
      const newExercises = [...exercises];
      [newExercises[index + 1], newExercises[index]] = [newExercises[index], newExercises[index + 1]];
      setExercises(newExercises);
    }
  };

  const handleSave = async () => {
    if (!dayName) {
      alert("Please enter a name for the day.");
      return;
    }

    const exercisesToAdd = exercises.filter(ex => !ex.id);
    if (exercisesToAdd.length > 0 && auth.currentUser) {
        for (const exercise of exercisesToAdd) {
            await addDoc(collection(db, 'exercises'), {
                userId: auth.currentUser.uid,
                name: exercise.name,
                category: exercise.category,
            });
        }
        alert(`${exercisesToAdd.length} new exercises added to your list!`);
    }

    onSave({ name: dayName, dayOfWeek: dayOfWeek, exercises: exercises.map(ex => ex.name) });
    onClose();
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
  };

  const modalContentStyle = {
    backgroundColor: 'var(--color-card-dark)', padding: '30px', borderRadius: '16px',
    maxWidth: '450px', width: '90%', position: 'relative',
    display: 'flex', flexDirection: 'column', gap: '20px',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)', fontSize: '24px' }}><MdClose /></button>
        <h3>{dayData ? 'Edit Day' : 'Create a New Day'}</h3>

        <div className="form-group">
            <label htmlFor="modal-day-name">Day Name:</label>
            <input type="text" id="modal-day-name" value={dayName} onChange={(e) => setDayName(e.target.value)} placeholder="e.g., Push Day" />
        </div>
        <div className="form-group">
            <label htmlFor="modal-day-of-week">Day of Week:</label>
            <select id="modal-day-of-week" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                {daysOfWeek.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
        </div>

        <form onSubmit={handleAddExercise} style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Add new exercise" value={newExercise} onChange={(e) => setNewExercise(e.target.value)} style={{ flexGrow: 1 }} />
          <select value={newExerciseCategory} onChange={(e) => setNewExerciseCategory(e.target.value)} style={{ width: '120px' }}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button type="submit" style={{ minWidth: '80px' }}>Add</button>
        </form>

        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, maxHeight: '150px', overflowY: 'auto' }}>
          {exercises.map((exercise, index) => (
            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <span>{exercise.name || exercise} ({exercise.category || 'N/A'})</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleMove(index, 'up')} style={{ border: 'none', background: 'none', color: 'var(--color-text-light)', padding: '0' }}><MdArrowUpward /></button>
                  <button onClick={() => handleMove(index, 'down')} style={{ border: 'none', background: 'none', color: 'var(--color-text-light)', padding: '0' }}><MdArrowDownward /></button>
                  <button onClick={() => handleRemoveExercise(index)} style={{ border: 'none', background: 'none', color: 'var(--color-secondary-red)', padding: '0' }}><MdDelete /></button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default DayModal;