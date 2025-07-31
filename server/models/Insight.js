const mongoose = require('mongoose');

const InsightSchema = new mongoose.Schema({
    title: String,
    source: String,
    takeaway: String,
    tags: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
