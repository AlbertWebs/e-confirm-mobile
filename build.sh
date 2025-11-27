#!/bin/bash

# eConfirm Mobile App - Build Script
# This script builds the app for all platforms

set -e

echo "🚀 Starting eConfirm Mobile App Build Process..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo -e "${BLUE}Checking Node.js version...${NC}"
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
    echo -e "${YELLOW}Warning: Node.js 16+ is recommended${NC}"
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm ci

# Clean previous builds
echo -e "${BLUE}Cleaning previous builds...${NC}"
npm run clean

# Build Web
echo -e "${GREEN}Building Web app...${NC}"
npm run web:build
echo -e "${GREEN}✓ Web build complete! Output: web-build/${NC}"

# Build Android (if on Linux/Mac)
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    echo -e "${GREEN}Building Android app...${NC}"
    cd android
    ./gradlew clean
    ./gradlew assembleRelease
    echo -e "${GREEN}✓ Android APK build complete!${NC}"
    echo -e "${BLUE}APK location: android/app/build/outputs/apk/release/app-release.apk${NC}"
    
    # Build AAB for Play Store
    echo -e "${GREEN}Building Android App Bundle...${NC}"
    ./gradlew bundleRelease
    echo -e "${GREEN}✓ Android AAB build complete!${NC}"
    echo -e "${BLUE}AAB location: android/app/build/outputs/bundle/release/app-release.aab${NC}"
    cd ..
fi

echo -e "${GREEN}🎉 Build process complete!${NC}"
echo ""
echo "Build outputs:"
echo "  - Web: web-build/"
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    echo "  - Android APK: android/app/build/outputs/apk/release/"
    echo "  - Android AAB: android/app/build/outputs/bundle/release/"
fi

