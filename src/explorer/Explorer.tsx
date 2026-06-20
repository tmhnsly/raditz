import { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from '../lib/useColorScheme';
import { ThemePicker } from '../lib/ThemePicker';
import { Popover } from '../components/overlay/Popover';
import { IconButton } from '../components/controls/IconButton';
import { Tooltip } from '../components/navigation/Tooltip';
import { cx } from '../components/internal';
import { buildTree, findNode } from './registry';
import { useHashRoute } from './useHashRoute';
import { Sidebar } from './Sidebar';
import { StoryView } from './StoryView';
import '../App.css';
import '../sections/sections.css';
import './explorer.css';

// Built once at module load from the discovered stories.
const tree = buildTree();

// This catalog is large, so nav clicks JUMP instantly rather than smooth-scroll
// (which felt slow over the whole page). Flip to 'smooth' to re-enable animation
// when reusing this shell for a smaller project.
const NAV_BEHAVIOR: ScrollBehavior = 'auto';

const Burger = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function Explorer() {
  const { isDark, toggle: toggleScheme } = useColorScheme();
  const { route, navigate } = useHashRoute();
  // The section currently in view (scroll-spy) — drives the tree highlight/expand.
  const [activeSlug, setActiveSlug] = useState(route);
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => { setActiveSlug(route); }, [route]);

  // The top-level group currently in view — shown in the bar so the title and the
  // theme controls share one row (no separate sticky title bar).
  const currentTitle = useMemo(
    () => (activeSlug ? findNode(tree, activeSlug.split('/')[0])?.name ?? 'Overview' : 'Overview'),
    [activeSlug],
  );

  // Everything renders on one page; nav LINKS scroll to the section's anchor
  // (and update the hash for deep-linking) rather than swapping what's rendered.
  const go = (slug: string): void => {
    navigate(slug);
    setNavOpen(false);
    if (!slug) { window.scrollTo({ top: 0, behavior: NAV_BEHAVIOR }); return; }
    document.getElementById(slug)?.scrollIntoView?.({ behavior: NAV_BEHAVIOR, block: 'start' });
  };

  return (
    <div className={cx('shell', navOpen && 'shell--nav-open')}>
      <div className="rail-scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />

      <aside className="rail">
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
          <div className="expbar__title">{currentTitle}</div>
          <div className="expbar__actions">
            <Popover trigger={<Tooltip align="end" label="Theme & accent"><IconButton variant="soft" icon="paintbrush" aria-label="Theme & accent" /></Tooltip>}>
              <ThemePicker />
            </Popover>
            <Tooltip align="end" label={isDark ? 'Light mode' : 'Dark mode'}>
              <IconButton
                variant="soft"
                icon={isDark ? 'sun' : 'moon'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={isDark}
                onClick={toggleScheme}
              />
            </Tooltip>
          </div>
        </header>

        <StoryView tree={tree} route={route} onActiveChange={setActiveSlug} />
      </main>
    </div>
  );
}
