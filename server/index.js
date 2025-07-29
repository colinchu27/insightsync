require('dotenv').config();

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const insightRoutes = require('./routes/insightRoutes');

const collectionRoutes = require('./routes/collectionRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use('/api/insights', insightRoutes);

app.use('/api/collections', collectionRoutes);

app.get('/', (req, res) => {
    res.send('InsightSync API is live');
});

console.log('Insight routes loaded:', insightRoutes);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
