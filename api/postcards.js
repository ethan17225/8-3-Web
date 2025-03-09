const { safeReadJsonFile, safeWriteJsonFile } = require('../utils/dataUtils');

// Serverless function handler for Vercel
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Get all postcards
    try {
      const postcards = safeReadJsonFile('postcards.json');
      res.status(200).json(postcards);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch postcards' });
    }
  } else if (req.method === 'POST') {
    // Add a new postcard
    try {
      const { greeting, message, signature, bg } = req.body;
      
      if (!greeting || !message) {
        return res.status(400).json({ error: 'Greeting and message are required' });
      }
      
      const postcards = safeReadJsonFile('postcards.json');
      const newPostcard = {
        id: Date.now(),
        greeting,
        message,
        signature,
        bg,
        timestamp: new Date().toISOString()
      };
      
      postcards.push(newPostcard);
      if (safeWriteJsonFile('postcards.json', postcards)) {
        res.status(201).json(newPostcard);
      } else {
        res.status(500).json({ error: 'Failed to save postcard' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to process postcard' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
