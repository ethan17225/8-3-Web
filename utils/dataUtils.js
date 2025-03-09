const fs = require('fs');
const path = require('path');

// Determine data directory based on environment
const isVercel = process.env.VERCEL === '1';
// For Vercel, use /tmp directory for temporary storage during function execution
// For local development, use the data directory in the project
const dataDir = isVercel 
  ? path.join('/tmp', 'data')
  : path.join(process.cwd(), 'data');

/**
 * Initialize all data files with default content if needed
 */
function initializeDataFiles() {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('Data directory created successfully');
    } catch (err) {
      console.error('Error creating data directory:', err);
    }
  }

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
}

/**
 * Generate default data for each file type
 */
function getDefaultData(fileType) {
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
}

/**
 * Read JSON file safely with error handling
 */
function safeReadJsonFile(fileName) {
  const filePath = path.join(dataDir, fileName);
  try {
    // Create directory if it doesn't exist (for Vercel tmp storage)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Create file with default data if it doesn't exist
    if (!fs.existsSync(filePath)) {
      const defaultData = getDefaultData(fileName);
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content || content.trim() === '') {
      const defaultData = getDefaultData(fileName);
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading JSON from ${filePath}:`, error.message);
    return getDefaultData(fileName);
  }
}

/**
 * Write JSON file safely with error handling
 */
function safeWriteJsonFile(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  try {
    // Create directory if it doesn't exist (for Vercel tmp storage)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
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
}

module.exports = {
  initializeDataFiles,
  getDefaultData,
  safeReadJsonFile,
  safeWriteJsonFile
};
