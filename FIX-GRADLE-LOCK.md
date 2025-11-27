# Fixing Gradle Lock Issues

## Problem
```
Timeout waiting to lock Generated Gradle JARs cache
It is currently in use by another Gradle instance.
```

## Solutions

### Quick Fix (Current Session)
1. **Kill the Gradle process:**
   ```powershell
   Get-Process | Where-Object {$_.ProcessName -like "*java*" -or $_.ProcessName -like "*gradle*"} | Stop-Process -Force
   ```

2. **Remove the lock file:**
   ```powershell
   Remove-Item "$env:USERPROFILE\.gradle\caches\8.0.1\generated-gradle-jars\generated-gradle-jars.lock" -Force
   ```

3. **Stop all Gradle daemons:**
   ```powershell
   cd android
   .\gradlew --stop
   cd ..
   ```

### Permanent Fix
1. **Close all Android Studio instances**
2. **Close all terminals running Gradle**
3. **Kill all Java processes:**
   ```powershell
   Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

4. **Clean Gradle cache (if needed):**
   ```powershell
   Remove-Item "$env:USERPROFILE\.gradle\caches" -Recurse -Force
   ```
   ⚠️ **Warning**: This will delete all Gradle caches and require re-downloading dependencies

### Alternative: Use Gradle Wrapper with Stop
```powershell
cd android
.\gradlew --stop
cd ..
npm run android
```

## Prevention
- Always stop Gradle daemons before closing Android Studio
- Don't run multiple Gradle builds simultaneously
- Use `.\gradlew --stop` to cleanly stop all daemons


