import React, { useState } from 'react';
import { MdHistory, MdBarChart, MdPerson, MdEdit, MdFitnessCenter, MdOutlineLeaderboard, MdTrendingUp, MdOutlineAdd, MdOutlineRunCircle, MdOutlineSportsGymnastics, MdOutlineDirectionsRun, MdOutlineFitnessCenter as MdFitnessCenterOutline } from 'react-icons/md';
import ExerciseList from './ExerciseList';




const ExercisesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const muscleGroups = [
        { name: 'Chest', icon: <MdFitnessCenter />, category: 'chest' },
        { name: 'Back', icon: <MdFitnessCenterOutline />, category: 'back' },
        { name: 'Legs', icon: <MdOutlineRunCircle />, category: 'legs' }, // <-- Replaced with a run icon
        { name: 'Arms', icon: <MdOutlineSportsGymnastics />, category: 'arms' },
        { name: 'Shoulders', icon: <MdOutlineSportsGymnastics />, category: 'shoulders' },
        { name: 'Core', icon: <MdOutlineSportsGymnastics />, category: 'core' },
        { name: 'Cardio', icon: <MdOutlineDirectionsRun />, category: 'cardio' },
        { name: 'All', icon: <MdOutlineAdd />, category: 'all' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            {selectedCategory ? (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>{selectedCategory.name} Exercises</h2>
                        <button onClick={() => setSelectedCategory(null)}>Back to Categories</button>
                    </div>
                    <ExerciseList category={selectedCategory.category} />
                </div>
            ) : (
                <div>
                    <h2>Exercise Categories</h2>
                    <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                        {muscleGroups.map(group => (
                            <div key={group.name} className="grid-item" onClick={() => setSelectedCategory(group)}>
                                <span className="icon">{group.icon}</span>
                                {group.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExercisesPage;