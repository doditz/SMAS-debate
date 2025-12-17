

import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Using conventional import without extension. The main fix was providing a valid App module.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);