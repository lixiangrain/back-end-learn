const fs = require("fs").promises;
const path = require("path");

async function readDataFile(filename) {
  const filePath = path.join(__dirname, "../stage/data", filename);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, "[]");
      return [];
    }
    throw error;
  }
}

async function writeDataFile(filename, data) {
  const filePath = path.join(__dirname, "../stage/data", filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readDataFile, writeDataFile };