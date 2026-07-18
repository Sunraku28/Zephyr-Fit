require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    console.log("Starting test...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const res = await ai.models.generateContent({ 
            model: 'gemini-3.5-flash', 
            contents: 'Return {"hello": "world"}',
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
