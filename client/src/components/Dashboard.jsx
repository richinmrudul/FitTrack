import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import QuickActions from './QuickActions';

const Dashboard = ({ user, onSetPage }) => {
    const [workoutDates, setWorkoutDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    // Fetch all workout dates and the workout for the selected date
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'workouts'), where('userId', '==', user.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const dates = [];
            let workoutForSelectedDate = null;

            querySnapshot.docs.forEach(doc => {
                const workoutData = doc.data();
                const workoutDate = workoutData.date.toDate();

                dates.push(workoutDate.toDateString());

                // Check if this workout is for the selected date
                if (workoutDate.toDateString() === selectedDate.toDateString()) {
                    workoutForSelectedDate = workoutData;
                }
            });

            setWorkoutDates(dates);
            setSelectedWorkout(workoutForSelectedDate);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, selectedDate]); // Re-fetch when user or selectedDate changes

    // Tile content for the calendar (adds a dot on workout days)
    const tileContent = ({ date, view }) => {
        if (view === 'month' && workoutDates.includes(date.toDateString())) {
            return <div className="workout-day-dot"></div>;
        }
        return null;
    };

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    // Render the UI
    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Good morning, {user.displayName}!</h2>
            <p>You are signed in.</p>

            {/* Quick Actions at the top */}
            <QuickActions onSetPage={onSetPage} />

            {/* Calendar and Workout Summary at the bottom */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <div className="card calendar-card" style={{ flexGrow: 1, minWidth: '350px' }}>
                    <h3>Workout Calendar</h3>
                    <Calendar
                        onChange={setSelectedDate} // Update state on date click
                        value={selectedDate}
                        tileContent={tileContent}
                        className="react-calendar"
                    />
                </div>

                <div className="card" style={{ flexGrow: 1, minWidth: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <h3>Workout on {selectedDate.toLocaleDateString()}</h3>
                    {selectedWorkout ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {selectedWorkout.exercises.map((ex, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>
                                    - {ex.name}: {ex.sets.length} sets
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No workout logged for this day. Let's get to work!</p>
                    )}
                    <button onClick={() => onSetPage('log')} style={{ marginTop: 'auto' }}>Log a Workout</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;