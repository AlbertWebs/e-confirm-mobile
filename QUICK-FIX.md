# Quick Fix for Current Issues

## ✅ Issue 1: Gradle Lock - FIXED
The Gradle lock has been removed. The other Gradle process has been killed.

## ⚠️ Issue 2: ADB Not Found

### Quick Solution:
1. **Run the setup script:**
   ```powershell
   .\setup-android-env.ps1
   ```

2. **Or manually set environment variables:**
   ```powershell
   # For current session only
   $env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
   $env:PATH = "$env:ANDROID_HOME\platform-tools;$env:PATH"
   ```

3. **To make permanent (run as Administrator):**
   ```powershell
   [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk", "User")
   ```

### If Android Studio is not installed:
1. Download from: https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio > SDK Manager
4. Install:
   - Android SDK Platform 33
   - Android SDK Build-Tools
   - Android SDK Platform-Tools (includes ADB)
   - Android Emulator

## Issue 3: No Emulator Found

### Option 1: Create an Emulator
1. Open Android Studio
2. Tools > Device Manager
3. Create Device > Choose a device (e.g., Pixel 5)
4. Select a system image (e.g., API 33)
5. Finish

### Option 2: Use Physical Device
1. Enable Developer Options on your Android phone
2. Enable USB Debugging
3. Connect via USB
4. Run: `npm run android`

## Next Steps

1. **Stop all Gradle processes:**
   ```powershell
   cd android
   .\gradlew.bat --stop
   cd ..
   ```

2. **Try building again:**
   ```powershell
   npm run android
   ```

3. **If still having issues, clean build:**
   ```powershell
   cd android
   .\gradlew.bat clean
   cd ..
   npm run android
   ```

## Troubleshooting Commands

```powershell
# Check if ADB is accessible
adb version

# List connected devices/emulators
adb devices

# Check Android SDK location
echo $env:ANDROID_HOME

# Stop all Gradle daemons
cd android
.\gradlew.bat --stop
cd ..
```


