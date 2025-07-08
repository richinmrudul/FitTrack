// functions/index.js
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const admin = require('firebase-admin');
admin.initializeApp();

exports.generateChatGPTSplit = onCall(async (request) => {
  logger.info("generateChatGPTSplit callable function invoked.");

  if (!request.auth) {
    logger.error("Unauthenticated request to generateChatGPTSplit.");
    throw new HttpsError(
      "unauthenticated",
      "Authentication required to generate a split."
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    logger.error("FATAL: OPENAI_API_KEY environment variable not set.");
    throw new HttpsError("internal", "Server configuration error: OpenAI API key not found.");
  }

  const { goal, frequency, gender, currentWeight } = request.data;

  if (!goal || !frequency || !gender || !currentWeight) {
    logger.error("Missing required parameters in request data:", request.data);
    throw new HttpsError(
      "invalid-argument",
      "Missing required parameters (goal, frequency, gender, currentWeight)."
    );
  }

  const prompt = `
You are an expert fitness coach creating a personalized weekly workout split.
The user's goal is to ${goal}.
They want to work out ${frequency} times per week.
Their gender is ${gender}.
Their current weight is ${currentWeight} lbs.

Generate a detailed weekly workout split for a full 7 days.
For each day, provide a clear day name (e.g., Push Day, Pull Day, Leg Day, Full Body, Rest Day).
List 4–6 exercises for each workout day. If it's a rest day, leave the exercises array empty.

CRUCIAL: Your response MUST be a JSON array of 7 objects. Each object represents one day in the split.
DO NOT wrap the array in any other JSON object or text. The top-level element MUST be a JSON array.

Each day object MUST have the following properties:
- "name": a string (e.g., "Push Day")
- "dayOfWeek": a string representing the actual day of the week (e.g., "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday").
- "exercises": an array of strings, each being an exercise name (e.g., "Barbell Bench Press", "Overhead Press").

Ensure the response is ONLY the JSON array. Do not include any introductory or concluding text.
`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = chatCompletion.choices[0].message.content;
    let splitData;
    try {
      splitData = JSON.parse(rawText);
    } catch (jsonError) {
      logger.error("Failed to parse AI response as JSON:", jsonError);
      logger.error("AI raw response:", rawText);
      throw new HttpsError("internal", "AI response was not valid JSON.", { rawResponse: rawText });
    }

    logger.info("Successfully generated split from OpenAI.");
    return splitData;

  } catch (error) {
    logger.error("Error calling OpenAI API:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "An unexpected error occurred while generating workout split.", error.message);
  }
});
