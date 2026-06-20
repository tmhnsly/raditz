import type { ReactNode } from 'react';
import 'raditz/styles.css';
import './theme.css'; // project brand overrides — MUST come after raditz/styles.css
import { ThemeRuntime } from './theme-runtime';

// Pre-paint: set class="dark" before first paint to avoid a light→dark flash.
// Mirrors useColorScheme exactly: explicit localStorage value wins, else OS.
const noFlash = `(function(){try{var k='rdz-color-scheme',v=localStorage.getItem(k);` +
  `var d=v==='dark'||(v!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);` +
  `if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

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
