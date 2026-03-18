import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import App from './App.tsx';
import './index.css';

if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Default });
  StatusBar.setOverlaysWebView({ overlay: false });
}

createRoot(document.getElementById('root')!).render(<App />);
