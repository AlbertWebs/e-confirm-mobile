# eConfirm Mobile App - Build & Deployment

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Build for Production

**Web:**
```bash
npm run web:build
```
Output: `web-build/` directory

**Android APK:**
```bash
npm run build:android
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

**Android AAB (Google Play):**
```bash
npm run build:android:bundle
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

**iOS:**
Open Xcode → Product → Archive

## 📦 Build Scripts

| Command | Description |
|---------|-------------|
| `npm run web:build` | Build optimized web app |
| `npm run build:android` | Build Android APK |
| `npm run build:android:bundle` | Build Android App Bundle for Play Store |
| `npm run build:all` | Build web + Android |
| `npm run clean` | Clean all build artifacts |
| `npm run clean:android` | Clean Android builds only |
| `npm run clean:ios` | Clean iOS builds only |

## 🔧 Configuration

### API Endpoint
The app is configured to use: `https://econfirm.co.ke/api`

Configuration file: `src/config/api.js`

### Version Management
Update versions in:
- `package.json` - App version
- `android/app/build.gradle` - Android versionCode & versionName
- `ios/TempProject/Info.plist` - iOS CFBundleShortVersionString & CFBundleVersion

## 📱 Platform-Specific Builds

### Web Deployment
1. Run `npm run web:build`
2. Deploy `web-build/` directory to your web server
3. Configure server to redirect all routes to `index.html`

### Android Deployment
1. Generate release keystore (first time only)
2. Configure signing in `android/app/build.gradle`
3. Run `npm run build:android:bundle`
4. Upload AAB to Google Play Console

### iOS Deployment
1. Open `ios/TempProject.xcworkspace` in Xcode
2. Configure signing & certificates
3. Product → Archive
4. Upload to App Store Connect

## 📚 Documentation

- **Detailed Deployment Guide**: See `DEPLOYMENT.md`
- **Quick Build Guide**: See `BUILD.md`

## ⚠️ Important Notes

1. **Release Keystore**: Generate a production keystore before releasing Android app
2. **API Configuration**: Verify API URL in `src/config/api.js`
3. **Version Numbers**: Update version numbers before each release
4. **Testing**: Always test on real devices before deployment

## 🛠️ Troubleshooting

**Build fails?**
- Run `npm run clean` and try again
- Check Node.js version (16+ required)
- Verify all dependencies are installed

**Android build issues?**
- Clean: `cd android && ./gradlew clean`
- Check Java version (11+ required)
- Verify Android SDK is installed

**iOS build issues?**
- Run: `cd ios && pod install`
- Check Xcode version compatibility
- Verify signing certificates

## 📞 Support

For issues or questions, refer to:
- [e-confirm Website](https://econfirm.co.ke/)
- [React Native Docs](https://reactnative.dev/)

