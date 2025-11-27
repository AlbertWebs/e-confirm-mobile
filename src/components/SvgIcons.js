import React from 'react';
import { View, Platform, Text } from 'react-native';

// SVG Icon Component that works on both web and native
const SvgIcon = ({ svgString, width = 24, height = 24, color = '#18743c', style, emojiFallback }) => {
  // For now, use emoji as primary since it's always visible
  // We can enhance with SVG later if needed
  if (emojiFallback) {
    return (
      <Text style={[
        { 
          fontSize: width * 0.8, 
          width, 
          height, 
          textAlign: 'center',
          lineHeight: height,
        }, 
        style
      ]}>
        {emojiFallback}
      </Text>
    );
  }
  
  // Fallback to colored view if no emoji
  return <View style={[{ width, height, backgroundColor: color, borderRadius: 4 }, style]} />;
};

// Lock Icon
export const LockIcon = ({ size = 48, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>`}
    width={size}
    height={size}
    color={color}
    emojiFallback="🔒"
  />
);

// Lightning Icon
export const LightningIcon = ({ size = 48, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>`}
    width={size}
    height={size}
    color={color}
    emojiFallback="⚡"
  />
);

// Check Icon
export const CheckIcon = ({ size = 48, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`}
    width={size}
    height={size}
    color={color}
    emojiFallback="✅"
  />
);

// Document Icon
export const DocumentIcon = ({ size = 48, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>`}
    width={size}
    height={size}
    color={color}
  />
);

// Shield Icon
export const ShieldIcon = ({ size = 48, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>`}
    width={size}
    height={size}
    color={color}
    emojiFallback="🛡️"
  />
);

// Zap Icon (for fast processing)
export const ZapIcon = ({ size = 48, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>`}
    width={size}
    height={size}
    color={color}
  />
);

// Home Icon
export const HomeIcon = ({ size = 24, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>`}
    width={size}
    height={size}
    color={color}
    emojiFallback="🏠"
  />
);

// Plus Icon
export const PlusIcon = ({ size = 24, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>`}
    width={size}
    height={size}
    color={color}
    emojiFallback="➕"
  />
);

// List Icon
export const ListIcon = ({ size = 24, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>`}
    width={size}
    height={size}
    color={color}
    emojiFallback="📋"
  />
);

// Complaint/Support Icon
export const ComplaintIcon = ({ size = 24, color = '#18743c' }) => (
  <SvgIcon
    svgString={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <line x1="9" y1="10" x2="15" y2="10"></line>
      <line x1="9" y1="14" x2="13" y2="14"></line>
    </svg>`}
    width={size}
    height={size}
    color={color}
    emojiFallback="📝"
  />
);

// Hero Illustration SVG
export const HeroIllustration = ({ width = 200, height = 200 }) => {
  // Use a simple emoji/icon for now that's always visible
  return (
    <View style={{ 
      width, 
      height, 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: width / 2,
    }}>
      <Text style={{ fontSize: width * 0.4 }}>✓</Text>
    </View>
  );
};

