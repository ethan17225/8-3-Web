const express = require('express');
const router = express.Router();
const { safeReadJsonFile, safeWriteJsonFile } = require('../utils/dataUtils');

// Get all pledges
router.get('/', (req, res) => {
  const pledges = safeReadJsonFile('pledges.json');
  res.json(pledges);
});

// Add a new pledge
router.post('/', (req, res) => {
  const { pledgeId, text } = req.body;
  
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
});

module.exports = router;
