import React from 'react';
import { MdHistory, MdBarChart, MdPerson, MdEdit, MdFitnessCenter, MdOutlineLeaderboard, MdTrendingUp, MdAccessibility } from 'react-icons/md';

const QuickActions = ({ onSetPage }) => {
  const actions = [
    { name: 'Log Workout', icon: <MdFitnessCenter />, page: 'log' }, // <-- Renamed to "Log Workout"
    { name: 'History', icon: <MdHistory />, page: 'history' },
    { name: 'Records', icon: <MdOutlineLeaderboard />, page: 'records' },
    { name: 'Exercises', icon: <MdEdit />, page: 'exercises' },
    { name: 'Statistics', icon: <MdTrendingUp />, page: 'statistics' },
    { name: 'Profile', icon: <MdPerson />, page: 'profile' },
  ];

  return (
    <div className="grid-container">
      {actions.map((action) => (
        <div key={action.name} className="grid-item" onClick={() => onSetPage(action.page)}>
          <span className="icon">{action.icon}</span>
          {action.name}
        </div>
      ))}
    </div>
  );
};

export default QuickActions;