require('dotenv').config();

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const insightRoutes = require('./routes/insightRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/collections', collectionRoutes);

app.get('/', (req, res) => {
    res.send('InsightSync API is live');
});

console.log('Auth routes loaded:', authRoutes);
console.log('Insight routes loaded:', insightRoutes);
console.log('Collection routes loaded:', collectionRoutes);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
