require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json()); // Combined body parsing
app.use(bodyParser.json());

// --- 1. INITIALIZE OPENAI ---
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY // Kept secure in .env file
});

// --- 2. INITIALIZE SQL DATABASE ---
const db = new sqlite3.Database('./career_compass.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the CareerCompass SQL database.');
});

// Create Users Table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    email TEXT UNIQUE,
    password TEXT
)`);

// --- 3. AUTHENTICATION ROUTES ---

// SIGNUP ROUTE
app.post('/api/signup', (req, res) => {
    const { fullname, email, password } = req.body;
    const sql = `INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)`;
    
    db.run(sql, [fullname, email, password], (err) => {
        if (err) return res.status(400).json({ error: "Email already exists!" });
        res.json({ message: "Account created successfully!" });
    });
});

// LOGIN ROUTE
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    
    db.get(sql, [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json({ message: "Login successful!", user: row.fullname });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// --- 4. AI RESUME ANALYSIS ROUTE ---

app.post('/analyze', async (req, res) => {
    try {
        const { resumeText } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o", 
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
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI analysis failed" });
    }
});

// --- 5. START SERVER ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 CareerCompass Server running on http://localhost:${PORT}`);
});