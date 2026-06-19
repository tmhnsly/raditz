import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/components'; // co-located per-component styles (aggregated)
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
