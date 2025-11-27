/**
 * Mock for react-native-worklets on web
 * This is a dependency of react-native-reanimated
 */

export default {};
export const WorkletsModule = {};
export const useSharedValue = () => ({ value: 0 });
export const useAnimatedStyle = () => ({});
export const runOnJS = (fn) => fn;
export const runOnUI = (fn) => fn;

