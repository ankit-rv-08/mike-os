const express = require('express');
const cors = require('cors'); // Declared ONLY ONCE here
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { processMessage } = require('./services/ai-service');

const app = express();
const PORT = process.env.PORT || 8787;

// --- Middlewares ---
app.use(express.json());

// Dynamic CORS configuration for your Vercel deployment
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://mike-os-frontend.vercel.app' // Your live frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// --- Generic Helper for JSON DBs ---
const getDB = (file) => {
    const p = path.join(DATA_DIR, file);
    if (!fs.existsSync(p)) return {};
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
};

const saveDB = (file, data) => {
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
};

// --- ROUTES ---

// Chat Route
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    const result = await processMessage(message, history);
    res.json(result);
});

// Performance (Vitals/Habits)
app.get('/api/performance', (req, res) => res.json(getDB('performance.json')));
app.post('/api/performance', (req, res) => {
    saveDB('performance.json', req.body);
    res.json({ success: true });
});

// Projects (Execution)
app.get('/api/projects', (req, res) => res.json(getDB('projects.json')));
app.post('/api/projects', (req, res) => {
    saveDB('projects.json', req.body);
    res.json({ success: true });
});

// Finance (Capital)
app.get('/api/finance', (req, res) => res.json(getDB('finance.json')));
app.post('/api/finance', (req, res) => {
    saveDB('finance.json', req.body);
    res.json({ success: true });
});

// Calendar
app.get('/api/calendar', (req, res) => res.json(getDB('calendar.json')));
app.post('/api/calendar', (req, res) => {
    saveDB('calendar.json', req.body);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`MIKE OS Backend Active on Port ${PORT}`));