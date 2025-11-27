import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Shadows } from '../theme/designSystem';

const BankingCard = ({ children, onPress, style, variant = 'default' }) => {
  const theme = useTheme();
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: variant === 'elevated' 
        ? theme.colors.background 
        : theme.colors.backgroundSecondary,
      borderColor: theme.colors.border,
    },
    variant === 'elevated' && Shadows.md,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
});

export default BankingCard;

