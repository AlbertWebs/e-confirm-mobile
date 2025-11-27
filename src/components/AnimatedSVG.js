import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Web SVG Component Helper - uses emoji fallback for reliability
// SVG rendering can be enhanced later if needed

// Animated SVG components
export const AnimatedLockIcon = ({ size = 48, color = '#18743c' }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>`;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.8 }}>🔒</Text>
    </Animated.View>
  );
};

export const AnimatedZapIcon = ({ size = 48, color = '#18743c' }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle rotate animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>`;

  return (
    <Animated.View
      style={{
        transform: [{ rotate }],
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.8 }}>⚡</Text>
    </Animated.View>
  );
};

export const AnimatedCheckIcon = ({ size = 48, color = '#18743c' }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Fade and scale animation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [scaleAnim, opacityAnim]);

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>`;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.8 }}>✅</Text>
    </Animated.View>
  );
};

// Animated Tick that draws every minute
export const AnimatedTick = ({ size = 60, color = '#fff', strokeWidth = 6 }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Draw tick animation - resets and redraws every 60 seconds
    const drawTick = () => {
      // Reset
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      
      // Animate drawing
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200, // Draw over 1.2 seconds
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(600), // Start fade after half the scale animation
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    // Initial draw
    drawTick();

    // Redraw every 60 seconds (60000ms)
    const interval = setInterval(drawTick, 60000);

    return () => clearInterval(interval);
  }, [scaleAnim, opacityAnim]);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: size / 2,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          width: size * 0.7,
          height: size * 0.7,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: size * 0.5,
            color: color,
            fontWeight: '900',
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          ✓
        </Text>
      </Animated.View>
      {/* Outer circle */}
      <View
        style={{
          position: 'absolute',
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: size * 0.45,
          borderWidth: 2,
          borderColor: color,
          opacity: 0.3,
        }}
      />
    </View>
  );
};

export const AnimatedHeroIllustration = ({ width = 120, height = 120 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle pulse only - NO rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatedTick size={width} color="#fff" strokeWidth={width > 60 ? 8 : 6} />
    </Animated.View>
  );
};
