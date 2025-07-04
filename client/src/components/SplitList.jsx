import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MdOutlineAdd, MdEdit, MdDelete, MdCheck } from 'react-icons/md';
import DayModal from './DayModal';

const SplitList = ({ onSetPage, onSelectSplit }) => {
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [splitToEdit, setSplitToEdit] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'splits'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedSplits = [];
      querySnapshot.forEach((doc) => {
        fetchedSplits.push({ id: doc.id, ...doc.data() });
      });
      setSplits(fetchedSplits);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching splits:", err);
      setError("Failed to load splits.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sort splits to put the selected one at the top
  const sortedSplits = splits.sort((a, b) => (b.selected - a.selected));

  if (loading) {
    return <p>Loading splits...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const handleEditSplit = (split) => {
    onSelectSplit(split);
    onSetPage('create-split');
  };

  const handleDeleteSplit = async (splitId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this split?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "splits", splitId));
        alert("Split deleted successfully!");
      } catch (e) {
        console.error("Error deleting split:", e);
        alert("Failed to delete split.");
      }
    }
  };

  const handleSelectSplit = async (selectedId) => {
    const batch = writeBatch(db);

    splits.forEach(split => {
        const splitRef = doc(db, 'splits', split.id);
        if (split.id === selectedId) {
            batch.update(splitRef, { selected: true });
        } else if (split.selected) {
            batch.update(splitRef, { selected: false });
        }
    });

    try {
        await batch.commit();
    } catch (e) {
        console.error("Error selecting split:", e);
    }
  };

  const handleSaveDay = async (updatedDay) => {
      if (!splitToEdit) return;

      const updatedDays = [...splitToEdit.days];
      updatedDays[selectedDayIndex] = updatedDay;

      const splitRef = doc(db, "splits", splitToEdit.id);
      await updateDoc(splitRef, { days: updatedDays });

      setIsModalOpen(false);
      setSplitToEdit(null);
  };

  const handleRemoveDay = async (splitId, indexToRemove) => {
      const split = splits.find(s => s.id === splitId);
      if (!split) return;

      const confirmDelete = window.confirm("Are you sure you want to delete this day?");
      if (confirmDelete) {
          const updatedDays = split.days.filter((_, index) => index !== indexToRemove);
          const splitRef = doc(db, "splits", splitId);
          await updateDoc(splitRef, { days: updatedDays });
      }
  };

  const openDayEditModal = (split, dayIndex) => {
      setSplitToEdit(split);
      setSelectedDayIndex(dayIndex);
      setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Workout Splits</h2>
        <button onClick={() => { onSelectSplit(null); onSetPage('create-split'); }}>
          <MdOutlineAdd style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          Create New
        </button>
      </div>

      {sortedSplits.length === 0 ? (
        <p>No splits saved yet. Create your first split!</p>
      ) : (
        <div className="split-list-container">
          {sortedSplits.map((split) => (
            <div key={split.id} className="split-list-item">
              <div className="split-list-header">
                <h4>{split.name || 'Untitled Split'}</h4>
                {split.selected ? (
                    <span className="selected-badge">Selected</span>
                ) : (
                    <button onClick={(e) => { e.stopPropagation(); handleSelectSplit(split.id); }} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-neon)', fontSize: '24px' }}>
                        <MdCheck />
                    </button>
                )}
              </div>
              <p>{split.days.length} workout days</p>

              {/* List of days with edit/delete buttons */}
              <div className="split-day-list-in-card">
                {split.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="day-list-item">
                    <div className="day-number-circle">{dayIndex + 1}</div>
                    <div className="day-name">{day.name} ({day.dayOfWeek})</div>
                    <div className="day-actions">
                      <button onClick={(e) => { e.stopPropagation(); openDayEditModal(split, dayIndex); }} className="icon-button"><MdEdit /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleRemoveDay(split.id, dayIndex); }} className="icon-button delete-button"><MdDelete /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top-level split buttons */}
              <div className="split-list-actions" style={{ position: 'static', marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleEditSplit(split); }} style={{ width: '100%' }}><MdEdit /> Edit Split</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSplit(split.id); }} style={{ width: '100%', border: '2px solid var(--color-secondary-red)', color: 'var(--color-secondary-red)' }}><MdDelete /> Delete Split</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayData={splitToEdit && selectedDayIndex !== null ? splitToEdit.days[selectedDayIndex] : null}
        onSave={handleSaveDay}
      />
    </div>
  );
};

export default SplitList;