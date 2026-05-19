import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Modal } from './components/common/Modal';
import { Toast } from './components/common/Toast';
import { registerApiInterceptors } from './api/interceptors';
import { QueryProvider } from './app/providers/QueryProvider';
import { AppRouterProvider } from './app/router';
import './styles/globals.css';

registerApiInterceptors();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <AppRouterProvider />
      <Toast />
      <Modal />
    </QueryProvider>
  </StrictMode>,
);
