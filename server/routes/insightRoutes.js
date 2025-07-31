const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all insights (user's own + public insights from others)
router.get('/', optionalAuth, async (req, res) => {
    try {
        let query = { visibility: 'public' };
        
        // If user is authenticated, include their private insights
        if (req.user) {
            query = {
                $or: [
                    { visibility: 'public' },
                    { user: req.user._id }
                ]
            };
        }

        const insights = await Insight.find(query)
            .populate('user', 'username displayName')
            .sort({ createdAt: -1 });
            
        res.json(insights);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's own insights only
router.get('/my', auth, async (req, res) => {
    try {
        const insights = await Insight.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(insights);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get insights by specific user (public only)
router.get('/user/:username', async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findOne({ username: req.params.username });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const insights = await Insight.find({
            user: user._id,
            visibility: 'public'
        }).populate('user', 'username displayName')
        .sort({ createdAt: -1 });

        res.json(insights);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Post a new insight (requires authentication)
router.post('/', auth, async (req, res) => {
    const { title, source, takeaway, tags, visibility } = req.body;

    const newInsight = new Insight({
        title,
        source,
        takeaway,
        tags,
        visibility,
        user: req.user._id
    });

    try {
        const saved = await newInsight.save();
        const populatedInsight = await Insight.findById(saved._id)
            .populate('user', 'username displayName');
        res.json(populatedInsight);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save insight' });
    }
});

// PUT (update) an existing insight (user can only update their own)
router.put('/:id', auth, async (req, res) => {
    const { title, source, takeaway, tags, visibility } = req.body;

    try {
        const insight = await Insight.findById(req.params.id);
        
        if (!insight) {
            return res.status(404).json({ error: 'Insight not found' });
        }

        // Check if user owns this insight
        if (insight.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this insight' });
        }

        const updatedInsight = await Insight.findByIdAndUpdate(
            req.params.id,
            { title, source, takeaway, tags, visibility },
            { new: true, runValidators: true }
        ).populate('user', 'username displayName');

        res.json(updatedInsight);
    } catch (err) {
        console.error('Error updating insight:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE an insight (user can only delete their own)
router.delete('/:id', auth, async (req, res) => {
    try {
        const insight = await Insight.findById(req.params.id);
        
        if (!insight) {
            return res.status(404).json({ error: 'Insight not found' });
        }

        // Check if user owns this insight
        if (insight.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this insight' });
        }

        await Insight.findByIdAndDelete(req.params.id);
        res.json({ message: 'Insight deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete insight' });
    }
});

module.exports = router;
