import React from 'react';
import { createRoot } from 'react-dom/client';
import SidePanel from './SidePanel';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>,
);