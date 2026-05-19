import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function AppBootstrap() {
  return (
    <main>
      <h1>Mystic AI Tarot</h1>
      <p>Frontend application shell is ready.</p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>,
);
