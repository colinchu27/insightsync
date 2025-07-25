const express = require('express');
const router = express.Router();

let insights = [
    {
        id: 1,
        title: 'The Power of Focus',
        source: 'https://example.com/focus',
        takeaway: 'Eliminate distractions to produce high-leverage output.',
        tags: ['productivity', 'focus']
    }
];

// GET /api/insights
router.get('/', (req, res) => {
    res.json(insights);
});

// POST /api/insights
// POST /api/insights
router.post('/', (req, res) => {
    const { title, source, takeaway, tags } = req.body;

    if (!title || !source || !takeaway) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newInsight = {
        id: Date.now(), // quick unique ID
        title,
        source,
        takeaway,
        tags: tags || []
    };

    console.log('New insight submitted:', newInsight);
    res.status(201).json(newInsight);
});


module.exports = router;
