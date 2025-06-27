import React from 'react';
import { MdHistory, MdBarChart, MdPerson, MdEdit, MdFitnessCenter, MdOutlineLeaderboard, MdTrendingUp, MdAccessibility, MdCalendarToday } from 'react-icons/md'; // <-- Added MdCalendarToday

const QuickActions = ({ onSetPage }) => {
  const actions = [
    { name: 'Log Workout', icon: <MdFitnessCenter />, page: 'log' },
    { name: 'History', icon: <MdHistory />, page: 'history' },
    { name: 'Records', icon: <MdOutlineLeaderboard />, page: 'records' },
    { name: 'Workout Split', icon: <MdCalendarToday />, page: 'split' }, // <-- New button
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