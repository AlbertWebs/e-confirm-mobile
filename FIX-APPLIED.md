# Windows Path Fix Applied ✅

## Problem
Expo CLI was trying to create a directory with `node:sea` (containing a colon), which is invalid on Windows file systems.

## Solution Applied
1. **Patched Expo CLI**: Modified `node_modules/@expo/cli/build/src/start/server/metro/externals.js` to sanitize module IDs by replacing colons with underscores in directory paths.

2. **Created Permanent Patch**: Used `patch-package` to create a patch file that will automatically apply this fix after every `npm install`.

3. **Added Post-Install Script**: The `postinstall` script in `package.json` will automatically apply the patch.

## Files Modified
- `node_modules/@expo/cli/build/src/start/server/metro/externals.js` (patched)
- `patches/@expo+cli+0.10.17.patch` (permanent patch file)
- `package.json` (added postinstall script)

## How It Works
The patch changes this line:
```javascript
const shimDir = _path.default.join(projectRoot, METRO_EXTERNALS_FOLDER, moduleId);
```

To this:
```javascript
const shimDir = _path.default.join(projectRoot, METRO_EXTERNALS_FOLDER, moduleId.replace(/:/g, "_"));
```

This ensures that any colons in module IDs (like `node:sea`) are replaced with underscores (`node_sea`) before creating directory paths.

## Testing
The app should now start without the `node:sea` error. Run:
```powershell
npm start
```

If you see the Expo development server with a QR code, the fix is working! 🎉

## Future Installs
The patch will automatically apply after running `npm install` thanks to the `postinstall` script.

