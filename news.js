const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        const query = req.query.q || 'coffee';
        const page = req.query.page || 1;
        
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: query,
                sortBy: 'publishedAt',
                apiKey: apiKey,
                page: page
            }
        });
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};