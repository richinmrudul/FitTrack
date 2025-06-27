import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MdOutlineAdd, MdDelete, MdEdit } from 'react-icons/md';
import DayModal from './DayModal'; // <-- Import the new consolidated modal

const SplitForm = ({ split, onGoBack }) => {
  const [splitName, setSplitName] = useState('');
  const [customDays, setCustomDays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- Single modal state
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  useEffect(() => {
    if (split) {
      setSplitName(split.name);
      setCustomDays(split.days);
    } else {
      setSplitName('');
      setCustomDays([]);
    }
  }, [split]);

  const handleSaveDay = (dayData) => {
    if (selectedDayIndex !== null) {
      // Update an existing day
      const updatedDays = [...customDays];
      updatedDays[selectedDayIndex] = dayData;
      setCustomDays(updatedDays);
    } else {
      // Add a new day
      setCustomDays([...customDays, dayData]);
    }
    setIsModalOpen(false);
  };

  const handleRemoveDay = (indexToRemove) => {
      setCustomDays(customDays.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveSplit = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to save a split!");
      return;
    }
    if (!splitName || customDays.length === 0) {
      alert("Please name your split and add at least one day.");
      return;
    }

    try {
      if (split) {
        const splitRef = doc(db, "splits", split.id);
        await updateDoc(splitRef, { name: splitName, days: customDays });
        alert("Split updated successfully!");
      } else {
        await addDoc(collection(db, "splits"), { userId: auth.currentUser.uid, name: splitName, days: customDays });
        alert("Split saved successfully!");
      }

      setSplitName('');
      setCustomDays([]);
      onGoBack();
    } catch (e) {
      console.error("Error saving split:", e);
      alert("Failed to save split. Check console.");
    }
  };

  const openModalForDay = (index) => {
    setSelectedDayIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{split ? 'Edit Split' : 'Create a New Split'}</h2>
        <button onClick={onGoBack}>Back</button>
      </div>

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="split-name">Split Name:</label>
        <input id="split-name" type="text" value={splitName} onChange={(e) => setSplitName(e.target.value)} placeholder="e.g., Push/Pull/Legs" />
      </div>

      <button onClick={() => { setSelectedDayIndex(null); setIsModalOpen(true); }} style={{ marginBottom: '20px' }}>
        <MdOutlineAdd style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Add Day
      </button>

      <div className="split-day-list-container">
        {customDays.map((day, index) => (
          <div key={index} className="split-day-item">
            <div className="day-number-circle">{index + 1}</div>
            <div className="day-content" onClick={() => openModalForDay(index)}>
              <h4>{day.name} ({day.dayOfWeek})</h4>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.9em' }}>
                {day.exercises.length === 0 ? (
                  <li style={{ color: 'var(--color-highlight-subtle)' }}>No exercises added.</li>
                ) : (
                  day.exercises.map((ex, exIndex) => (
                    <li key={exIndex}>{ex}</li>
                  ))
                )}
              </ul>
            </div>
            <div className="day-actions">
              <button onClick={() => openModalForDay(index)} className="icon-button"><MdEdit /></button>
              <button onClick={() => handleRemoveDay(index)} className="icon-button delete-button"><MdDelete /></button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSaveSplit} style={{ marginTop: '20px' }}>
        {split ? 'Update Split' : 'Save Split'}
      </button>

      <DayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayData={selectedDayIndex !== null ? customDays[selectedDayIndex] : null}
        onSave={handleSaveDay} // This modal handles both adding and editing
      />
    </div>
  );
};

export default SplitForm;