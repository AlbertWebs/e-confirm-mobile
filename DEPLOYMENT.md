# eConfirm Mobile App - Deployment Guide

This guide covers deploying the eConfirm mobile app for production across web, Android, and iOS platforms.

## Prerequisites

- Node.js >= 16
- React Native CLI
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)
- Java JDK 11+

## Environment Configuration

The app is configured to use the production API at `https://econfirm.co.ke/api`.

## Web Deployment

### Development
```bash
npm run web
```
Starts development server at http://localhost:3000

### Production Build
```bash
npm run web:build
```
Creates optimized production build in `web-build/` directory.

### Deploy to app.econfirm.co.ke

**What to Upload:**
Upload the **entire contents** of the `web-build/` directory to your web server.

1. Build the web app:
   ```bash
   npm run web:build
   ```

2. Upload all files from `web-build/` to your server:
   - Upload to the root of `app.econfirm.co.ke`
   - Or to `/public_html/` or `/www/` depending on your server setup
   - **Important**: Upload the **contents** of `web-build/`, not the folder itself

3. Configure your web server:
   - Ensure all routes redirect to `index.html` (for React Router)
   - Enable HTTPS (required for PWA features)
   - Set proper cache headers for static assets
   - See `DEPLOY_WEB.md` for detailed server configuration examples

**For detailed deployment instructions, see `DEPLOY_WEB.md`**

### Example Deployment Commands

**Netlify:**
```bash
npm run web:build
netlify deploy --prod --dir=web-build
```

**Vercel:**
```bash
npm run web:build
vercel --prod
```

**AWS S3:**
```bash
npm run web:build
aws s3 sync web-build/ s3://your-bucket-name --delete
```

## Android Deployment

### Development Build
```bash
npm run android
```

### Production APK Build
```bash
npm run build:android
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

### Production AAB Build (Google Play)
```bash
npm run build:android:bundle
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Signing Configuration

**⚠️ IMPORTANT**: Before releasing to production, you must:

1. Generate a release keystore:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Update `android/app/build.gradle`:
   ```gradle
   signingConfigs {
       release {
           storeFile file('my-release-key.keystore')
           storePassword 'YOUR_STORE_PASSWORD'
           keyAlias 'my-key-alias'
           keyPassword 'YOUR_KEY_PASSWORD'
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           minifyEnabled true
           proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
       }
   }
   ```

3. Create `android/keystore.properties` (add to .gitignore):
   ```properties
   storePassword=YOUR_STORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=my-key-alias
   storeFile=my-release-key.keystore
   ```

### Google Play Store Deployment

1. Build the AAB:
   ```bash
   npm run build:android:bundle
   ```

2. Go to [Google Play Console](https://play.google.com/console)
3. Create a new app or select existing
4. Upload the AAB file from `android/app/build/outputs/bundle/release/`
5. Complete store listing, pricing, and distribution
6. Submit for review

## iOS Deployment

### Development Build
```bash
npm run ios
```

### Production Build

1. Open Xcode:
   ```bash
   cd ios
   open TempProject.xcworkspace
   ```

2. Configure signing:
   - Select your development team
   - Set bundle identifier
   - Configure provisioning profiles

3. Build archive:
   - Product → Archive
   - Or use command line:
   ```bash
   npm run build:ios
   ```

4. Distribute:
   - Use Xcode Organizer to upload to App Store
   - Or export for TestFlight/Ad Hoc distribution

### App Store Deployment

1. Archive the app in Xcode
2. Upload to App Store Connect via Organizer
3. Complete app information in App Store Connect
4. Submit for review

## Build Optimization

### Web Build Optimization

The production web build includes:
- Code minification
- Asset optimization
- Code splitting
- Source maps for debugging

### Android Build Optimization

Enable ProGuard for release builds:
```gradle
def enableProguardInReleaseBuilds = true
```

### Performance Tips

1. **Enable Hermes** (Android/iOS): Already enabled by default
2. **Optimize images**: Use WebP format where possible
3. **Enable code splitting**: Already configured in webpack
4. **Cache static assets**: Configure proper cache headers

## Environment Variables

Currently, the API URL is hardcoded to `https://econfirm.co.ke/api`. To use different environments:

1. Create `.env` file:
   ```
   API_BASE_URL=https://econfirm.co.ke/api
   ```

2. Install `react-native-dotenv`:
   ```bash
   npm install react-native-dotenv
   ```

3. Update `babel.config.js` to use dotenv

## Version Management

### Update Version

**Android** (`android/app/build.gradle`):
```gradle
versionCode 2  // Increment for each release
versionName "1.1.0"
```

**iOS** (`ios/TempProject/Info.plist`):
```xml
<key>CFBundleShortVersionString</key>
<string>1.1.0</string>
<key>CFBundleVersion</key>
<string>2</string>
```

**Web** (`package.json`):
```json
"version": "1.1.0"
```

## Testing Before Deployment

1. **Test on real devices**: Always test on physical devices
2. **Test API connectivity**: Verify all API endpoints work
3. **Test offline scenarios**: Check error handling
4. **Performance testing**: Check app performance and memory usage
5. **Security audit**: Review API keys and sensitive data handling

## Troubleshooting

### Web Build Issues

- **Large bundle size**: Check `webpack-bundle-analyzer`
- **CORS errors**: Ensure API server allows your domain
- **Routing issues**: Configure server to redirect to index.html

### Android Build Issues

- **Gradle sync errors**: Run `cd android && ./gradlew clean`
- **Signing errors**: Verify keystore configuration
- **Build failures**: Check Android SDK and build tools versions

### iOS Build Issues

- **Code signing**: Verify certificates and provisioning profiles
- **Pod install**: Run `cd ios && pod install`
- **Build errors**: Check Xcode version compatibility

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run web:build
      - uses: actions/upload-artifact@v2
        with:
          name: web-build
          path: web-build

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '11'
      - run: npm ci
      - run: npm run build:android
      - uses: actions/upload-artifact@v2
        with:
          name: android-apk
          path: android/app/build/outputs/apk/release
```

## Security Checklist

- [ ] API keys are not hardcoded
- [ ] Release keystore is secured (not in git)
- [ ] ProGuard/R8 enabled for Android
- [ ] HTTPS enforced for all API calls
- [ ] Sensitive data encrypted in storage
- [ ] Error messages don't expose sensitive info

## Support

For deployment issues, contact the development team or refer to:
- [React Native Deployment Docs](https://reactnative.dev/docs/signed-apk-android)
- [e-confirm Website](https://econfirm.co.ke/)

