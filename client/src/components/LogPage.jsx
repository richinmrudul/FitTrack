import React from 'react';
import WorkoutForm from './WorkoutLogger';

const LogPage = ({ user }) => {
  return (
    <div style={{ padding: '20px' }}>
      <WorkoutForm user={user} />
    </div>
  );
};
export default LogPage;