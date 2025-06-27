import React from 'react';
import WorkoutHistory from './WorkoutHistory';

const HistoryPage = ({ user }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Full Workout History</h2>
      <WorkoutHistory user={user} />
    </div>
  );
};
export default HistoryPage;