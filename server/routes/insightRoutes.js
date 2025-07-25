const express = require('express');
const router = express.Router();

// GET /api/insights
router.get('/', (req, res) => {
    console.log('GET /api/insights hit');
    res.json([
        {
            id: 1,
            title: 'The Power of Focus',
            source: 'https://example.com/focus',
            takeaway: 'Eliminate distractions to produce high-leverage output.',
            tags: ['productivity', 'focus']
        }
    ]);
});


module.exports = router;
