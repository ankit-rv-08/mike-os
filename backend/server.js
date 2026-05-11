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
    // This allows YOUR specific frontend to talk to this server
    res.header('Access-Control-Allow-Origin', 'https://mike-os-frontend.vercel.app');
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
    try {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
    } catch (e) { return {}; }
};

const saveDB = (file, data) => {
    fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
};

// --- ROUTES ---
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    const result = await processMessage(message, history);
    res.json(result);
});

app.get('/api/performance', (req, res) => res.json(getDB('performance.json')));
app.post('/api/performance', (req, res) => {
    saveDB('performance.json', req.body);
    res.json({ success: true });
});

app.get('/api/projects', (req, res) => res.json(getDB('projects.json')));
app.post('/api/projects', (req, res) => {
    saveDB('projects.json', req.body);
    res.json({ success: true });
});

app.get('/api/finance', (req, res) => res.json(getDB('finance.json')));
app.post('/api/finance', (req, res) => {
    saveDB('finance.json', req.body);
    res.json({ success: true });
});

app.get('/api/calendar', (req, res) => res.json(getDB('calendar.json')));
app.post('/api/calendar', (req, res) => {
    saveDB('calendar.json', req.body);
    res.json({ success: true });
});

// --- FIX: Alias /api/command to /api/chat ---
app.post('/api/command', async (req, res) => {
    // This catches the '404' and routes it to your AI logic
    const { message, history } = req.body;
    const result = await processMessage(message, history);
    res.json(result);
});

app.listen(PORT, () => console.log(`MIKE OS Backend Active on Port ${PORT}`));