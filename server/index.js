const express = require('express');
const cors = require('cors');
require('dotenv').config();

const insightRoutes = require('./routes/insightRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use('/api/insights', insightRoutes);

app.get('/', (req, res) => {
    res.send('InsightSync API is live');
});

console.log('Insight routes loaded:', insightRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
