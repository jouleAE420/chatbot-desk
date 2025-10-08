const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
const jsonData = process.argv[3];

if (!filePath || !jsonData) {
  console.error('Usage: node write-json.js <file_path> <json_data>');
  process.exit(1);
}

// To prevent security issues with path traversal, resolve the path and check if it's within the expected directory.
const resolvedPath = path.resolve(filePath);
const dataDir = path.resolve(__dirname);

if (!resolvedPath.startsWith(dataDir)) {
    console.error('Error: File path is outside the allowed directory.');
    process.exit(1);
}

fs.writeFileSync(resolvedPath, jsonData);
