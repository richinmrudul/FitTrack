import React from 'react';
import WorkoutForm from './WorkoutForm';

const LogPage = ({ user }) => {
  return (
    <div style={{ padding: '20px' }}>
      <WorkoutForm user={user} />
    </div>
  );
};
export default LogPage;