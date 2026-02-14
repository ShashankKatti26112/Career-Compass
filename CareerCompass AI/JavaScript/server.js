require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allows your frontend to talk to this server

const openai = new OpenAI({ apiKey: process.env.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 });

app.post('/analyze', async (req, res) => {
    try {
        const { resumeText } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Use gpt-4o-mini for a cheaper/faster version
            messages: [
                { 
                    role: "system", 
                    content: "You are the 'Placement Master AI'. Analyze the resume and return ONLY a raw JSON object with these keys: score (number), gaps (array of 3 strings), formatting (string), and actionPlan (string). Be brutal and actionable." 
                },
                { role: "user", content: `Resume Text: ${resumeText}` }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: "AI analysis failed" });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));