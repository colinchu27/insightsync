const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight'); // adjust path if needed

// GET /api/insights
router.get('/', async (req, res) => {
    try {
        const insights = await Insight.find();
        res.json(insights);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/insights
router.post('/', async (req, res) => {
    try {
        const { title, source, takeaway, tags } = req.body;
        const newInsight = new Insight({ title, source, takeaway, tags });
        const savedInsight = await newInsight.save();
        res.json(savedInsight);
    } catch (err) {
        console.error('Error saving insight:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
