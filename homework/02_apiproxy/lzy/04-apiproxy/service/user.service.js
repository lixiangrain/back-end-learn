const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const userStage = require("../stage/user.stage");
const config = require("../config/jwt.config");

async function registerUser({ username, password }) {
  const existingUser = await userStage.getUserByUsername(username);
  if (existingUser) {
    throw new Error("用户名已存在");
  }
  const hashedPassword = await bcrypt.hash(password, 8);
  const userData = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  await userStage.saveUser(userData);
  const token = jwt.sign({ id: userData.id, username }, config.secretKey, { expiresIn: "15m" });
  return token;
}

async function loginUser({ username, password }) {
  const user = await userStage.getUserByUsername(username);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id, username }, config.secretKey, { expiresIn: "15m" });
    return token;
  }
  return null;
}

module.exports = { registerUser, loginUser };