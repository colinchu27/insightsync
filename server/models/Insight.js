// models/Insight.js (or wherever your schema is)
const mongoose = require('mongoose');

const InsightSchema = new mongoose.Schema({
    title: String,
    source: String,
    takeaway: String,
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    visibility: {
        type: String,
        enum: ['private', 'public'],
        default: 'public',
    }
});

module.exports = mongoose.model('Insight', InsightSchema);
