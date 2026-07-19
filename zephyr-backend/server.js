const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Backend online and operational.");
});

app.get('/test-ai', async (req, res) => {
    try {
        console.log("Asking Gemini a question...");

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: 'Give me one short, inspiring quote about fitness.',
        });

        res.send(`<h1>AI Test Successful!</h1><p><strong>Gemini says:</strong> "${response.text}"</p>`);
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).send("Oops! Something went wrong talking to the AI.");
    }
});

app.post('/api/generate-plan', async (req, res) => {
    try {
        const { age, weight, goal, dietClass, activityRank, bodyConstraints } = req.body;
        
        console.log("Received plan request:", req.body);

        let exercisesStr = "";
        try {
            const fs = require('fs');
            const path = require('path');
            const exercisesPath = path.resolve(__dirname, '../backend/exercise.json');
            const exercisesData = fs.readFileSync(exercisesPath, 'utf8');
            exercisesStr = `\n\nAVAILABLE EXERCISES (You MUST select all workout tasks EXCLUSIVELY from this JSON list. Do not invent any exercises. Strictly respect contraindications matching the user's constraints): ${exercisesData}\n`;
        } catch (e) {
            console.error("Could not load exercise.json", e);
        }

        const prompt = `Generate a 7-day fitness and diet schedule for a ${age} year old weighing ${weight}kg. Goal: ${goal}. Diet: ${dietClass}. Activity Level: ${activityRank}. Constraints: ${bodyConstraints && bodyConstraints.length > 0 ? bodyConstraints.join(", ") : "None"}.${exercisesStr}

You MUST return the output ONLY as a JSON object, without any markdown formatting, following this exact schema:
{
  "diet": {
    "Monday": [{ "id": "d1-Mon", "label": "Task name", "done": false }],
    "Tuesday": [...],
    "Wednesday": [...],
    "Thursday": [...],
    "Friday": [...],
    "Saturday": [...],
    "Sunday": [...]
  },
  "workout": {
    "Monday": [{ "id": "w1-Mon", "label": "Task name", "done": false }],
    "Tuesday": [...],
    "Wednesday": [...],
    "Thursday": [...],
    "Friday": [...],
    "Saturday": [...],
    "Sunday": [...]
  }
}
Provide exactly 4 diet tasks and 3 workout tasks per day. Use short labels.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        let planData;
        try {
            planData = JSON.parse(response.text);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON:", response.text);
            return res.status(500).json({ error: "Failed to parse generated plan." });
        }

        res.json({
            success: true,
            message: "Plan generated successfully",
            plan: planData
        });
    } catch (error) {
        console.error("Error generating plan:", error);
        res.status(500).json({ error: "Failed to generate plan." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});