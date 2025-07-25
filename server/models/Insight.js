const mongoose = require('mongoose');

const InsightSchema = new mongoose.Schema({
    title: { type: String, required: true },
    source: { type: String, required: true },
    takeaway: { type: String, required: true },
    tags: [String]
});

module.exports = mongoose.model('Insight', InsightSchema);
