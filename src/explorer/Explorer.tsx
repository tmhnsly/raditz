import { useEffect, useState } from 'react';
import { useDarkMode } from '../lib/useDarkMode';
import { ThemePicker } from '../lib/ThemePicker';
import { Popover } from '../components/overlay/Popover';
import { buildTree } from './registry';
import { useHashRoute } from './useHashRoute';
import { Sidebar } from './Sidebar';
import { StoryView } from './StoryView';
import '../App.css';
import '../sections/sections.css';
import './explorer.css';

// Built once at module load from the discovered stories.
const tree = buildTree();

export default function Explorer() {
  const [dark, setDark] = useDarkMode();
  const { route, navigate } = useHashRoute();
  // The section currently in view (scroll-spy) — drives the tree highlight/expand.
  // Resets to the route on navigation, then tracks scrolling within the page.
  const [activeSlug, setActiveSlug] = useState(route);
  useEffect(() => { setActiveSlug(route); }, [route]);

  return (
    <div className="shell">
      <aside className="rail">
        <div className="rail__brand">
          <span className="mark">S</span>SuperRadix
        </div>
        <Sidebar tree={tree} route={route} activeSlug={activeSlug} onNavigate={navigate} />
      </aside>

      <main className="main">
        <div className="theme-toolbar">
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

        <StoryView tree={tree} route={route} onNavigate={navigate} onActiveChange={setActiveSlug} />
      </main>
    </div>
  );
}
