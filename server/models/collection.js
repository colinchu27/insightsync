const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    visibility: { type: String, enum: ['private', 'public'], default: 'public' },
    insights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Insight' }]
}, { timestamps: true });

module.exports = mongoose.model('Collection', CollectionSchema);
