# FitTrack: Smart Workout Tracker Web App

**FitTrack** is a full-stack web application that helps users log their daily workouts, track exercise performance over time, and manage their workout routines efficiently. With features like detailed set tracking, visual progress charts, and AI-powered workout planning, FitTrack offers a comprehensive solution for personal fitness management.

---

## Key Features

- **Google OAuth Authentication**  
  Secure login using Google accounts to ensure safe and personalized access.

- **User Profile & Onboarding**  
  After signing in, users complete a brief onboarding form (including height, weight, age, gender, workout frequency, and fitness goals). This data is used throughout the app to personalize the experience.

- **Workout Logging**  
  Users can log daily workout sessions with:
  - Exercises automatically populated based on their selected workout split.
  - A built-in 3-minute rest timer that auto-starts and can be dismissed.
  - Ability to add and remove sets, including reps and weight.
  - Real-time input validation to prevent incorrect or incomplete data.

- **Workout History**  
  A complete view of past sessions, with the ability to delete entries and review all set details.

- **Personal Records Tracker**  
  Automatically calculates and displays each user’s highest recorded weight for every exercise.

- **Progress Visualization**  
  Generates line charts that show weight progression over time for individual exercises, helping users stay motivated and informed.

- **Workout Split Management**  
  Users can create and manage weekly workout splits, including:
  - Custom day names and corresponding weekdays.
  - Editable exercises for each day.
  - Reordering, editing, and deleting splits through a user-friendly modal interface.
  - Selecting an active split to power the daily workout experience.

- **Exercise Management**  
  Browse, add, or delete exercises organized by muscle group (Chest, Back, Legs, etc.). Supports both predefined and custom exercises.

- **AI-Powered Workout Split Generator**  
  Integrates with ChatGPT via a secure Firebase Cloud Function to generate a personalized 7-day workout split. The split is based on the user’s profile data, including fitness goals, training frequency, gender, and weight.

---

## Live Demo

View the live application at: [https://fit-track-black.vercel.app/](https://fit-track-black.vercel.app/)

---

## Technology Stack

- **Frontend**: React (Vite), React Hooks, Chart.js (via react-chartjs-2), React Calendar, React Icons  
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)  
- **AI Integration**: OpenAI’s ChatGPT API, accessed securely via Firebase Cloud Functions  
- **Development Tools**: Git, npm, Visual Studio Code  
- **Deployment**: Vercel

---

## Future Improvements

- Add adaptive workout progression based on past performance.
- Introduce social features like friend connections or workout sharing.
- Expand visualizations with more detailed progress tracking and advanced analytics.
