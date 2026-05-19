import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryProvider } from './app/providers/QueryProvider';
import { AppRouterProvider } from './app/router';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <AppRouterProvider />
    </QueryProvider>
  </StrictMode>,
);
