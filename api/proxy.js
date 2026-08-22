// api/proxy.js - Node.js Serverless Function for Vercel
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Enable CORS so your GitHub Pages frontend can securely read the results
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing target URL parameter.' });
    }

    // Security Gate: Only fetch from official CAAM eclipse portal
    if (!url.startsWith('https://eclipse.caam.gov.my/')) {
        return res.status(400).json({ error: 'Access restricted to official CAAM domain only.' });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'CAAM Portal returned HTTP ' + response.status });
        }

        const html = await response.text();
        return res.status(200).send(html);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch license data: ' + error.message });
    }
};