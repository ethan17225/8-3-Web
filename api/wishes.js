const express = require('express');
const router = express.Router();
const { safeReadJsonFile, safeWriteJsonFile } = require('../utils/dataUtils');

// Get all wishes
router.get('/', (req, res) => {
  const wishes = safeReadJsonFile('wishes.json');
  res.json(wishes);
});

// Add a new wish
router.post('/', (req, res) => {
  const { message } = req.body;
  
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
});

module.exports = router;
