const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight'); // adjust path if needed

// GET all insights (sorted by most recent)
router.get('/', async (req, res) => {
    try {
        const insights = await Insight.find().sort({ createdAt: -1 });
        res.json(insights);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST a new insight
router.post('/', async (req, res) => {
    const { title, source, takeaway, tags, visibility } = req.body;

    const newInsight = new Insight({
        title,
        source,
        takeaway,
        tags,
        visibility,
    });

    try {
        const saved = await newInsight.save();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save insight' });
    }
});

// PUT (update) an existing insight
router.put('/:id', async (req, res) => {
    const { title, source, takeaway, tags, visibility } = req.body;

    try {
        const updatedInsight = await Insight.findByIdAndUpdate(
            req.params.id,
            { title, source, takeaway, tags, visibility },
            { new: true, runValidators: true }
        );

        if (!updatedInsight) {
            return res.status(404).json({ error: 'Insight not found' });
        }

        res.json(updatedInsight);
    } catch (err) {
        console.error('Error updating insight:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE an insight
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Insight.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Insight not found' });
        }
        res.json({ message: 'Insight deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete insight' });
    }
});

module.exports = router;
