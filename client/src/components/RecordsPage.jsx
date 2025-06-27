import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'; // <-- Add orderBy for consistent sorting
import { db, auth } from '../firebase';

const RecordsPage = () => {
    const [personalRecords, setPersonalRecords] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'workouts'),
            where('userId', '==', auth.currentUser.uid),
            orderBy('date', 'desc') // Order by date to fetch data consistently
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const prs = {};
            querySnapshot.forEach((doc) => {
                const workoutData = doc.data();
                if (workoutData.exercises) {
                    workoutData.exercises.forEach(ex => {
                        // Find the max weight from all sets in the exercise
                        if (ex.sets && ex.sets.length > 0) {
                            const maxWeightInSets = Math.max(...ex.sets.map(set => parseFloat(set.weight) || 0));
                            const name = ex.name.toLowerCase();

                            if (maxWeightInSets > 0) {
                                if (!prs[name] || maxWeightInSets > prs[name].weight) {
                                    prs[name] = { weight: maxWeightInSets, date: workoutData.date.toDate() };
                                }
                            }
                        }
                    });
                }
            });
            setPersonalRecords(prs);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const prEntries = Object.entries(personalRecords);

    if (loading) {
        return <p>Loading PRs...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Personal Records (PRs)</h2>
            {prEntries.length === 0 ? (
                <p>Log a workout to see your PRs!</p>
            ) : (
                <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    {prEntries.map(([name, pr]) => (
                        <div key={name} className="card highlight-border" style={{ textAlign: 'center', padding: '15px', backgroundColor: 'var(--color-card-dark)' }}>
                            <h4>{name.toUpperCase()}</h4>
                            <p style={{ margin: '5px 0' }}><strong>Max Weight:</strong> {pr.weight} lbs</p>
                            <p style={{ margin: '5px 0', fontSize: '0.9em' }}>Date: {pr.date.toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecordsPage;