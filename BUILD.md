# Quick Build Guide

## Quick Commands

### Web Build
```bash
npm run web:build
```
Output: `web-build/` directory ready for deployment

### Android Build
```bash
# APK for direct installation
npm run build:android

# AAB for Google Play Store
npm run build:android:bundle
```

### iOS Build
Open Xcode and use Product → Archive

### Clean Builds
```bash
npm run clean          # Clean all
npm run clean:android  # Clean Android only
npm run clean:ios      # Clean iOS only
```

## Production Build Checklist

### Before Building

- [ ] Update version numbers in:
  - `package.json` (version)
  - `android/app/build.gradle` (versionCode, versionName)
  - `ios/TempProject/Info.plist` (CFBundleShortVersionString, CFBundleVersion)

- [ ] Verify API URL is correct in `src/config/api.js`
- [ ] Test app functionality on development build
- [ ] Review and update app name/icon if needed

### Web Deployment

1. Build: `npm run web:build`
2. Test locally: Serve `web-build/` directory
3. Deploy to hosting service

### Android Deployment

1. **Generate Release Keystore** (first time only):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 \
     -keystore android/app/my-release-key.keystore \
     -alias my-key-alias \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing** in `android/app/build.gradle`

3. **Build release**:
   ```bash
   npm run build:android:bundle
   ```

4. **Upload to Google Play Console**

### iOS Deployment

1. Open `ios/TempProject.xcworkspace` in Xcode
2. Configure signing & certificates
3. Product → Archive
4. Upload to App Store Connect

## Build Scripts

### Automated Build (Linux/Mac)
```bash
chmod +x build.sh
./build.sh
```

### Automated Build (Windows)
```powershell
.\build.ps1
```

## Troubleshooting

**Web build fails:**
- Clear cache: `npm run clean`
- Check Node version: `node -v` (should be 16+)

**Android build fails:**
- Clean: `cd android && ./gradlew clean`
- Check Java version: `java -version` (should be 11+)
- Verify Android SDK is installed

**iOS build fails:**
- Run: `cd ios && pod install`
- Check Xcode version compatibility
- Verify signing certificates

## Next Steps

After building, see `DEPLOYMENT.md` for detailed deployment instructions.

