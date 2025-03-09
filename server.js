const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { initializeDataFiles } = require('./utils/dataUtils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Initialize data files if running as a full server (not as serverless functions)
if (process.env.NODE_ENV !== 'production') {
  initializeDataFiles();
}

// Get web page - static files are automatically served in production
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes - redirect to API folder handlers in production
// For local development, we'll import these routes directly
if (process.env.NODE_ENV !== 'production') {
  // Wishes routes
  app.use('/api/wishes', require('./api/wishes'));
  
  // Pledges routes
  app.use('/api/pledges', require('./api/pledges'));
  
  // Nominations routes
  app.use('/api/nominations', require('./api/nominations'));
  
  // Postcards routes
  app.use('/api/postcards', require('./api/postcards'));
}

// Start the server if running directly (not as serverless functions)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for serverless use
module.exports = app;
