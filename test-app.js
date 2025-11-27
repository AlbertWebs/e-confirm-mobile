// Simple test to verify React is working
import React from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>React is working!</h1>
      <p>If you see this, React is rendering correctly.</p>
    </div>
  );
  console.log('Test app rendered!');
} else {
  console.error('Root element not found!');
}

