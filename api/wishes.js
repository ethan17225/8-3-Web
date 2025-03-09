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
    // Get all wishes
    try {
      const wishes = safeReadJsonFile('wishes.json');
      res.status(200).json(wishes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wishes' });
    }
  } else if (req.method === 'POST') {
    // Add a new wish
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const wishes = safeReadJsonFile('wishes.json');
      const newWish = {
        id: Date.now(),
        message,
        date: new Date().toISOString()
      };
      
      wishes.push(newWish);
      if (safeWriteJsonFile('wishes.json', wishes)) {
        res.status(201).json(newWish);
      } else {
        res.status(500).json({ error: 'Failed to save wish' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to process wish' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
