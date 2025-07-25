const express = require('express');
const router = express.Router();

// GET /api/insights
router.get('/', (req, res) => {
    res.json([
        {
            id: 1,
            title: 'The Power of Focus',
            source: 'https://example.com/focus',
            takeaway: 'Eliminate distractions to produce high-leverage output.',
            tags: ['productivity', 'focus']
        },
        {
            id: 2,
            title: 'How PMs Think',
            source: 'https://example.com/pm-thinking',
            takeaway: 'Good PMs frame problems before rushing to solutions.',
            tags: ['product-management']
        }
    ]);
});

module.exports = router;
