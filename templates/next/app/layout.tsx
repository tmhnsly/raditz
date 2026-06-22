import type { ReactNode } from 'react';
import { colorSchemeScript } from 'raditz';
import 'raditz/styles.css';
import './theme.css'; // project brand overrides — MUST come after raditz/styles.css
import { ThemeRuntime, DEFAULT_SCHEME } from './theme-runtime';
import { ScrollToTop } from './scroll-to-top';

// Pre-paint: set class="dark" before first paint to avoid a light→dark flash.
// One source of truth — colorSchemeScript mirrors useColorScheme's key/query/precedence.
const noFlash = colorSchemeScript(DEFAULT_SCHEME);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body>
        <ThemeRuntime />
        <ScrollToTop />
        {/* .rdz-page flattens the per-section preview frame so sections stack
            seamlessly edge-to-edge (full-bleed bands with their own inner
            gutters) and the Navbar pins sticky. Every real page composes its
            sections inside this. */}
        <div className="rdz-page">{children}</div>
      </body>
    </html>
  );
}
