const fs = require('fs/promises');
const path = require('path');
const fileUtils = require('../utils/file.utils');

async function saveUser(userData) {
  try {
    // Read existing users
    const users = await fileUtils.readDataFile('users.json');
    
    // Add new user
    users.push(userData);
    
    // Write updated users back to file
    await fileUtils.writeDataFile('users.json', users);
    
    return userData;
  } catch (error) {
    throw new Error(`Failed to save user: ${error.message}`);
  }
}

async function getUserByUsername(username) {
  try {
    // Read existing users
    const users = await fileUtils.readDataFile('users.json');
    
    // Find user by username
    return users.find(user => user.username === username) || null;
  } catch (error) {
    throw new Error(`Failed to get user by username: ${error.message}`);
  }
}

async function getUserById(id) {
  try {
    // Read existing users
    const users = await fileUtils.readDataFile('users.json');
    
    // Find user by ID
    return users.find(user => user.id === id) || null;
  } catch (error) {
    throw new Error(`Failed to get user by ID: ${error.message}`);
  }
}

module.exports = {
  saveUser,
  getUserByUsername,
  getUserById
};