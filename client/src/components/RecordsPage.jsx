import React from 'react';
import ProgressCharts from './ProgressCharts';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Bar } from 'react-chartjs-2'; // Import a Bar chart if you want
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
            where('userId', '==', auth.currentUser.uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const prs = {};
            querySnapshot.forEach((doc) => {
                const workoutData = doc.data();
                if (workoutData.exercises) {
                    workoutData.exercises.forEach(ex => {
                        const weight = parseFloat(ex.weight);
                        const name = ex.name.toLowerCase();
                        if (!isNaN(weight)) {
                            if (!prs[name] || weight > prs[name].weight) {
                                prs[name] = { weight, date: workoutData.date.toDate() };
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

    return (
        <div style={{ padding: '20px' }}>
            <h2>Records & Charts</h2>
            <div className="card" style={{ marginTop: '20px' }}>
                <h3>Personal Records (PRs)</h3>
                {loading ? (
                    <p>Loading PRs...</p>
                ) : prEntries.length === 0 ? (
                    <p>Log a workout to see your PRs!</p>
                ) : (
                    <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        {prEntries.map(([name, pr]) => (
                            <div key={name} className="card highlight-border" style={{ textAlign: 'center', padding: '15px', backgroundColor: 'var(--color-card-dark)' }}>
                                <h4>{name.toUpperCase()}</h4>
                                <p style={{ margin: '5px 0' }}><strong>Max Weight:</strong> {pr.weight} kg</p>
                                <p style={{ margin: '5px 0', fontSize: '0.9em' }}>Date: {pr.date.toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ProgressCharts />
        </div>
    );
};

export default RecordsPage;