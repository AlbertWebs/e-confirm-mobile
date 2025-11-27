# Install Java 11+ for React Native

## Current Issue
Your system has **Java 8** installed, but React Native 0.72 requires **Java 11 or higher**.

## Solution: Install Java 11 or 17

### Option 1: Install Temurin JDK 17 (Recommended)

1. **Download:**
   - Visit: https://adoptium.net/temurin/releases/
   - Select: **JDK 17** (LTS)
   - Platform: **Windows x64**
   - Download the installer (.msi)

2. **Install:**
   - Run the installer
   - Choose "Set JAVA_HOME variable" during installation
   - Default location: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`

3. **Verify:**
   ```powershell
   java -version
   ```
   Should show: `openjdk version "17.x.x"`

### Option 2: Use Android Studio's Bundled JDK

Android Studio comes with JDK 11. You can use it:

1. **Find Android Studio JDK:**
   - Usually at: `C:\Program Files\Android\Android Studio\jbr`
   - Or: `C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\jbr`

2. **Set JAVA_HOME:**
   ```powershell
   # For current session
   $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
   
   # To make permanent (run as Administrator)
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
   ```

3. **Add to PATH:**
   ```powershell
   $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
   ```

### Option 3: Install Multiple Java Versions

You can have both Java 8 and Java 17 installed:

1. Install Java 17 (as in Option 1)
2. Set JAVA_HOME to point to Java 17
3. Keep Java 8 for other projects if needed

## After Installing Java 11+

1. **Restart your terminal/PowerShell**

2. **Verify Java version:**
   ```powershell
   java -version
   ```

3. **Set JAVA_HOME (if not set automatically):**
   ```powershell
   # Check current JAVA_HOME
   echo $env:JAVA_HOME
   
   # Set JAVA_HOME (replace path with your actual JDK path)
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot"
   
   # Make permanent (run as Administrator)
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot", "User")
   ```

4. **Update PATH:**
   ```powershell
   $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
   ```

5. **Try building again:**
   ```powershell
   cd android
   .\gradlew.bat clean
   cd ..
   npm run android
   ```

## Quick Check Commands

```powershell
# Check Java version
java -version

# Check JAVA_HOME
echo $env:JAVA_HOME

# Check if Java is in PATH
where java

# List all Java installations
Get-ChildItem "C:\Program Files\Java" -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files\Eclipse Adoptium" -ErrorAction SilentlyContinue
```

## Troubleshooting

### "java: command not found"
- Java is not in PATH
- Add `%JAVA_HOME%\bin` to your PATH environment variable

### "Unsupported class file major version"
- Gradle is still using Java 8
- Set JAVA_HOME to Java 11+
- Restart terminal

### Multiple Java versions
- Use `JAVA_HOME` to specify which one to use
- Or use Android Studio's bundled JDK

## Summary

**Current:** Java 8 ❌  
**Required:** Java 11 or 17 ✅  
**Action:** Install Java 17 from https://adoptium.net/

After installation, restart your terminal and try `npm run android` again!


