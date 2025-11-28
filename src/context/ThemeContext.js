import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/designSystem';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? Colors.dark : {
      background: Colors.background,
      backgroundSecondary: Colors.backgroundSecondary,
      backgroundTertiary: Colors.backgroundTertiary,
      text: Colors.text,
      textSecondary: Colors.textSecondary,
      textTertiary: Colors.textTertiary,
      textInverse: Colors.textInverse,
      border: Colors.border,
      borderLight: Colors.borderLight,
      borderDark: Colors.borderDark,
    },
    // Always include primary colors
    primary: Colors.primary,
    primaryDark: Colors.primaryDark,
    primaryLight: Colors.primaryLight,
    primarySubtle: Colors.primarySubtle,
    primaryGradient: Colors.primaryGradient,
    success: Colors.success,
    successLight: Colors.successLight,
    successSubtle: Colors.successSubtle,
    warning: Colors.warning,
    warningLight: Colors.warningLight,
    warningSubtle: Colors.warningSubtle,
    error: Colors.error,
    errorLight: Colors.errorLight,
    errorSubtle: Colors.errorSubtle,
    info: Colors.info,
    infoLight: Colors.infoLight,
    infoSubtle: Colors.infoSubtle,
  };

  // Don't block rendering while loading theme - use default light mode
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

