# Troubleshooting Guide

## Windows Path Error (node:sea)

If you encounter the error:
```
Error: ENOENT: no such file or directory, mkdir 'C:\projects\econfirm\mobile-app\.expo\metro\externals\node:sea'
```

### Solution 1: Clear Cache and Restart

```powershell
# Remove .expo cache
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue

# Remove node_modules cache
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Restart Expo
npm start
```

### Solution 2: Use WSL (Windows Subsystem for Linux)

If the issue persists, consider using WSL:

```bash
# In WSL terminal
cd /mnt/c/projects/econfirm/mobile-app
npm start
```

### Solution 3: Update Node.js

Make sure you're using Node.js LTS version (18.x or 20.x):

```powershell
node --version
```

If outdated, download from [nodejs.org](https://nodejs.org/)

### Solution 4: Use Expo Go App

Instead of running locally, you can:
1. Start the server: `npm start`
2. Scan QR code with Expo Go app on your phone
3. This bypasses local file system issues

## Other Common Issues

### API Connection Issues

**Problem**: Can't connect to Laravel backend

**Solution**:
1. Make sure Laravel is running: `php artisan serve --host=0.0.0.0 --port=8000`
2. Update `src/config/api.js` with your computer's IP address (not localhost)
3. Ensure phone and computer are on the same network
4. Check Windows Firewall settings

### Metro Bundler Issues

**Problem**: Metro bundler won't start

**Solution**:
```powershell
# Clear all caches
npm start -- --reset-cache

# Or manually
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

### Port Already in Use

**Problem**: Port 8081 or 19000 already in use

**Solution**:
```powershell
# Kill process on port 8081
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Or use different port
npx expo start --port 8082
```

## Getting Help

If issues persist:
1. Check Expo documentation: https://docs.expo.dev
2. Check React Native documentation: https://reactnative.dev
3. Check Laravel API is accessible: `curl http://YOUR_IP:8000/api/ping`


