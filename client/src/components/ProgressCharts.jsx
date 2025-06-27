import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressCharts = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [availableExercises, setAvailableExercises] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'workouts'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('date', 'asc') // Order by date ascending for the chart
        );
        const querySnapshot = await getDocs(q);

        const workouts = [];
        const exerciseNames = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          workouts.push(data);
          if (data.exercises) {
            data.exercises.forEach(ex => exerciseNames.add(ex.name));
          }
        });

        setAvailableExercises(Array.from(exerciseNames));

        // If no exercise is selected, select the first one
        const defaultExercise = selectedExercise || Array.from(exerciseNames)[0];
        if (defaultExercise) {
          setSelectedExercise(defaultExercise);
        }

        // Prepare data for the chart based on the selected exercise
        if (defaultExercise) {
          const labels = workouts.map(w => w.date.toDate().toLocaleDateString());
          const dataPoints = workouts.map(w => {
            const ex = w.exercises.find(e => e.name === defaultExercise);
            return ex ? parseFloat(ex.weight) : null;
          });

          setChartData({
            labels,
            datasets: [
              {
                label: `${defaultExercise} Weight (kg)`,
                data: dataPoints,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                spanGaps: true, // Connects data points across null values
              },
            ],
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data.");
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedExercise, auth.currentUser]); // Re-fetch when user or selected exercise changes

  if (loading) {
    return <p>Loading chart data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weight Lifted Over Time',
      },
    },
    scales: {
        y: {
            title: {
                display: true,
                text: 'Weight (kg)'
            }
        }
    }
  };

  return (
    <div style={{ marginTop: '40px', width: '90%', maxWidth: '800px' }}>
      <h3>Progress Charts</h3>
      {availableExercises.length > 0 && (
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          style={{ padding: '8px', marginBottom: '15px' }}
        >
          <option value="">Select an exercise</option>
          {availableExercises.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      )}
      {chartData ? <Line options={options} data={chartData} /> : <p>No data available for charts. Log a workout!</p>}
    </div>
  );
};

export default ProgressCharts;