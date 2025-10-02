import React from 'react';
import { createRoot } from 'react-dom/client';
import SidePanel from './SidePanel';
import { initializeSettings } from '../../utils/settings';
import './index.css';

// Initialize theme settings on load
initializeSettings().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>,
);