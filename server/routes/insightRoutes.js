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

router.put('/:id', async (req, res) => {
    try {
        const updatedInsight = await Insight.findByIdAndUpdate(
            req.params.id,
            req.body,
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
