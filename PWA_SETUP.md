# PWA (Progressive Web App) Setup Guide

## Overview

The eConfirm Escrow app is now configured as a Progressive Web App (PWA), allowing users to install it on their devices directly from the browser.

## Features

✅ **Install Prompt** - Users will see an install banner prompting them to add the app to their home screen
✅ **Offline Support** - Service worker caches app shell for offline access
✅ **App-like Experience** - Runs in standalone mode when installed
✅ **Fast Loading** - Cached assets load instantly
✅ **Cross-platform** - Works on Android, iOS, and desktop browsers

## Files Created

1. **`web/manifest.json`** - PWA manifest with app metadata, icons, and configuration
2. **`web/service-worker.js`** - Service worker for offline functionality and caching
3. **`web/install-prompt.js`** - Handles install prompt UI and user interaction
4. **`web/icons/README.md`** - Guide for creating app icons

## How It Works

### Install Prompt Flow

1. When a user visits the app, the browser checks if it meets PWA criteria
2. If eligible, the `beforeinstallprompt` event fires
3. Our install prompt handler shows a custom banner
4. User clicks "Install" → Browser shows native install dialog
5. After installation, app runs in standalone mode

### Service Worker

- **Caches app shell** on first visit
- **Serves cached content** when offline
- **Updates cache** when new version is available
- **Skips API requests** - always fetches from network

## Icon Requirements

⚠️ **IMPORTANT**: You need to create app icons before deployment!

Required icon sizes:
- 16x16, 32x32 (favicons)
- 72x72, 96x96, 128x128, 144x144, 152x152 (mobile)
- 192x192, 384x384, 512x512 (required for PWA)

See `web/icons/README.md` for detailed instructions.

### Quick Icon Generation

1. Create a 512x512 PNG with your logo
2. Use an online tool like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
3. Place all icons in `web/icons/` directory
4. Update `webpack.config.js` to copy icons to build output

## Testing the Install Prompt

### Chrome/Edge (Desktop)
1. Open DevTools → Application tab
2. Check "Manifest" section
3. Click "Add to homescreen" button

### Chrome (Android)
1. Visit the app
2. Look for install banner at bottom
3. Or use browser menu → "Add to Home screen"

### Safari (iOS)
1. Visit the app
2. Tap Share button
3. Select "Add to Home Screen"

### Testing Locally

1. Build the app: `npm run web:build`
2. Serve with HTTPS (required for PWA):
   ```bash
   # Using serve
   npx serve -s web-build --ssl-cert cert.pem --ssl-key key.pem
   
   # Or use a local HTTPS server
   ```

## Browser Support

| Browser | Install Prompt | Service Worker | Standalone Mode |
|---------|---------------|----------------|----------------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari (iOS) | ⚠️ Manual | ✅ | ✅ |
| Firefox | ⚠️ Manual | ✅ | ⚠️ Limited |
| Safari (Desktop) | ❌ | ✅ | ❌ |

## Configuration

### Manifest Settings

Edit `web/manifest.json` to customize:
- App name and description
- Theme color
- Start URL
- Display mode
- Icons
- Shortcuts

### Service Worker Settings

Edit `web/service-worker.js` to customize:
- Cache name and version
- Assets to precache
- Caching strategy
- Offline fallback

### Install Prompt Settings

Edit `web/install-prompt.js` to customize:
- Banner appearance
- Dismissal behavior
- Success messages

## Deployment Checklist

- [ ] Create all required app icons (see `web/icons/README.md`)
- [ ] Update `manifest.json` with correct app name/description
- [ ] Test install prompt on target browsers
- [ ] Test offline functionality
- [ ] Verify service worker registration
- [ ] Test on HTTPS (required for PWA)
- [ ] Update version in service worker cache name when deploying updates

## Troubleshooting

### Install Prompt Not Showing

1. **Check HTTPS**: PWA requires HTTPS (except localhost)
2. **Check manifest**: Verify `manifest.json` is valid
3. **Check icons**: Ensure 192x192 and 512x512 icons exist
4. **Check service worker**: Must be registered successfully
5. **Browser support**: Some browsers don't support install prompt

### Service Worker Not Registering

1. **Check HTTPS**: Service workers require HTTPS
2. **Check path**: Service worker must be at root or same level
3. **Check scope**: Service worker scope must match app scope
4. **Clear cache**: Clear browser cache and try again

### Icons Not Showing

1. **Check paths**: Verify icon paths in `manifest.json`
2. **Check format**: Icons must be PNG format
3. **Check sizes**: Icons must match specified sizes
4. **Check build**: Ensure icons are copied to build output

## Next Steps

1. **Create Icons**: Generate all required icon sizes
2. **Test Locally**: Test install prompt and offline functionality
3. **Deploy to HTTPS**: Deploy to a server with HTTPS
4. **Monitor**: Use browser DevTools to monitor service worker

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Add to Home Screen](https://web.dev/add-to-home-screen/)

