import React from 'react';
import ProgressCharts from './ProgressCharts';

const StatisticsPage = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', textAlign: 'center' }}>
            <h2>Statistics & Charts</h2>
            <ProgressCharts />
        </div>
    );
};

export default StatisticsPage;