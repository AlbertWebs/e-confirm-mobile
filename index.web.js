/**
 * @format
 * Web entry point for React Native Web
 */

// Import gesture handler first (required by react-navigation)
import 'react-native-gesture-handler';

import React from 'react';
import { createRoot } from 'react-dom/client';

// Try to enable screens for web (may fail on web)
try {
  const screens = require('react-native-screens');
  if (screens && screens.enableScreens) {
    screens.enableScreens(true);
    console.log('react-native-screens enabled');
  }
} catch (e) {
  console.log('react-native-screens not available for web, continuing...', e.message);
}

import App from './App';

console.log('Starting app...');

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      return (
        <div style={{ padding: 20, fontFamily: 'sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
          <h1 style={{ color: '#d32f2f' }}>Something went wrong</h1>
          <h2>Error Details:</h2>
          <pre style={{ background: '#f5f5f5', padding: 10, overflow: 'auto', border: '1px solid #ccc' }}>
            {error?.toString()}
            {error?.stack && `\n\nStack:\n${error.stack}`}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Root element found, creating root...');

// Add global error handlers BEFORE rendering
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error, event.error?.stack);
  // Show error on page if root exists
  const rootEl = document.getElementById('root');
  if (rootEl && !rootEl.querySelector('.error-display')) {
    rootEl.innerHTML = `
      <div class="error-display" style="padding: 20px; font-family: sans-serif; background: #fff; min-height: 100vh;">
        <h1 style="color: #d32f2f;">JavaScript Error</h1>
        <pre style="background: #f5f5f5; padding: 10px; overflow: auto; border: 1px solid #ccc;">
          ${event.error?.toString() || 'Unknown error'}
          ${event.error?.stack || ''}
        </pre>
        <button 
          onclick="window.location.reload()"
          style="padding: 10px 20px; font-size: 16px; margin-top: 10px; cursor: pointer;"
        >
          Reload Page
        </button>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Create root and render
try {
  console.log('Creating root...');
  const root = createRoot(rootElement);
  console.log('Root created, rendering app...');
  
  // Render a simple test first to verify React works
  console.log('Testing React render...');
  root.render(
    <div style={{ padding: '20px', backgroundColor: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#18743c' }}>Loading eConfirm App...</h1>
      <p>If you see this, React is working. Loading full app...</p>
    </div>
  );
  
  // Wait a moment, then render the full app
  setTimeout(() => {
    try {
      console.log('Rendering full app...');
      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </React.StrictMode>
      );
      console.log('App rendered successfully!');
    } catch (appError) {
      console.error('Error rendering App component:', appError);
      root.render(
        <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh' }}>
          <h1 style={{ color: '#d32f2f' }}>Error Loading App Component</h1>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', border: '1px solid #ccc' }}>
            {appError.toString()}
            {appError.stack || ''}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
  }, 100);
  
} catch (error) {
  console.error('Error rendering app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; background: #fff; min-height: 100vh;">
      <h1 style="color: #d32f2f;">Error Loading App</h1>
      <pre style="background: #f5f5f5; padding: 10px; overflow: auto; border: 1px solid #ccc;">
        ${error.toString()}
        ${error.stack || ''}
      </pre>
      <button 
        onclick="window.location.reload()"
        style="padding: 10px 20px; font-size: 16px; margin-top: 10px; cursor: pointer;"
      >
        Reload Page
      </button>
    </div>
  `;
}


