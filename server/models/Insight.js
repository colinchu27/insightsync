const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    title: String,
    source: String,
    takeaway: String,
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Insight', insightSchema);
