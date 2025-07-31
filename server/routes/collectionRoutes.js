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
        const publicCollections = await Collection.find({ visibility: 'public' }).populate('insights');
        res.json(publicCollections);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch public collections' });
    }
});

// Get all collections (for management)
router.get('/', async (req, res) => {
    try {
        const collections = await Collection.find().populate('insights');
        res.json(collections);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch collections' });
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

// Update a collection
router.put('/:id', async (req, res) => {
    const { name, description, visibility, insights } = req.body;

    try {
        const updatedCollection = await Collection.findByIdAndUpdate(
            req.params.id,
            { name, description, visibility, insights },
            { new: true, runValidators: true }
        ).populate('insights');

        if (!updatedCollection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        res.json(updatedCollection);
    } catch (err) {
        console.error('Error updating collection:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a collection
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Collection.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        res.json({ message: 'Collection deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete collection' });
    }
});

// Add insight to collection
router.post('/:id/insights', async (req, res) => {
    const { insightId } = req.body;

    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        if (!collection.insights.includes(insightId)) {
            collection.insights.push(insightId);
            await collection.save();
        }

        const updatedCollection = await Collection.findById(req.params.id).populate('insights');
        res.json(updatedCollection);
    } catch (err) {
        console.error('Error adding insight to collection:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove insight from collection
router.delete('/:id/insights/:insightId', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        collection.insights = collection.insights.filter(
            insight => insight.toString() !== req.params.insightId
        );
        await collection.save();

        const updatedCollection = await Collection.findById(req.params.id).populate('insights');
        res.json(updatedCollection);
    } catch (err) {
        console.error('Error removing insight from collection:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
