// Modern Banking App Design System
import { Dimensions, Platform } from 'react-native';

// Safely get dimensions - handle web case where Dimensions might not be ready
let width = 375; // Default mobile width
let height = 667; // Default mobile height

try {
  const dims = Dimensions.get('window');
  width = dims.width || 375;
  height = dims.height || 667;
} catch (e) {
  // Fallback for web or if Dimensions not available
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    width = window.innerWidth || 375;
    height = window.innerHeight || 667;
  }
}

// Mobile scaling factor - scale down everything on mobile devices for better fit
// Only apply to mobile (width <= 768), tablets and desktop keep original sizes
const isMobile = width <= 768;
const mobileScale = isMobile ? 0.88 : 1; // Scale down by 12% on mobile

// Helper function to scale values for mobile
const scale = (value) => Math.round(value * mobileScale);

export const Colors = {
  // Primary - Elegant Green (inspired by the reference app)
  primary: '#18743c',
  primaryDark: '#0d4a1f', // Darker shade for better visibility
  primaryLight: '#22c55e',
  primarySubtle: '#f0fdf4',
  primaryGradient: ['#0d4a1f', '#18743c'], // Darker gradient for banner
  
  // Neutral Palette - Clean White Theme
  background: '#ffffff',
  backgroundSecondary: '#fafafa',
  backgroundTertiary: '#f5f5f5',
  cardBackground: '#ffffff',
  cardBackgroundElevated: '#ffffff',
  
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textInverse: '#ffffff',
  
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderDark: '#d1d5db',
  
  // Status Colors - Refined
  success: '#10b981',
  successLight: '#d1fae5',
  successSubtle: '#ecfdf5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  warningSubtle: '#fffbeb',
  error: '#ef4444',
  errorLight: '#fee2e2',
  errorSubtle: '#fef2f2',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  infoSubtle: '#eff6ff',
  
  // Dark Mode
  dark: {
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    border: '#334155',
    borderLight: '#475569',
    borderDark: '#1e293b',
  },
};

export const Typography = {
  // Font Family - System Sans (Inter-like)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Font Sizes (scaled for mobile)
  fontSize: {
    xs: scale(12),
    sm: scale(14),
    base: scale(16),
    lg: scale(18),
    xl: scale(20),
    '2xl': scale(24),
    '3xl': scale(30),
    '4xl': scale(36),
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const Spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  '2xl': scale(48),
  '3xl': scale(64),
};

export const BorderRadius = {
  sm: scale(6),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  '2xl': scale(24),
  full: 9999, // Keep full radius as is
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  // Elegant card shadow - subtle and classy
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  // Button shadow for depth
  button: {
    shadowColor: '#18743c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Layout = {
  screenPadding: width > 768 ? Spacing.lg : Spacing.md,
  cardPadding: Spacing.md,
  maxWidth: width > 768 ? 800 : width,
  isTablet: width > 768,
  isMobile: isMobile,
  mobileScale: mobileScale,
};

// Utility function to scale any value for mobile
export const scaleValue = (value) => Math.round(value * mobileScale);

export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
  easing: 'ease-in-out',
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
  Animation,
};

