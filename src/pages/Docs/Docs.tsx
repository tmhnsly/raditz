import { useState } from 'react';
import { GiMoonOrbit } from 'react-icons/gi';
import type { CSSProperties } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Tree, type TreeNode } from '../../components/navigation/Tree';
import { Search } from '../../components/inputs/Search';
import { Prose } from '../../components/typography/Prose';
import { Badge } from '../../components/display/Badge';

const NAV: TreeNode[] = [
  { id: 'start', label: 'Getting started', children: [
    { id: 'start/install', label: 'Installation' },
    { id: 'start/theming', label: 'Theming' },
  ] },
  { id: 'guides', label: 'Guides', children: [
    { id: 'guides/tokens', label: 'Tokens' },
    { id: 'guides/sections', label: 'Sections' },
    { id: 'guides/pages', label: 'Pages' },
  ] },
  { id: 'components', label: 'Components' },
  { id: 'changelog', label: 'Changelog' },
];

const TOC = [
  { id: 'install', label: 'Installation' },
  { id: 'peer-deps', label: 'Peer dependencies' },
  { id: 'theming', label: 'Theming' },
  { id: 'next-steps', label: 'Next steps' },
];

const BRAND: CSSProperties = { width: '1.6rem', height: '1.6rem', display: 'inline-grid', placeItems: 'center', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: 'var(--on-accent)' };

/**
 * Docs — a documentation page: AppShell sidebar (Tree nav + search) around a
 * Prose article with an on-page table of contents. The reader picks a page in
 * the tree; the TOC keys the article's headings. Prose gives the body its
 * rhythm; everything re-themes with tokens.
 */
export function Docs() {
  const [sel, setSel] = useState('start/install');

  return (
    <div className="rdz-page">
      <AppShell
        brand={<><span style={BRAND}><GiMoonOrbit /></span>Raditz docs</>}
        search={<Search size="sm" placeholder="Search docs…" />}
        nav={(
          <Tree
            items={NAV}
            selectedId={sel}
            defaultExpandedIds={['start', 'guides']}
            onSelect={(id, node) => { if (!node.children?.length) setSel(id); }}
            toggleOnRowClick={false}
            aria-label="Docs navigation"
          />
        )}
        breadcrumbs={<span className="docs__crumb">Getting started / Installation</span>}
      >
        <div className="docs">
          <Prose className="docs__body">
            <Badge variant="soft">v0.2</Badge>
            <h1>Installation</h1>
            <p className="lead">Add Raditz to a React app in two steps — install the package, import the stylesheet, and start composing.</p>

            <h2 id="install">Installation</h2>
            <p>Pin the package from your registry of choice, then import the bundled stylesheet once at your app root.</p>
            <pre><code>{`pnpm add raditz\n// app entry\nimport 'raditz/styles.css';`}</code></pre>

            <h2 id="peer-deps">Peer dependencies</h2>
            <p>Raditz expects a React 18+ runtime. Everything else — tokens, styles, icons — ships with the package.</p>
            <ul>
              <li><code>react</code> and <code>react-dom</code> (18 or 19)</li>
              <li>A bundler that can import CSS (Vite, Next, etc.)</li>
            </ul>

            <h2 id="theming">Theming</h2>
            <p>Re-point the accent and the whole system follows — components, sections, and charts alike.</p>
            <pre><code>{`:root { --accent: var(--jade-9); }`}</code></pre>
            <blockquote>Author with semantic tokens, never raw values.</blockquote>

            <h2 id="next-steps">Next steps</h2>
            <p>Browse the components, compose a page from sections, or read the token guide to make it yours.</p>
          </Prose>

          <aside className="docs__toc" aria-label="On this page">
            <span className="docs__toc-title">On this page</span>
            <nav>
              {TOC.map((t) => (
                <a key={t.id} href={`#${t.id}`} className="docs__toc-link">{t.label}</a>
              ))}
            </nav>
          </aside>
        </div>
      </AppShell>
    </div>
  );
}
