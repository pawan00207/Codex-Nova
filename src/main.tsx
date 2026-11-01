import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for PWA & Offline Support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[CodexNova] ServiceWorker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[CodexNova] ServiceWorker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
