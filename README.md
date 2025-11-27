# eConfirm Mobile App

React Native mobile application for eConfirm Escrow services.

**Location**: This app is now in a separate directory from the Laravel backend.

## Project Structure

```
C:\projects\
├── econfirm\          # Laravel backend
└── econfirm-mobile\   # React Native mobile app (this directory)
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint in `src/config/api.js`:
   - Update `API_BASE_URL` to point to your Laravel backend
   - Development: `http://YOUR_LOCAL_IP:8000/api`
   - Production: `https://econfirm.co.ke/api`

3. Start the app:
```bash
npm start
```

## Windows Path Fix

This project includes a patch for the Windows `node:sea` path issue. The patch is automatically applied via the `postinstall` script.

If you encounter the `node:sea` error:
1. Run `npm install` to apply the patch
2. Clear cache: `Remove-Item -Recurse -Force .expo`
3. Try `npm start` again

## API Connection

Make sure your Laravel backend is running:
```bash
cd ../econfirm
php artisan serve --host=0.0.0.0 --port=8000
```

The mobile app communicates with the Laravel API at `/api/mobile/*` endpoints.

## More Information

See `SETUP.md` and `TROUBLESHOOTING.md` for detailed setup instructions.

