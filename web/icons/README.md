# App Icons

This directory should contain the following icon files for PWA installation:

- `icon-16x16.png` - Favicon
- `icon-32x32.png` - Favicon
- `icon-72x72.png` - Android icon
- `icon-96x96.png` - Android icon
- `icon-128x128.png` - Chrome icon
- `icon-144x144.png` - Android icon
- `icon-152x152.png` - iOS icon
- `icon-192x192.png` - Android/Chrome icon (required)
- `icon-384x384.png` - Android splash
- `icon-512x512.png` - Android/Chrome icon (required)

## Icon Requirements

- **Format**: PNG
- **Background**: Should be solid or transparent
- **Design**: Use the eConfirm logo/branding
- **Maskable**: Icons should work as maskable icons (safe zone: 80% of icon)

## Quick Icon Generation

You can use online tools like:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [App Icon Generator](https://www.appicon.co/)

Or use ImageMagick to generate from a 512x512 source:
```bash
# Generate all sizes from a 512x512 source icon
for size in 16 32 72 96 128 144 152 192 384 512; do
  convert source-icon.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

## Temporary Placeholder

Until proper icons are created, you can use a simple colored square or the eConfirm logo.

