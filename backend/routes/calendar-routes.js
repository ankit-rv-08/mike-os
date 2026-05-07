const express = require("express");
const { ok, fail } = require("../utils/response");

const router = express.Router();

// In-memory events store
let events = [];

router.get("/calendar", async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const monthEvents = events.filter(e => e.date.startsWith(month));
    res.json(ok({ events: monthEvents, month }));
  } catch (error) {
    res.status(500).json(fail(error.message));
  }
});

router.post("/calendar", async (req, res) => {
  try {
    const { title, date, time, type } = req.body;
    if (!title || !date) {
      return res.status(400).json(fail("Title and date required"));
    }
    const event = {
      id: Date.now().toString(),
      title,
      date,
      time: time || '',
      type: type || 'event',
      created: new Date().toISOString()
    };
    events.push(event);
    res.json(ok(event, "Event created"));
  } catch (error) {
    res.status(500).json(fail(error.message));
  }
});

module.exports = router;