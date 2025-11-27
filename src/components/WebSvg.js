import React from 'react';
import { Platform, View } from 'react-native';

// Web-specific SVG wrapper that works with React Native Web
export const WebSvg = ({ svgString, width, height, style }) => {
  if (Platform.OS === 'web') {
    // Use React Native Web's ability to render HTML
    // Create a component that uses the web DOM API
    const SvgComponent = () => {
      const containerId = React.useMemo(() => `svg-${Math.random().toString(36).substr(2, 9)}`, []);
      
      React.useEffect(() => {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = svgString;
        }
      }, [svgString, containerId]);
      
      // Use View which renders as div on web, but we need to inject HTML differently
      // For now, use a workaround with a web-only component
      if (typeof window !== 'undefined') {
        const div = document.createElement('div');
        div.innerHTML = svgString;
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        div.style.display = 'inline-block';
        div.style.verticalAlign = 'middle';
        if (style) {
          Object.assign(div.style, style);
        }
        
        return (
          <View
            style={{ width, height }}
            // @ts-ignore - web-specific
            ref={(ref) => {
              if (ref && ref._node) {
                ref._node.appendChild(div);
              }
            }}
          />
        );
      }
      
      return <View style={[{ width, height }, style]} />;
    };
    return <SvgComponent />;
  }
  
  // For native, return null or a placeholder
  return null;
};

