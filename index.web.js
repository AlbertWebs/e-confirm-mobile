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

// Prevent multiple initializations - use a more robust check
if (!window.__APP_INITIALIZED__) {
  // Mark as initialized immediately to prevent race conditions
  window.__APP_INITIALIZED__ = true;
  console.log('Initializing app...');

  // Get the root element
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found!');
    console.error('Cannot initialize app without root element');
    // Reset flag so it can be retried
    delete window.__APP_INITIALIZED__;
  } else {
    console.log('Root element found, creating root...');

    // Add global error handlers BEFORE rendering
    // Only log errors, don't interfere with React rendering
    if (!window.__ERROR_HANDLERS_ADDED__) {
      window.__ERROR_HANDLERS_ADDED__ = true;
      
      window.addEventListener('error', (event) => {
        console.error('Global error:', event.error, event.error?.stack);
        // Don't prevent default - let browser handle it normally
        // Only log for debugging
      }, false);

      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        // Don't prevent default - let browser handle it normally
        // Only log for debugging
      });
    }

    // Create root and render
    try {
      console.log('Creating root...');
      const root = createRoot(rootElement);
      console.log('Root created, rendering app...');
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        try {
          console.log('Rendering full app...');
          root.render(
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
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
      });
      
    } catch (error) {
      console.error('Error rendering app:', error);
      // Don't use innerHTML which can cause issues - use React render instead
      if (rootElement && !rootElement.querySelector('.error-display')) {
        try {
          const root = createRoot(rootElement);
          const ErrorDisplay = () => {
            const handleReload = () => {
              // Clear the initialization flag before reload
              delete window.__APP_INITIALIZED__;
              window.location.reload();
            };
            
            return React.createElement('div', {
              style: { padding: '20px', fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh' },
              className: 'error-display'
            }, [
              React.createElement('h1', { key: 'title', style: { color: '#d32f2f' } }, 'Error Loading App'),
              React.createElement('pre', {
                key: 'error',
                style: { background: '#f5f5f5', padding: '10px', overflow: 'auto', border: '1px solid #ccc' }
              }, error.toString() + (error.stack ? '\n\n' + error.stack : '')),
              React.createElement('button', {
                key: 'reload',
                onClick: handleReload,
                style: { padding: '10px 20px', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }
              }, 'Reload Page')
            ]);
          };
          
          root.render(React.createElement(ErrorDisplay));
        } catch (renderError) {
          console.error('Error rendering error screen:', renderError);
          // Fallback to simple text
          rootElement.textContent = 'Error loading app. Please refresh the page.';
        }
      }
    }
  } // Close the else block from rootElement check
} // Close the if (!window.__APP_INITIALIZED__) block


