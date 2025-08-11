const fileUtils = require("../utils/file.utils");

async function saveUser(userData) {
  const users = await fileUtils.readDataFile("users.json");
  users.push(userData);
  await fileUtils.writeDataFile("users.json", users);
  return userData;
}

async function getUserByUsername(username) {
  const users = await fileUtils.readDataFile("users.json");
  return users.find((user) => user.username === username) || null;
}

module.exports = { saveUser, getUserByUsername };