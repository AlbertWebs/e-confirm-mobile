import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Typography, BorderRadius, Spacing, Layout } from '../theme/designSystem';

const StatusBadge = ({ status, size = 'md' }) => {
  const theme = useTheme();

  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('completed') || statusLower.includes('funded') || statusLower.includes('success')) {
      return {
        label: 'Completed',
        color: theme.success,
        bgColor: theme.success + '15',
      };
    }
    if (statusLower.includes('pending') || statusLower.includes('waiting')) {
      return {
        label: 'Pending',
        color: theme.warning,
        bgColor: theme.warning + '15',
      };
    }
    if (statusLower.includes('failed') || statusLower.includes('cancelled') || statusLower.includes('rejected')) {
      return {
        label: 'Failed',
        color: theme.error,
        bgColor: theme.error + '15',
      };
    }
    if (statusLower.includes('processing') || statusLower.includes('active')) {
      return {
        label: 'Active',
        color: theme.info,
        bgColor: theme.info + '15',
      };
    }
    
    return {
      label: status || 'Unknown',
      color: theme.colors.textTertiary,
      bgColor: theme.colors.backgroundTertiary,
    };
  };

  const config = getStatusConfig(status);
  const sizeStyles = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : styles.md;

  return (
    <View
      style={[
        styles.badge,
        sizeStyles,
        {
          backgroundColor: config.bgColor,
          borderColor: config.color + '40',
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          sizeStyles.text,
          { color: config.color },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: Math.round(6 * Layout.mobileScale),
    paddingVertical: Math.round(2 * Layout.mobileScale),
  },
  md: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  lg: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  badgeText: {
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  'sm.text': {
    fontSize: Typography.fontSize.xs,
  },
  'md.text': {
    fontSize: Typography.fontSize.sm,
  },
  'lg.text': {
    fontSize: Typography.fontSize.base,
  },
});

export default StatusBadge;

