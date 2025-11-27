# Starting the Mobile App on Windows

## Quick Fix for node:sea Error

If you encounter the `node:sea` directory error on Windows, use one of these solutions:

### Solution 1: Use Expo Go App (Recommended)

1. Start the server:
   ```powershell
   npm start
   ```

2. When you see the QR code, scan it with the **Expo Go** app on your phone
   - Download Expo Go from App Store (iOS) or Play Store (Android)
   - This bypasses local file system issues

### Solution 2: Use WSL (Windows Subsystem for Linux)

If you have WSL installed:

```bash
# In WSL terminal
cd /mnt/c/projects/econfirm/mobile-app
npm start
```

### Solution 3: Environment Variable Workaround

```powershell
$env:EXPO_NO_NODE_SHIMS="1"
npm start
```

### Solution 4: Clear Everything and Reinstall

```powershell
# Remove all caches
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm cache clean --force

# Reinstall
npm install

# Start
npm start
```

## Current Status

- ✅ Expo SDK 49 (downgraded from 50 to avoid Windows issues)
- ✅ Pre-start script to create directory structure
- ✅ Metro config with Windows fixes
- ⚠️  May still need to use Expo Go app or WSL

## Recommended Approach

**Use Expo Go app on your phone** - it's the easiest and most reliable way to test the mobile app on Windows.

