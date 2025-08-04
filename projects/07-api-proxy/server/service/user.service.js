const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt.config');
const userStage = require('../stage/user.stage');

async function registerUser(userData) {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 8);
    
    // Create user object with hashed password
    const user = {
      ...userData,
      id: Date.now().toString(), // Simple ID generation
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Save user to database
    const savedUser = await userStage.saveUser(user);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        username: savedUser.username, 
        id: savedUser.id 
      }, 
      config.secretKey, 
      { expiresIn: config.expiresIn }
    );
    
    // Return user with token
    return {
      ...savedUser,
      token
    };
  } catch (error) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
}

async function validateUser(username, password) {
  try {
    // Get user from database
    const user = await userStage.getUserByUsername(username);
    
    // Check if user exists and password is valid
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          username: user.username, 
          id: user.id 
        }, 
        config.secretKey, 
        { expiresIn: config.expiresIn }
      );
      
      // Return user with token
      return {
        ...user,
        token
      };
    }
    
    return null;
  } catch (error) {
    throw new Error(`Failed to validate user: ${error.message}`);
  }
}

module.exports = {
  registerUser,
  validateUser
};