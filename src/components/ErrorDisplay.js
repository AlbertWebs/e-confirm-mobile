import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Typography, BorderRadius, Spacing, Layout } from '../theme/designSystem';

const { width } = Dimensions.get('window');

const ErrorDisplay = ({ error, onDismiss, autoHide = true, autoHideDelay = 5000 }) => {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after delay
      if (autoHide && onDismiss) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, autoHideDelay);

        return () => clearTimeout(timer);
      }
    } else {
      handleDismiss();
    }
  }, [error]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  if (!error) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.errorBox}>
        <View style={styles.errorContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <View style={styles.errorTextContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.sm,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: Typography.fontSize['2xl'],
    marginRight: Spacing.md,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: Spacing.xs,
  },
  errorMessage: {
    fontSize: Typography.fontSize.xs,
    color: '#7f1d1d',
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  dismissButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  dismissButtonText: {
    fontSize: Typography.fontSize.lg,
    color: '#991b1b',
    fontWeight: 'bold',
  },
});

export default ErrorDisplay;

