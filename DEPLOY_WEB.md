# Deploying to app.econfirm.co.ke

## What to Upload

After building the web app, upload the **entire contents** of the `web-build/` directory to your web server at `app.econfirm.co.ke`.

## Step-by-Step Instructions

### 1. Build the Production App

```bash
npm install  # Make sure all dependencies are installed
npm run web:build
```

This creates a `web-build/` directory with all production files.

### 2. What's in web-build/

The `web-build/` directory contains:
```
web-build/
├── index.html              # Main HTML file
├── bundle.[hash].js        # Main JavaScript bundle
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── install-prompt.js       # Install prompt handler
└── icons/                  # App icons (if created)
    ├── icon-16x16.png
    ├── icon-32x32.png
    ├── icon-192x192.png
    ├── icon-512x512.png
    └── ... (other sizes)
```

### 3. Upload to Server

Upload **all files and folders** from `web-build/` to your web server.

**Via FTP/SFTP:**
- Upload everything in `web-build/` to the root of `app.econfirm.co.ke`
- Or to a subdirectory like `/public_html/` or `/www/` depending on your server setup

**Via Command Line (SSH):**
```bash
# From your local machine
scp -r web-build/* user@app.econfirm.co.ke:/path/to/web/root/
```

**Via Git (if using deployment):**
```bash
# Add web-build to .gitignore (already done)
# Set up deployment script to copy files
```

### 4. Server Configuration

Your web server needs to:

1. **Serve index.html for all routes** (for React Router)
   - Apache: Add `.htaccess` with rewrite rules
   - Nginx: Configure try_files directive
   - See examples below

2. **Enable HTTPS** (required for PWA)
   - PWA features require HTTPS
   - Service worker won't work on HTTP (except localhost)

3. **Set proper MIME types**
   - Ensure `.js` files are served as `application/javascript`
   - Ensure `.json` files are served as `application/json`

### 5. Server Configuration Examples

#### Apache (.htaccess)
Create a `.htaccess` file in your web root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
</IfModule>
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.econfirm.co.ke;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.econfirm.co.ke;
    
    root /path/to/web-build;
    index index.html;
    
    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Service worker must be served from root
    location /service-worker.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Manifest must be served from root
    location /manifest.json {
        add_header Cache-Control "no-cache";
    }
}
```

### 6. Verify Deployment

After uploading, verify:

1. **Visit the site**: `https://app.econfirm.co.ke`
2. **Check console**: Open DevTools → Console (should be no errors)
3. **Check manifest**: DevTools → Application → Manifest (should show app details)
4. **Check service worker**: DevTools → Application → Service Workers (should be registered)
5. **Test install prompt**: Should see install banner on supported browsers
6. **Test routing**: Navigate to different pages, refresh - should work

### 7. Quick Deployment Checklist

- [ ] Built production app: `npm run web:build`
- [ ] Created app icons (see `web/icons/README.md`)
- [ ] Uploaded all files from `web-build/` to server
- [ ] Configured server to serve `index.html` for all routes
- [ ] Enabled HTTPS on server
- [ ] Tested the deployed app
- [ ] Verified PWA install prompt works
- [ ] Verified service worker is registered

## File Structure on Server

Your server should have this structure:
```
/path/to/web/root/
├── index.html
├── bundle.[hash].js
├── manifest.json
├── service-worker.js
├── install-prompt.js
├── icons/
│   ├── icon-16x16.png
│   ├── icon-32x32.png
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── ... (other sizes)
└── .htaccess (if using Apache)
```

## Important Notes

1. **Don't upload the `web-build` folder itself** - upload its **contents**
2. **HTTPS is required** for PWA features to work
3. **All routes must serve index.html** for client-side routing
4. **Service worker must be at root** (`/service-worker.js`)
5. **Manifest must be at root** (`/manifest.json`)

## Troubleshooting

**App not loading?**
- Check server logs
- Verify all files were uploaded
- Check file permissions (should be readable)

**404 errors on refresh?**
- Server not configured to serve `index.html` for all routes
- Check `.htaccess` or Nginx configuration

**Service worker not registering?**
- Must be served over HTTPS
- Must be at root path (`/service-worker.js`)
- Check browser console for errors

**Install prompt not showing?**
- Verify manifest.json is accessible
- Check that icons exist and are accessible
- Ensure HTTPS is enabled

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check server error logs
3. Verify all files are uploaded correctly
4. Test with a simple HTML file first to verify server setup

