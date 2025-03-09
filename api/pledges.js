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
    // Get all pledges
    try {
      const pledges = safeReadJsonFile('pledges.json');
      res.status(200).json(pledges);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pledges' });
    }
  } else if (req.method === 'POST') {
    // Add a new pledge
    try {
      const { pledgeId, text } = req.body;
      
      if (!pledgeId || !text) {
        return res.status(400).json({ error: 'PledgeId and text are required' });
      }
      
      const pledges = safeReadJsonFile('pledges.json');
      const newPledge = {
        id: Date.now(),
        pledgeId,
        text,
        date: new Date().toISOString()
      };
      
      pledges.push(newPledge);
      if (safeWriteJsonFile('pledges.json', pledges)) {
        res.status(201).json({
          pledge: newPledge,
          totalPledges: pledges.length
        });
      } else {
        res.status(500).json({ error: 'Failed to save pledge' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to process pledge' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
