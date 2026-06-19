import { useEffect, useState } from 'react';
import { useDarkMode } from '../lib/useDarkMode';
import { ThemePicker } from '../lib/ThemePicker';
import { Popover } from '../components/overlay/Popover';
import { cx } from '../components/internal';
import { buildTree } from './registry';
import { useHashRoute } from './useHashRoute';
import { Sidebar } from './Sidebar';
import { StoryView } from './StoryView';
import '../App.css';
import '../sections/sections.css';
import './explorer.css';

// Built once at module load from the discovered stories.
const tree = buildTree();

const Burger = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function Explorer() {
  const [dark, setDark] = useDarkMode();
  const { route, navigate } = useHashRoute();
  // The section currently in view (scroll-spy) — drives the tree highlight/expand.
  const [activeSlug, setActiveSlug] = useState(route);
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => { setActiveSlug(route); }, [route]);

  // Everything renders on one page; nav LINKS scroll to the section's anchor
  // (and update the hash for deep-linking) rather than swapping what's rendered.
  const go = (slug: string): void => {
    navigate(slug);
    setNavOpen(false);
    if (!slug) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(slug)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={cx('shell', navOpen && 'shell--nav-open')}>
      <div className="rail-scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />

      <aside className="rail">
        <div className="rail__brand rail__brand--desktop">
          <span className="mark">S</span>SuperRadix
        </div>
        <Sidebar tree={tree} route={route} activeSlug={activeSlug} onNavigate={go} />
      </aside>

      <main className="main">
        <header className="expbar">
          <div className="expbar__left">
            <button
              type="button"
              className="expbar__burger"
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((o) => !o)}
            >
              <Burger />
            </button>
            <div className="rail__brand expbar__brand"><span className="mark">S</span>SuperRadix</div>
          </div>
          <div className="expbar__actions">
            <Popover trigger={<button type="button" className="srx-btn srx-btn--soft">Theme</button>}>
              <ThemePicker />
            </Popover>
            <button
              type="button"
              className="srx-btn srx-btn--soft"
              aria-pressed={dark}
              onClick={() => setDark((d) => !d)}
            >
              {dark ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>

        <StoryView tree={tree} route={route} onActiveChange={setActiveSlug} />
      </main>
    </div>
  );
}
