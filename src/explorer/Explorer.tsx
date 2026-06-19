import { useDarkMode } from '../lib/useDarkMode';
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

  return (
    <div className="shell">
      <aside className="rail">
        <div className="rail__brand">
          <span className="mark">S</span>SuperRadix
        </div>
        <Sidebar tree={tree} route={route} onNavigate={navigate} />
      </aside>

      <main className="main">
        <button
          className="srx-btn srx-btn--soft themeBtn"
          aria-pressed={dark}
          onClick={() => setDark((d) => !d)}
        >
          {dark ? 'Light' : 'Dark'}
        </button>

        <StoryView tree={tree} route={route} onNavigate={navigate} />
      </main>
    </div>
  );
}
