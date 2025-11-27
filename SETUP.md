# Quick Setup Guide

## 1. Install Dependencies

```bash
cd mobile-app
npm install
```

## 2. Configure API Endpoint

Edit `src/config/api.js` and update the `API_BASE_URL`:

```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_LOCAL_IP:8000/api'  // Replace YOUR_LOCAL_IP with your computer's IP
  : 'https://econfirm.co.ke/api';
```

**To find your local IP:**
- **Windows**: Run `ipconfig` in CMD, look for IPv4 Address
- **Mac/Linux**: Run `ifconfig` or `ip addr`, look for inet address

## 3. Start Laravel Backend

Make sure your Laravel backend is running:

```bash
# In the main project directory
php artisan serve --host=0.0.0.0 --port=8000
```

The `--host=0.0.0.0` allows connections from your mobile device.

## 4. Configure CORS

Make sure your Laravel backend allows requests from your mobile app. Check `config/cors.php` or add CORS middleware.

## 5. Start Mobile App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Troubleshooting

### Can't connect to API
- Make sure Laravel is running on `0.0.0.0:8000`
- Check firewall settings
- Verify API_BASE_URL is correct
- Make sure phone and computer are on same network

### Payment not working
- Check M-Pesa API credentials in Laravel config
- Verify transaction is created successfully
- Check Laravel logs for errors


