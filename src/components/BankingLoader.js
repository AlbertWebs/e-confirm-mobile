import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';

// Professional Banking App Loader - Clean Geometric Animation
const BankingLoader = ({ size = 80, color = '#18743c' }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const useNative = Platform.OS !== 'web'; // Web doesn't support native driver
    
    // Continuous smooth rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: useNative,
      })
    ).start();

    // Gentle scale pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: useNative,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 1200,
          useNativeDriver: useNative,
        }),
      ])
    ).start();

    // Opacity pulse for inner elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: useNative,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: useNative,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (Platform.OS === 'web') {
    // Web version with SVG-like appearance
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View
          style={[
            styles.circleContainer,
            {
              width: size,
              height: size,
              transform: [{ rotate }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Outer rotating circle */}
          <View
            style={[
              styles.outerCircle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: color,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
              },
            ]}
          />
          
          {/* Inner pulsing circle */}
          <Animated.View
            style={[
              styles.innerCircle,
              {
                width: size * 0.6,
                height: size * 0.6,
                borderRadius: (size * 0.6) / 2,
                borderColor: color,
                opacity: opacityAnim,
              },
            ]}
          />
          
          {/* Center dot */}
          <Animated.View
            style={[
              styles.centerDot,
              {
                width: size * 0.2,
                height: size * 0.2,
                borderRadius: (size * 0.2) / 2,
                backgroundColor: color,
                opacity: opacityAnim,
              },
            ]}
          />
        </Animated.View>
      </View>
    );
  }

  // Native version
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.circleContainer,
          {
            width: size,
            height: size,
            transform: [{ rotate }, { scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.outerCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
            },
          ]}
        />
        <Animated.View
          style={[
            styles.innerCircle,
            {
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: (size * 0.6) / 2,
              borderColor: color,
              opacity: opacityAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.centerDot,
            {
              width: size * 0.2,
              height: size * 0.2,
              borderRadius: (size * 0.2) / 2,
              backgroundColor: color,
              opacity: opacityAnim,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerCircle: {
    position: 'absolute',
    borderWidth: 3,
  },
  innerCircle: {
    position: 'absolute',
    borderWidth: 2,
  },
  centerDot: {
    position: 'absolute',
  },
});

export default BankingLoader;

