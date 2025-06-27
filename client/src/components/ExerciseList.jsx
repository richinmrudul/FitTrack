import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore'; // <-- Add `doc` and `deleteDoc`
import { db, auth } from '../firebase';
import { MdOutlineAdd, MdDelete } from 'react-icons/md';

const ExerciseList = ({ category }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExercise, setNewExercise] = useState('');

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'exercises'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedExercises = [];
      querySnapshot.forEach((doc) => {
        fetchedExercises.push({ id: doc.id, ...doc.data() });
      });
      setExercises(fetchedExercises);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const filteredExercises = category === 'all' ? exercises : exercises.filter(ex => ex.category === category);

  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!newExercise) return;
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'exercises'), {
        userId: auth.currentUser.uid,
        name: newExercise,
        category: category,
      });
      setNewExercise('');
      alert("Exercise added!");
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this exercise?");
      if (confirmDelete) {
          try {
              await deleteDoc(doc(db, "exercises", exerciseId));
              alert("Exercise deleted successfully!");
          } catch (error) {
              console.error("Error deleting exercise:", error);
              alert("Failed to delete exercise. Check console.");
          }
      }
  };

  if (loading) return <p>Loading exercises...</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      <form onSubmit={handleAddExercise} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" value={newExercise} onChange={(e) => setNewExercise(e.target.value)} placeholder={`Add exercise to ${category}`} style={{ flexGrow: 1 }} />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredExercises.length === 0 ? (
            <p>No exercises found in this category.</p>
        ) : (
            filteredExercises.map(ex => (
                <li key={ex.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                    <span>{ex.name}</span>
                    <button onClick={() => handleDeleteExercise(ex.id)} className="icon-button delete-button">
                        <MdDelete />
                    </button>
                </li>
            ))
        )}
      </ul>
    </div>
  );
};

export default ExerciseList;