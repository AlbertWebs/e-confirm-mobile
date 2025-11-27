import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Typography, BorderRadius, Spacing } from '../theme/designSystem';

const BankingButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const theme = useTheme();

  const buttonStyle = [
    styles.button,
    size === 'sm' && styles.buttonSm,
    size === 'lg' && styles.buttonLg,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    size === 'sm' && styles.textSm,
    size === 'lg' && styles.textLg,
    variant === 'secondary' && { color: theme.primary },
    variant === 'outline' && { color: theme.primary },
    variant === 'ghost' && { color: theme.textSecondary },
  ];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={buttonStyle}
      >
        <LinearGradient
          colors={[theme.primary, theme.primaryDark]}
          style={[styles.gradient, buttonStyle]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[textStyle, { color: '#fff' }]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        buttonStyle,
        variant === 'secondary' && { backgroundColor: theme.primarySubtle },
        variant === 'outline' && {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.primary,
        },
        variant === 'ghost' && { backgroundColor: 'transparent' },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.primary} size="small" />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonSm: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    minHeight: 36,
  },
  buttonLg: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 50,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: Typography.fontSize.xs,
  },
  textLg: {
    fontSize: Typography.fontSize.base,
  },
});

export default BankingButton;

