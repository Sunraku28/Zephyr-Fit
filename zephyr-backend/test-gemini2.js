require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    console.log("Starting full prompt test...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const prompt = `Generate a 7-day fitness and diet schedule for a 25 year old weighing 80kg. Goal: muscle-gain. Diet: non_veg. Activity Level: intermediate. Constraints: knee.

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

        const res = await ai.models.generateContent({ 
            model: 'gemini-3.5-flash', 
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        console.log('Result:', res.text);
    } catch(e) { 
        console.error('Error:', e.message); 
    }
}
test();
