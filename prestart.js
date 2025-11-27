// Pre-start script to fix Windows path issues
const fs = require('fs');
const path = require('path');

// Create .expo directory structure with safe names
const expoDir = path.join(__dirname, '.expo');
const metroDir = path.join(expoDir, 'metro');
const externalsDir = path.join(metroDir, 'externals');

// Create directories if they don't exist
[expoDir, metroDir, externalsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Pre-start: Created .expo directory structure');

