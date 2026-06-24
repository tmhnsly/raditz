import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.css'; // design tokens: Radix scales → fonts → tokens → reset
import './styles/components'; // co-located per-component styles (aggregated)
import App from './App';
import { applyStoredTheme } from './lib/theme';

// Apply the saved theme (accent / reveal / motion) to <html> before the
// first paint, so a persisted choice shows on load instead of waiting for the
// ThemePicker popover to mount.
applyStoredTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
