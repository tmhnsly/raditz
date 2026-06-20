import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'raditz/styles.css';
import './theme.css'; // project brand overrides — MUST come after raditz/styles.css
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
