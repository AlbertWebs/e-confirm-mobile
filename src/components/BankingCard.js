import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Shadows, Spacing } from '../theme/designSystem';

const BankingCard = ({ children, onPress, style, variant = 'default' }) => {
  const theme = useTheme();
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.cardBackground,
      borderColor: variant === 'elevated' ? 'transparent' : theme.colors.borderLight,
    },
    variant === 'elevated' && Shadows.card,
    variant === 'default' && { borderWidth: 0 },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress}
        activeOpacity={0.85}
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
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: '#ffffff',
  },
});

export default BankingCard;

