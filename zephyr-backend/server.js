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
            model: 'gemini-3.6-flash',
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
        const { age, weight, goal, dietClass, activityRank, workoutDays, equipment, bodyConstraints, painIntensities, country, level } = req.body;
        const userLevel = level || 1;
        const baseExercises = 5;
        const totalExercisesPerDay = baseExercises + (userLevel - 1);
        
        console.log("Received plan request:", req.body);

        let exercisesStr = "";
        try {
            const fs = require('fs');
            const path = require('path');
            const exercisesPath = path.resolve(__dirname, '../backend/exercise.json');
            const exercisesData = fs.readFileSync(exercisesPath, 'utf8');
            exercisesStr = `\n\nAVAILABLE EXERCISES DATABASE (JSON):\n${exercisesData}\n`;
        } catch (e) {
            console.error("Could not load exercise.json", e);
        }

        // Build pain context string with severity levels
        let painContext = "No body constraints reported.";
        if (bodyConstraints && bodyConstraints.length > 0) {
            const painDetails = bodyConstraints.map(constraint => {
                const intensity = (painIntensities && painIntensities[constraint]) || 50;
                let severity;
                if (intensity <= 33) severity = "MILD";
                else if (intensity <= 66) severity = "MODERATE";
                else severity = "SEVERE";
                return `  - ${constraint}: ${severity} (intensity ${intensity}/100)`;
            }).join("\n");
            painContext = `Body constraints with pain severity:\n${painDetails}`;
        }

        const prompt = `You are a certified sports physiologist and registered dietitian creating a personalized 7-day fitness and nutrition plan.

USER PROFILE:
- Age: ${age} years old
- Weight: ${weight} kg
- Fitness Goal: ${goal || "general fitness"}
- Diet Preference: ${dietClass || "balanced"}
- Activity Level: ${activityRank || "beginner"}
- User Level: Level ${userLevel}
- Country/Region: ${country || "Global"}

BODY CONSTRAINTS:
${painContext}

EQUIPMENT AVAILABILITY:
- The user has access to: ${equipment || 'Not specified'}.
- "full_gym": Access to machines, barbells, dumbbells, cables.
- "dumbbells_bands": Only basic home gym setup (dumbbells, resistance bands, bodyweight).
- "no_equipment": Bodyweight only. No weights or machines.

PAIN-AWARE EXERCISE SELECTION RULES (CRITICAL):
1. MILD pain (0-33): You MUST include exercises for the affected pain area, but keep the sets and reps low compared to the standard baseline.
2. MODERATE pain (34-66): Reduce the sets and reps even further than mild pain, AND strictly decrease the total number of exercises targeting that area throughout the entire 7-day schedule. Use low-impact alternatives.
3. SEVERE pain (67-100): TOTALLY REMOVE any exercises that majorly put effort or load on that specific pain area. Exclude them entirely.
4. NEVER skip an entire muscle group for the whole week unless the pain is SEVERE and every exercise for that group directly loads the affected joint.
${exercisesStr}
EXERCISE DATABASE INSTRUCTIONS:
- Select ALL workout exercises EXCLUSIVELY from the exercise database above. Do NOT invent exercises.
- Respect the "contraindications" field: cross-reference each exercise's contraindications with the user's body constraints and their severity level.
- Ensure chosen exercises match the user's EQUIPMENT AVAILABILITY constraint.
- Use the exercise's "baseline_sets" and "baseline_reps" as starting points, then adjust based on pain severity and activity level.
- Match exercises to the user's activity rank using the "ranks" field.

SCHEDULE VARIETY RULES (CRITICAL):
- Each day MUST have a DIFFERENT workout routine. Vary the target muscle groups, exercise selection, and exercise order across the week.
- Use a proper training split (e.g., Push/Pull/Legs, Upper/Lower, or Full Body with different exercises). Do NOT repeat the same 3 exercises every day.
- Include at least 1 rest day or active recovery day (with mobility/stretching exercises only).
- Vary diet meals across the week too — do not repeat the same breakfast every day.

WORKOUT REQUIREMENTS:
- Provide exactly ${workoutDays || 5} workout days per week with ${totalExercisesPerDay} exercises each (Base 5 exercises + ${userLevel - 1} extra for being Level ${userLevel}). The remaining ${7 - (workoutDays || 5)} days should be rest/recovery days with 3 mobility/stretching exercises only.
- Each exercise MUST include "sets" (number) and "reps" (number or string like "30 sec hold").
- Adjust sets and reps based on the user's activity level and any pain constraints.

DIET REQUIREMENTS:
- Provide exactly 4 meals per day (Breakfast, Lunch, Snack, Dinner).
- Each meal MUST include an "ingredients" field with EXPLICIT quantities. Example: "50g rolled oats, 200ml whole milk, 1 medium banana (sliced), 10g honey, 15g almonds".
- Tailor calorie distribution and macros to the user's goal (${goal || "general fitness"}) and diet preference (${dietClass || "balanced"}).
- CRITICAL REGIONAL DIET STRICTNESS: The diet MUST exclusively consist of traditional and culturally authentic dishes native to ${country || "Global"}.
- ABSOLUTELY NO out-of-region ingredients or generic fitness substitutes. For example, if the country is India, do NOT use Tofu, Edamame, or Quinoa; instead use Paneer, Lentils (Dal), Chickpeas (Chana), or Rice. Apply this strict regional ingredient mapping for whatever country is selected.
- Format the meals to fit the user's macros but NEVER compromise the authentic cultural identity of the cuisine.
- Vary meals across the week — avoid repeating the same dish on consecutive days.

You MUST return the output ONLY as a JSON object following this EXACT schema:
{
  "diet": {
    "Monday": [
      { "id": "d1-Mon", "label": "Oatmeal with Banana & Almonds", "ingredients": "50g rolled oats, 200ml whole milk, 1 medium banana (sliced), 10g honey, 15g almonds", "done": false },
      { "id": "d2-Mon", "label": "Grilled Chicken Salad", "ingredients": "150g chicken breast, 100g mixed greens, 50g cherry tomatoes, 30g feta cheese, 15ml olive oil, 10ml lemon juice", "done": false },
      { "id": "d3-Mon", "label": "Greek Yogurt & Berries", "ingredients": "200g Greek yogurt (0% fat), 80g mixed berries, 10g chia seeds, 5g honey", "done": false },
      { "id": "d4-Mon", "label": "Salmon with Quinoa & Veggies", "ingredients": "150g salmon fillet, 80g quinoa (dry weight), 100g steamed broccoli, 50g roasted bell peppers, 10ml olive oil", "done": false }
    ],
    "Tuesday": [...],
    "Wednesday": [...],
    "Thursday": [...],
    "Friday": [...],
    "Saturday": [...],
    "Sunday": [...]
  },
  "workout": {
    "Monday": [
      { "id": "w1-Mon", "label": "Dumbbell Bicep Curl", "sets": 3, "reps": 12, "done": false },
      { "id": "w2-Mon", "label": "Standard Squat", "sets": 3, "reps": 10, "done": false },
      { "id": "w3-Mon", "label": "Forearm Plank", "sets": 3, "reps": "45 sec hold", "done": false },
      { "id": "w4-Mon", "label": "Glute Bridge", "sets": 3, "reps": 15, "done": false },
      { "id": "w5-Mon", "label": "Dead Bug", "sets": 3, "reps": 10, "done": false }
    ],
    "Tuesday": [...],
    "Wednesday": [...],
    "Thursday": [...],
    "Friday": [...],
    "Saturday": [...],
    "Sunday": [...]
  }
}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
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