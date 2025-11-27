# Running the App in Browser

## Quick Start

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Start the web server:**
   ```powershell
   npm run web
   ```

3. **Open your browser:**
   - The app will automatically open at `http://localhost:3000`
   - Or manually navigate to: http://localhost:3000

## What Was Added

- ✅ `react-native-web` - Web compatibility layer
- ✅ `react-dom` - React DOM renderer
- ✅ `webpack` - Module bundler
- ✅ `webpack-dev-server` - Development server
- ✅ `react-native-web-linear-gradient` - Web alternative for LinearGradient
- ✅ Web entry point (`index.web.js`)
- ✅ Webpack configuration
- ✅ HTML template

## Features

- ✅ Hot reloading (changes appear instantly)
- ✅ Source maps for debugging
- ✅ All React Native components work in browser
- ✅ Same API endpoints (configured in `src/config/api.js`)

## API Configuration

Make sure your Laravel backend is running:
```bash
cd ../econfirm
php artisan serve --host=0.0.0.0 --port=8000
```

The web app will use the same API configuration as the mobile app.

## Troubleshooting

### Port 3000 already in use
```powershell
# Use a different port
webpack serve --mode development --port 3001
```

### Module not found errors
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### LinearGradient not working
- The web version uses `react-native-web-linear-gradient` as a fallback
- Some styling differences may occur between web and mobile

## Building for Production

```powershell
npm run web:build
```

This creates optimized files in the `web-build` directory.

## Notes

- Some native modules may not work in the browser
- The web version is great for development and testing
- For production mobile apps, use Android/iOS builds


