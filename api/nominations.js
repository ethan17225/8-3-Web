const express = require('express');
const router = express.Router();
const { safeReadJsonFile, safeWriteJsonFile } = require('../utils/dataUtils');

// Get all nominations
router.get('/', (req, res) => {
  const nominations = safeReadJsonFile('nominations.json');
  res.json(nominations);
});

// Add a new nomination
router.post('/', (req, res) => {
  const { name, achievement, imageUrl, id } = req.body;
  
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
  }
  
  if (safeWriteJsonFile('nominations.json', nominations)) {
    const savedNomination = existingIndex >= 0 ? nominations[existingIndex] : nominations[nominations.length - 1];
    res.status(201).json(savedNomination);
  } else {
    res.status(500).json({ error: 'Failed to save nomination' });
  }
});

module.exports = router;
