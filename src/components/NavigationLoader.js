import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet, Animated, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Navigation loader that shows when navigating between screens
export const NavigationLoader = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // Screen focused, hide loader
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setLoading(false));
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      // Screen blurred, could show loader if needed
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, fadeAnim]);

  const showLoader = () => {
    setLoading(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Expose showLoader function globally for tab navigation
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showNavigationLoader = showLoader;
    }
  }, []);

  if (!loading) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#18743c" />
        <Text style={styles.message}>Loading...</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: width > 768 ? 200 : 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});

// Hook to use in screens for loading state
export const useNavigationLoader = () => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500); // Auto-hide after transition
  };

  return { loading, showLoader };
};

