# 🏋️‍♂️ FitTrack: Smart Workout Tracker Web App 

A full-stack web application designed to help users track their daily workouts, log exercises with detailed sets, reps, and weight, and visualize their progress over time. Features a clean, intuitive user interface and robust data management, now powered by AI!

---

## ✨ Key Features

* **Google OAuth Login:** Secure user authentication using Google accounts.
* **Personalized Profile:** Users complete an onboarding form (height, weight, age, gender, frequency, goal) and view their personal data on a dedicated profile page.
* **Workout Logging:** Intuitive interface to log daily workout sessions.
    * Automatically shows exercises for the current day from the selected split.
    * Includes a **3-minute auto-starting, dismissible rest timer**.
    * Allows adding/removing sets with weight (lbs) and reps.
    * Input validation for sets.
* **Workout History:** View and delete past workout sessions with detailed set information.
* **Personal Records (PR) Tracker:** Automatically calculates and displays the highest weight lifted for each exercise.
* **Progress Charts:** Visual line charts to track weight progression over time for individual exercises.
* **Workout Split Management:**
    * Create and manage custom weekly workout splits (e.g., Push/Pull/Legs).
    * Ability to define custom day names and assign actual days of the week.
    * Edit/reorder/delete exercises for each day via an intuitive modal interface.
    * Select an active split to be used in the workout logger.
* **Exercise Manager:** Categorized list of exercises (Chest, Back, Legs, etc.) with ability to add and delete custom exercises.
* **🧠 AI-Powered Personalized Split Generator:** Integrates with ChatGPT to generate a custom 7-day workout split based on the user's profile data (goal, frequency, gender, weight). This demonstrates advanced AI integration for personalized fitness recommendations.

---

## 🚀 Live Demo

Explore the deployed application here: [https://fit-track-black.vercel.app/](https://fit-track-black.vercel.app/)

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), React Hooks, `react-icons`, `react-calendar`, `chart.js` (`react-chartjs-2`).
* **Backend & Database:** Google Firebase (Firestore, Authentication, **Cloud Functions**).
* **AI Integration:** **OpenAI (ChatGPT API)** via Firebase Cloud Functions.
* **Development:** Git, npm, Visual Studio Code.
* **Deployment:** Vercel.

---

## 💡 Next Steps / Future Enhancements

* Implement adaptive workout progression logic based on historical performance.
* Add social features like workout sharing and friend tracking.
* Expand detailed statistics and progress visualizations.

---