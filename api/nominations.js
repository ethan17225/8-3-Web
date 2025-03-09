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
    // Get all nominations
    try {
      const nominations = safeReadJsonFile('nominations.json');
      res.status(200).json(nominations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch nominations' });
    }
  } else if (req.method === 'POST') {
    // Add a new nomination
    try {
      const { name, achievement, imageUrl, id } = req.body;
      
      if (!name || !achievement) {
        return res.status(400).json({ error: 'Name and achievement are required' });
      }
      
      const nominations = safeReadJsonFile('nominations.json');
      // Use the provided ID if available, otherwise generate a new one
      const nominationId = id || 'nominated-' + Date.now();
      
      // Check if this nomination already exists (prevent duplicates)
      const existingIndex = nominations.findIndex(n => n.id === nominationId);
      
      // If it exists, update it instead of creating a new one
      if (existingIndex >= 0) {
        nominations[existingIndex] = {
          ...nominations[existingIndex],
          name,
          achievement,
          imageUrl: imageUrl || nominations[existingIndex].imageUrl,
          updated: new Date().toISOString()
        };
        
        if (safeWriteJsonFile('nominations.json', nominations)) {
          res.status(200).json(nominations[existingIndex]);
        } else {
          res.status(500).json({ error: 'Failed to update nomination' });
        }
      } else {
        // Otherwise add as a new nomination
        const newNomination = {
          id: nominationId,
          name,
          achievement,
          imageUrl: imageUrl || 'https://place-hold.it/400x300/e6e6fa/6a5acd?text=Inspiring+Woman&bold=true',
          date: new Date().toISOString()
        };
        
        nominations.push(newNomination);
        
        if (safeWriteJsonFile('nominations.json', nominations)) {
          res.status(201).json(newNomination);
        } else {
          res.status(500).json({ error: 'Failed to save nomination' });
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to process nomination' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
