import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Ensure theme is applied before first paint (prevents background mismatch flashes)
try {
  const savedTheme = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', savedTheme || 'dark');
} catch {
  // Ignore (e.g. storage blocked); fall back to default CSS variables
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
