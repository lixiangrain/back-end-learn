const fs = require('fs/promises');
const path = require('path');
const dataDir = path.join(__dirname, '../stage/data');

async function readDataFile(filename) {
  try {
    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });
    
    // Read file
    const filePath = path.join(dataDir, filename);
    let data;
    
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      data = fileData ? JSON.parse(fileData) : [];
    } catch (error) {
      // If file doesn't exist or has invalid JSON, return empty array
      data = [];
    }
    
    return data;
  } catch (error) {
    throw new Error(`Failed to read data file: ${error.message}`);
  }
}

async function writeDataFile(filename, data) {
  try {
    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });
    
    // Write file
    const filePath = path.join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Failed to write data file: ${error.message}`);
  }
}

module.exports = {
  readDataFile,
  writeDataFile
};