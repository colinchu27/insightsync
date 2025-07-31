const express = require('express');
const router = express.Router();
const Collection = require('../models/collection');
const { auth, optionalAuth } = require('../middleware/auth');

// Create a new collection (requires authentication)
router.post('/', auth, async (req, res) => {
    const { name, description, visibility, insights } = req.body;

    try {
        const newCollection = new Collection({
            name,
            description,
            visibility,
            insights,
            user: req.user._id
        });

        const savedCollection = await newCollection.save();
        const populatedCollection = await Collection.findById(savedCollection._id)
            .populate('user', 'username displayName')
            .populate('insights');
        res.json(populatedCollection);
    } catch (err) {
        console.error('Failed to create collection:', err);
        res.status(500).json({ error: 'Server error creating collection' });
    }
});

// Get all public collections (for discovery)
router.get('/public', async (req, res) => {
    try {
        const publicCollections = await Collection.find({ visibility: 'public' })
            .populate('user', 'username displayName')
            .populate('insights')
            .sort({ createdAt: -1 });
        res.json(publicCollections);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch public collections' });
    }
});

// Get all collections (user's own + public from others)
router.get('/', optionalAuth, async (req, res) => {
    try {
        let query = { visibility: 'public' };
        
        // If user is authenticated, include their private collections
        if (req.user) {
            query = {
                $or: [
                    { visibility: 'public' },
                    { user: req.user._id }
                ]
            };
        }

        const collections = await Collection.find(query)
            .populate('user', 'username displayName')
            .populate('insights')
            .sort({ createdAt: -1 });
        res.json(collections);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
});

// Get user's own collections only
router.get('/my', auth, async (req, res) => {
    try {
        const collections = await Collection.find({ user: req.user._id })
            .populate('user', 'username displayName')
            .populate('insights')
            .sort({ createdAt: -1 });
        res.json(collections);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user collections' });
    }
});

// Get collections by specific user (public only)
router.get('/user/:username', async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findOne({ username: req.params.username });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const collections = await Collection.find({
            user: user._id,
            visibility: 'public'
        })
        .populate('user', 'username displayName')
        .populate('insights')
        .sort({ createdAt: -1 });

        res.json(collections);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user collections' });
    }
});

// Get a specific collection by ID (public only, or user's own)
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('user', 'username displayName')
            .populate('insights');
            
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        // Check if user can access this collection
        const canAccess = collection.visibility === 'public' || 
                         (req.user && collection.user._id.toString() === req.user._id.toString());

        if (!canAccess) {
            return res.status(404).json({ error: 'Collection not found or not accessible' });
        }

        res.json(collection);
    } catch (err) {
        console.error('Failed to fetch collection:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a collection (user can only update their own)
router.put('/:id', auth, async (req, res) => {
    const { name, description, visibility, insights } = req.body;

    try {
        const collection = await Collection.findById(req.params.id);
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        // Check if user owns this collection
        if (collection.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this collection' });
        }

        const updatedCollection = await Collection.findByIdAndUpdate(
            req.params.id,
            { name, description, visibility, insights },
            { new: true, runValidators: true }
        )
        .populate('user', 'username displayName')
        .populate('insights');

        res.json(updatedCollection);
    } catch (err) {
        console.error('Error updating collection:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a collection (user can only delete their own)
router.delete('/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        // Check if user owns this collection
        if (collection.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this collection' });
        }

        await Collection.findByIdAndDelete(req.params.id);
        res.json({ message: 'Collection deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete collection' });
    }
});

// Add insight to collection (user can only add to their own collections)
router.post('/:id/insights', auth, async (req, res) => {
    const { insightId } = req.body;

    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        // Check if user owns this collection
        if (collection.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to modify this collection' });
        }

        if (!collection.insights.includes(insightId)) {
            collection.insights.push(insightId);
            await collection.save();
        }

        const updatedCollection = await Collection.findById(req.params.id)
            .populate('user', 'username displayName')
            .populate('insights');
        res.json(updatedCollection);
    } catch (err) {
        console.error('Error adding insight to collection:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove insight from collection (user can only remove from their own collections)
router.delete('/:id/insights/:insightId', auth, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        // Check if user owns this collection
        if (collection.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to modify this collection' });
        }

        collection.insights = collection.insights.filter(
            insight => insight.toString() !== req.params.insightId
        );
        await collection.save();

        const updatedCollection = await Collection.findById(req.params.id)
            .populate('user', 'username displayName')
            .populate('insights');
        res.json(updatedCollection);
    } catch (err) {
        console.error('Error removing insight from collection:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
