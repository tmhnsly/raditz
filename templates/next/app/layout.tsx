import type { ReactNode } from 'react';
import 'raditz/styles.css';
import './theme.css'; // project brand overrides — MUST come after raditz/styles.css
import { ThemeRuntime, DEFAULT_SCHEME } from './theme-runtime';

// Pre-paint: set class="dark" before first paint to avoid a light→dark flash.
// Mirrors useColorScheme exactly: explicit localStorage value wins, else DEFAULT_SCHEME
// ('dark' → always dark; 'light' → never; 'system' → follow OS).
const noFlash = `(function(){try{var k='rdz-color-scheme',d='${DEFAULT_SCHEME}',v=localStorage.getItem(k);` +
  `var dark=v==='dark'||(v!=='light'&&(d==='dark'||(d!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)));` +
  `if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body>
        <ThemeRuntime />
        {children}
      </body>
    </html>
  );
}
