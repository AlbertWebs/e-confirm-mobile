// Patch script to fix Windows node:sea path issue
const fs = require('fs');
const path = require('path');

function findAndPatchFile(dir, pattern) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      try {
        findAndPatchFile(fullPath, pattern);
      } catch (e) {
        // Skip directories we can't read
      }
    } else if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.js'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('node:sea')) {
          console.log(`Found: ${fullPath}`);
          const newContent = content.replace(/node:sea/g, 'node_sea');
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`✓ Patched: ${fullPath}`);
          return true;
        }
      } catch (e) {
        // Skip files we can't read
      }
    }
  }
  return false;
}

const expoCliPath = path.join(__dirname, 'node_modules', '@expo', 'cli');
if (fs.existsSync(expoCliPath)) {
  console.log('Searching for node:sea in Expo CLI...');
  findAndPatchFile(expoCliPath, 'node:sea');
  console.log('Done!');
} else {
  console.log('Expo CLI not found. Run npm install first.');
}

