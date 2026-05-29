const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your frontend can talk to this server
app.use(cors());

app.get('/api/news', async (req, res) => {
    try {
        console.log(`Fetching news for query: ${req.query.q || 'coffee'}`);
        const apiKey = process.env.NEWS_API_KEY;
        const query = req.query.q || 'coffee';
        
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: query,
                sortBy: 'publishedAt',
                apiKey: apiKey
            }
        });
        
        console.log(`Successfully fetched ${response.data.articles.length} articles.`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});