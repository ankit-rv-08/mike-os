const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { processMessage } = require('./services/ai-service');

const app = express();
const PORT = process.env.PORT || 8787;

app.use(express.json());

// --- MANUAL CORS INJECTOR (THE PERMANENT FIX) ---
app.use((req, res, next) => {
    // Allow both localhost development and production Vercel URL
    const allowedOrigins = [
        'http://localhost:3000',
        'https://mike-os-frontend.vercel.app'
    ];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle the "Preflight" (OPTIONS) request instantly
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const getDB = (file) => {
    const p = path.join(DATA_DIR, file);
    if (!fs.existsSync(p)) return {};
    try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch (e) { return {}; }
};

const saveDB = (file, data) => {
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
};

// --- ROUTES ---

// Chat & Command
app.post(['/api/chat', '/api/command'], async (req, res) => {
    try {
        const message = req.body.message || req.body.input || req.body.command;
        const history = req.body.history || [];
        const result = await processMessage(message, history);
        res.json(result);
    } catch (error) {
        res.status(500).json({ response: "⚠️ MIKE internal core failure.", brain: "error" });
    }
});

// Performance & Vitals
app.get('/api/performance', (req, res) => res.json(getDB('performance.json')));
app.post('/api/performance', (req, res) => {
    saveDB('performance.json', req.body);
    res.json({ success: true });
});

// NEW: Habit Management
app.get('/api/habits', (req, res) => {
    const data = getDB('performance.json');
    res.json(data.habits || []);
});

app.post('/api/habits', (req, res) => {
    const perf = getDB('performance.json');
    perf.habits = req.body.habits; // Overwrites habit list with updated version
    saveDB('performance.json', perf);
    res.json({ success: true });
});

// Projects, Finance, Calendar (Keep these as they were)
app.get('/api/projects', (req, res) => res.json(getDB('projects.json')));
app.post('/api/projects', (req, res) => { saveDB('projects.json', req.body); res.json({ success: true }); });
app.get('/api/finance', (req, res) => res.json(getDB('finance.json')));
app.post('/api/finance', (req, res) => { saveDB('finance.json', req.body); res.json({ success: true }); });
app.get('/api/calendar', (req, res) => res.json(getDB('calendar.json')));
app.post('/api/calendar', (req, res) => { saveDB('calendar.json', req.body); res.json({ success: true }); });

app.listen(PORT, () => console.log(`MIKE OS Backend Active on Port ${PORT}`));