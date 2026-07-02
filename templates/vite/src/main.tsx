import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initColorScheme } from 'raditz';
import 'raditz/styles.css';
import './theme.css'; // project brand overrides — MUST come after raditz/styles.css
import App from './App';
import { DEFAULT_SCHEME } from './ThemeRuntime';

// Pre-paint: set class="dark" BEFORE the first render to avoid a light→dark flash.
// One source of truth — initColorScheme mirrors useColorScheme's key/query/precedence.
initColorScheme(DEFAULT_SCHEME);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
