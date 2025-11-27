# eConfirm Mobile App - React Native

React Native mobile application for eConfirm Escrow services.

## Prerequisites

- Node.js (>=16)
- React Native development environment set up:
  - **Android**: Android Studio, JDK 11+
  - **iOS**: Xcode (macOS only), CocoaPods

## Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS (macOS only):
```bash
cd ios && pod install && cd ..
```

3. Configure API endpoint in `src/config/api.js`:
   - Update `API_BASE_URL` to point to your Laravel backend
   - Development: `http://YOUR_LOCAL_IP:8000/api` (use your computer's IP, not localhost)
   - Production: `https://econfirm.co.ke/api`

## Running the App

### Android
```bash
npm run android
```

### iOS (macOS only)
```bash
npm run ios
```

### Start Metro Bundler
```bash
npm start
```

## API Connection

Make sure your Laravel backend is running:
```bash
cd ../econfirm
php artisan serve --host=0.0.0.0 --port=8000
```

The mobile app communicates with the Laravel API at `/api/mobile/*` endpoints.

## Project Structure

```
econfirm-mobile/
├── App.js                 # Main app component
├── index.js              # Entry point
├── src/
│   ├── config/
│   │   └── api.js        # API configuration
│   ├── context/
│   │   └── AppContext.js # App context provider
│   └── screens/          # Screen components
│       ├── TransactionFormScreen.js
│       ├── PaymentScreen.js
│       ├── PaymentStatusScreen.js
│       └── TransactionDetailsScreen.js
└── package.json
```

## Dependencies

- React Native 0.72.10
- React Navigation (Stack Navigator)
- React Native Linear Gradient
- React Native Paper (UI components)
- Axios (HTTP client)

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build issues
- Make sure Android SDK is properly configured
- Check that `ANDROID_HOME` environment variable is set
- Ensure emulator is running or device is connected

### iOS build issues (macOS only)
- Run `pod install` in the `ios` directory
- Make sure Xcode Command Line Tools are installed
- Check CocoaPods is up to date: `pod repo update`

### API connection issues
- Use your computer's IP address (not localhost) in API config
- Ensure phone/emulator and computer are on the same network
- Check firewall settings
- Verify Laravel backend is running on `0.0.0.0:8000`


