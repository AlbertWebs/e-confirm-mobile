/**
 * Mock for react-native-reanimated on web
 * Provides minimal API that gesture-handler expects
 */

// Mock default export
const Reanimated = {
  default: {
    // Basic animation functions
    withTiming: (value, config) => value,
    withSpring: (value, config) => value,
    withDecay: (value, config) => value,
    withRepeat: (value, config) => value,
    withSequence: (...animations) => animations[0],
    withDelay: (delay, animation) => animation,
    
    // Shared values
    useSharedValue: (initialValue) => ({ value: initialValue }),
    useAnimatedStyle: (updater) => ({}),
    useAnimatedGestureHandler: (handlers) => handlers,
    useAnimatedReaction: () => {},
    useDerivedValue: (processor) => ({ value: processor() }),
    
    // Hooks
    useAnimatedScrollHandler: () => () => {},
    useAnimatedRef: () => ({ current: null }),
    
    // Interpolation
    interpolate: (value, inputRange, outputRange) => outputRange[0],
    Extrapolate: {
      EXTEND: 'extend',
      CLAMP: 'clamp',
      IDENTITY: 'identity',
    },
    
    // Easing
    Easing: {
      linear: () => 0,
      ease: () => 0,
      quad: () => 0,
      cubic: () => 0,
      poly: () => 0,
      sin: () => 0,
      circle: () => 0,
      exp: () => 0,
      elastic: () => 0,
      back: () => 0,
      bounce: () => 0,
      bezier: () => 0,
      in: () => 0,
      out: () => 0,
      inOut: () => 0,
    },
    
    // Worklets
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    
    // Other utilities
    cancelAnimation: () => {},
    makeMutable: (value) => ({ value }),
    makeRemote: (value) => ({ value }),
  },
};

// Named exports
export const withTiming = Reanimated.default.withTiming;
export const withSpring = Reanimated.default.withSpring;
export const useSharedValue = Reanimated.default.useSharedValue;
export const useAnimatedStyle = Reanimated.default.useAnimatedStyle;
export const useAnimatedGestureHandler = Reanimated.default.useAnimatedGestureHandler;
export const useAnimatedReaction = Reanimated.default.useAnimatedReaction;
export const useDerivedValue = Reanimated.default.useDerivedValue;
export const useAnimatedScrollHandler = Reanimated.default.useAnimatedScrollHandler;
export const useAnimatedRef = Reanimated.default.useAnimatedRef;
export const interpolate = Reanimated.default.interpolate;
export const Extrapolate = Reanimated.default.Extrapolate;
export const Easing = Reanimated.default.Easing;
export const runOnJS = Reanimated.default.runOnJS;
export const runOnUI = Reanimated.default.runOnUI;
export const cancelAnimation = Reanimated.default.cancelAnimation;
export const makeMutable = Reanimated.default.makeMutable;
export const makeRemote = Reanimated.default.makeRemote;

// Default export
export default Reanimated.default;

