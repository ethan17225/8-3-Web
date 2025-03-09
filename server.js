const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Data directory created successfully');
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// Generate initial data with defaults
const getDefaultData = (fileType) => {
  switch(fileType) {
    case 'wishes.json':
      // 3 default wishes with staggered timestamps
      return [
        {
          id: Date.now() - 7200000, // 2 hours ago
          message: "Happy Women's Day to all the incredible women who inspire us daily!",
          date: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: Date.now() - 3600000, // 1 hour ago
          message: "To my mom, sister, and all women in my life - thank you for your strength and love!",
          date: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: Date.now() - 1800000, // 30 minutes ago
          message: "Celebrating the achievements and resilience of women everywhere!",
          date: new Date(Date.now() - 1800000).toISOString()
        }
      ];
    case 'pledges.json':
      // Generate 83 default pledges for International Women's Day (8/3)
      const pledges = [];
      const pledgeTypes = [
        { id: 'mentor', text: 'Mentor a Woman' },
        { id: 'amplify', text: 'Amplify Women\'s Voices' },
        { id: 'educate', text: 'Educate Yourself' },
        { id: 'support', text: 'Support Women-Owned Businesses' }
      ];
      
      for (let i = 0; i < 83; i++) {
        const pledgeType = pledgeTypes[i % pledgeTypes.length];
        pledges.push({
          id: Date.now() - (i * 100000),
          pledgeId: pledgeType.id,
          text: pledgeType.text,
          date: new Date(Date.now() - (i * 100000)).toISOString()
        });
      }
      return pledges;
    default:
      return [];
  }
};

// Initialize or repair data files
const dataFiles = ['wishes.json', 'pledges.json', 'nominations.json', 'postcards.json'];

dataFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`Creating new ${file} file with default data`);
      const defaultData = getDefaultData(file);
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return;
    }
    
    // If file exists, verify it contains valid JSON
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // If file is empty, initialize with default data
      if (!content || content.trim() === '') {
        console.log(`File ${file} is empty, initializing with default data`);
        const defaultData = getDefaultData(file);
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
        return;
      }
      
      // Try parsing the content to validate JSON
      JSON.parse(content);
      console.log(`${file} validation successful`);
    } catch (parseError) {
      console.error(`Invalid JSON in ${file}, repairing with default data:`, parseError.message);
      const defaultData = getDefaultData(file);
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
  } catch (fileError) {
    console.error(`Error handling ${file}:`, fileError);
    // Try to recover by writing default data
    try {
      const defaultData = getDefaultData(file);
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    } catch (writeError) {
      console.error(`Failed to repair ${file}:`, writeError);
    }
  }
});

// Safe JSON file reading helper
const safeReadJsonFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content || content.trim() === '') {
      return [];
    }
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading JSON from ${filePath}:`, error.message);
    return [];
  }
};

// Safe JSON file writing helper
const safeWriteJsonFile = (filePath, data) => {
  try {
    // Write to temporary file first to prevent corruption
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    
    // Then rename to actual file (atomic operation)
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing JSON to ${filePath}:`, error.message);
    return false;
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// API Routes for data storage

// Get wishes
app.get('/api/wishes', (req, res) => {
  const wishesPath = path.join(dataDir, 'wishes.json');
  const wishes = safeReadJsonFile(wishesPath);
  res.json(wishes);
});

// Add a new wish
app.post('/api/wishes', (req, res) => {
  const { message } = req.body;
  const wishesPath = path.join(dataDir, 'wishes.json');
  
  const wishes = safeReadJsonFile(wishesPath);
  const newWish = {
    id: Date.now(),
    message,
    date: new Date().toISOString()
  };
  
  wishes.push(newWish);
  if (safeWriteJsonFile(wishesPath, wishes)) {
    res.status(201).json(newWish);
  } else {
    res.status(500).json({ error: 'Failed to save wish' });
  }
});

// Get pledges
app.get('/api/pledges', (req, res) => {
  const pledgesPath = path.join(dataDir, 'pledges.json');
  const pledges = safeReadJsonFile(pledgesPath);
  res.json(pledges);
});

// Add a new pledge
app.post('/api/pledges', (req, res) => {
  const { pledgeId, text } = req.body;
  const pledgesPath = path.join(dataDir, 'pledges.json');
  
  const pledges = safeReadJsonFile(pledgesPath);
  const newPledge = {
    id: Date.now(),
    pledgeId,
    text,
    date: new Date().toISOString()
  };
  
  pledges.push(newPledge);
  if (safeWriteJsonFile(pledgesPath, pledges)) {
    res.status(201).json({
      pledge: newPledge,
      totalPledges: pledges.length
    });
  } else {
    res.status(500).json({ error: 'Failed to save pledge' });
  }
});

// Get nominations
app.get('/api/nominations', (req, res) => {
  const nominationsPath = path.join(dataDir, 'nominations.json');
  const nominations = safeReadJsonFile(nominationsPath);
  res.json(nominations);
});

// Add a new nomination
app.post('/api/nominations', (req, res) => {
  const { name, achievement, imageUrl, id } = req.body;
  const nominationsPath = path.join(dataDir, 'nominations.json');
  
  const nominations = safeReadJsonFile(nominationsPath);
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
  
  if (safeWriteJsonFile(nominationsPath, nominations)) {
    const savedNomination = existingIndex >= 0 ? nominations[existingIndex] : nominations[nominations.length - 1];
    res.status(201).json(savedNomination);
  } else {
    res.status(500).json({ error: 'Failed to save nomination' });
  }
});

// Get postcards
app.get('/api/postcards', (req, res) => {
  const postcardsPath = path.join(dataDir, 'postcards.json');
  const postcards = safeReadJsonFile(postcardsPath);
  res.json(postcards);
});

// Add a new postcard
app.post('/api/postcards', (req, res) => {
  const { greeting, message, signature, bg } = req.body;
  const postcardsPath = path.join(dataDir, 'postcards.json');
  
  const postcards = safeReadJsonFile(postcardsPath);
  const newPostcard = {
    id: Date.now(),
    greeting,
    message,
    signature,
    bg,
    timestamp: new Date().toISOString()
  };
  
  postcards.push(newPostcard);
  if (safeWriteJsonFile(postcardsPath, postcards)) {
    res.status(201).json(newPostcard);
  } else {
    res.status(500).json({ error: 'Failed to save postcard' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
