// client/src/scripts/populateExercises.js
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // <-- Add query, where, getDocs
import { db } from '../firebase';

// The exercises to be added
const initialExercises = [
  { name: 'Bench Press', category: 'chest' },
  { name: 'Incline Dumbbell Press', category: 'chest' },
  { name: 'Push-ups', category: 'chest' },
  { name: 'Pull Ups', category: 'back' },
  { name: 'Lat Pulldown', category: 'back' },
  { name: 'Barbell Row', category: 'back' },
  { name: 'Squat', category: 'legs' },
  { name: 'Deadlift', category: 'legs' },
  { name: 'Leg Press', category: 'legs' },
  { name: 'Overhead Press', category: 'shoulders' },
  { name: 'Lateral Raise', category: 'shoulders' },
  { name: 'Bicep Curl', category: 'arms' },
  { name: 'Tricep Pushdown', category: 'arms' },
  { name: 'Plank', category: 'core' },
  { name: 'Crunches', category: 'core' },
  { name: 'Running', category: 'cardio' },
  { name: 'Cycling', category: 'cardio' },
];

// This function will add the data to Firestore for a given user
export const populateExercises = async (user) => {
    if (!user) {
        console.error("No user provided. Cannot run script.");
        return;
    }

    console.log("Checking for existing exercises...");
    const q = query(collection(db, 'exercises'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        console.log("Exercises already exist for this user. Skipping population.");
        return;
    }

    console.log("Adding exercises to Firestore for user:", user.uid);
    for (const exercise of initialExercises) {
        try {
            await addDoc(collection(db, 'exercises'), {
                userId: user.uid,
                name: exercise.name,
                category: exercise.category,
            });
            console.log(`Added ${exercise.name} to Firestore.`);
        } catch (e) {
            console.error(`Error adding ${exercise.name}:`, e);
        }
    }
    console.log("All initial exercises added!");
};