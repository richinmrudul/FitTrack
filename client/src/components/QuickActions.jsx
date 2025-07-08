import React from 'react';
import { MdHistory, MdBarChart, MdPerson, MdEdit, MdFitnessCenter, MdOutlineLeaderboard, MdTrendingUp, MdCalendarToday, MdSmartToy } from 'react-icons/md'; 

const QuickActions = ({ onSetPage }) => {
  const actions = [
    { name: 'Log Workout', icon: <MdFitnessCenter />, page: 'log' },
    { name: 'History', icon: <MdHistory />, page: 'history' },
    { name: 'Records', icon: <MdOutlineLeaderboard />, page: 'records' },
    { name: 'Workout Split', icon: <MdCalendarToday />, page: 'split' },
    { name: 'Exercises', icon: <MdEdit />, page: 'exercises' },
    { name: 'Statistics', icon: <MdTrendingUp />, page: 'statistics' },
    { name: 'AI Split', icon: <MdSmartToy />, page: 'chatgpt-split' }, // Changed name
    { name: 'Profile', icon: <MdPerson />, page: 'profile' },
  ];

  return (
    <div className="grid-container">
      {actions.map((action) => (
        <div key={action.name} className="grid-item" onClick={() => {
          console.log("Clicked on:", action.name, "setting page to:", action.page); 
          onSetPage(action.page);
        }}>
          <span className="icon">{action.icon}</span>
          {action.name}
        </div>
      ))}
    </div>
  );
};

export default QuickActions;