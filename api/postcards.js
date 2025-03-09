const express = require('express');
const router = express.Router();
const { safeReadJsonFile, safeWriteJsonFile } = require('../utils/dataUtils');

// Get all postcards
router.get('/', (req, res) => {
  const postcards = safeReadJsonFile('postcards.json');
  res.json(postcards);
});

// Add a new postcard
router.post('/', (req, res) => {
  const { greeting, message, signature, bg } = req.body;
  
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
});

module.exports = router;
