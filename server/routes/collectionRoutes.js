const express = require('express');
const router = express.Router();
const Collection = require('../models/collection');

// Create a new collection
router.post('/', async (req, res) => {
    const { name, description, visibility, insights } = req.body;

    try {
        const newCollection = new Collection({
            name,
            description,
            visibility,
            insights
        });

        const savedCollection = await newCollection.save();
        res.json(savedCollection);
    } catch (err) {
        console.error('Failed to create collection:', err);
        res.status(500).json({ error: 'Server error creating collection' });
    }
});

// Get all public collections
router.get('/public', async (req, res) => {
    try {
        const publicCollections = await Collection.find({ visibility: 'public' });
        res.json(publicCollections);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch public collections' });
    }
});

// Get a specific collection by ID (public only)
router.get('/:id', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id).populate('insights');
        if (!collection || collection.visibility !== 'public') {
            return res.status(404).json({ error: 'Collection not found or not public' });
        }
        res.json(collection);
    } catch (err) {
        console.error('Failed to fetch collection:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
