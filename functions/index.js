// functions/index.js
const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors'); // Import cors directly
require('dotenv').config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Configure CORS with specific origins. Add your localhost and future deployed URLs here.
const allowedOrigins = [
    'http://localhost:5173', // Your React app's local development URL
    // 'https://your-deployed-app.vercel.app' // Add your Vercel URL here after deployment
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'OPTIONS'], // Allow POST and OPTIONS for preflight requests
    allowedHeaders: ['Content-Type'],
};

const corsMiddleware = cors(corsOptions);

exports.generateWorkoutSplit = onRequest(async (req, res) => {
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        corsMiddleware(req, res, () => {
            res.status(204).send(''); // Respond with 204 for preflight
        });
        return;
    }

    // Apply CORS middleware for the actual request
    corsMiddleware(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const { goal, frequency, gender, currentWeight, workoutDays } = req.body;

        if (!goal || !frequency || !gender || !currentWeight || !workoutDays) {
            return res.status(400).send('Missing required parameters.');
        }

        const prompt = `
        You are an expert fitness coach creating a personalized weekly workout split.
        The user's goal is to ${goal}.
        They want to work out ${frequency} times per week.
        Their gender is ${gender}.
        Their current weight is ${currentWeight} lbs.

        Generate a detailed weekly workout split. For each of the ${workoutDays} workout days, provide a clear day name (e.g., Push Day, Pull Day, Leg Day, Full Body, Rest Day).
        For each workout day, list 4-6 exercises. If it's a rest day, state "Rest Day" and no exercises.

        Format your response as a JSON array of objects, where each object represents a day in the split.
        Each day object should have:
        - 'name': a string (e.g., "Push Day")
        - 'dayOfWeek': a string representing the actual day of the week (e.g., "Monday", "Tuesday"). Make sure to use all 7 days of the week, including rest days.
        - 'exercises': an array of strings, each being an exercise name (e.g., "Barbell Bench Press", "Overhead Press"). If it's a rest day, this array should be empty.

        Example JSON structure for a PPL split:
        [
          { "name": "Push Day", "dayOfWeek": "Monday", "exercises": ["Barbell Bench Press", "Incline Dumbbell Press", "Overhead Press", "Tricep Pushdown"] },
          { "name": "Pull Day", "dayOfWeek": "Tuesday", "exercises": ["Pull Ups", "Barbell Row", "Lat Pulldown", "Face Pulls"] },
          { "name": "Leg Day", "dayOfWeek": "Wednesday", "exercises": ["Barbell Squat", "Romanian Deadlift", "Leg Press", "Calf Raises"] },
          { "name": "Rest Day", "dayOfWeek": "Thursday", "exercises": [] },
          { "name": "Push Day", "dayOfWeek": "Friday", "exercises": ["Dumbbell Bench Press", "Dips", "Shoulder Press", "Lateral Raises"] },
          { "name": "Pull Day", "dayOfWeek": "Saturday", "exercises": ["Deadlifts", "Pull Aparts", "Hammer Curls", "Machine Rows"] },
          { "name": "Rest Day", "dayOfWeek": "Sunday", "exercises": [] }
        ]

        Ensure the exercises are relevant to the goal and frequency. Provide specific, common exercise names.
        Crucially, ensure the response is ONLY the JSON array. Do not include any introductory or concluding text.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            let splitData;
            try {
                splitData = JSON.parse(text);
            } catch (jsonError) {
                console.error("Failed to parse AI response as JSON:", jsonError);
                console.error("AI raw response:", text);
                return res.status(500).json({ error: "AI response was not valid JSON.", rawResponse: text });
            }

            res.status(200).json(splitData);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            res.status(500).json({ error: "Failed to generate workout split.", details: error.message });
        }
    });
});