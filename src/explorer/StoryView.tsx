import { useEffect } from 'react';
import { entries, entriesUnder, findNode, type Entry, type TreeNode } from './registry';
import { LazyMount } from './LazyMount';

const VARIANT_TOTAL = entries.reduce((n, e) => n + e.variants.length, 0);

function EntryBlock({ entry }: { entry: Entry }) {
  const leafName = entry.segments[entry.segments.length - 1];
  return (
    <section className={'sec' + (entry.fullscreen ? ' sec--fullscreen' : '')} id={entry.slug}>
      <div className="sec__head">
        <h2>{leafName}</h2>
        <span className="sec__meta">
          {entry.variants.length} variant{entry.variants.length > 1 ? 's' : ''}
        </span>
      </div>
      {entry.description && <p className="sec__desc">{entry.description}</p>}
      <LazyMount minHeight={180}>
        {entry.variants.map(({ id, name, Component }) => (
          <div className="variant" key={id}>
            {entry.variants.length > 1 && <span className="variant__tag">{name}</span>}
            <Component />
          </div>
        ))}
      </LazyMount>
    </section>
  );
}

/** Scroll-spy: report the section nearest the top of the viewport so the tree
 * can highlight + expand to whatever the user is currently looking at. */
function useScrollSpy(route: string, onActiveChange?: (slug: string) => void): void {
  useEffect(() => {
    if (!onActiveChange) return undefined;
    const secs = Array.from(document.querySelectorAll<HTMLElement>('.sec[id]'));
    if (secs.length < 2) return undefined; // single section — nothing to spy
    const io = new IntersectionObserver(
      (entriesList) => {
        const visible = entriesList
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) onActiveChange((visible[0].target as HTMLElement).id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [route, onActiveChange]);
}

function Overview({ tree, onNavigate }: { tree: TreeNode[]; onNavigate: (s: string) => void }) {
  return (
    <>
      <div className="pagehead">
        <div>
          <span className="srx-eyebrow">
            <span className="srx-eyebrow__dot" />
            SuperRadix · Showcase
          </span>
          <h1>
            Component Library<span className="exp-accent">.</span>
          </h1>
          <p>
            Every foundation, component, section, and page in the system — browse the tree on the
            left. Pick a single entry to see just its variants, or a whole group to see everything
            beneath it. All rendered straight from the same stories Storybook uses.
          </p>
        </div>
        <div className="row">
          <span className="srx-badge srx-badge--soft">{entries.length} entries</span>
          <span className="srx-badge srx-badge--solid">{VARIANT_TOTAL} variants</span>
        </div>
      </div>

      <div className="overview-grid">
        {tree.map((node) => {
          const count = entriesUnder(node.slug).length;
          return (
            <button
              type="button"
              className="overview-card"
              key={node.slug}
              onClick={() => onNavigate(node.slug)}
            >
              <span className="overview-card__name">{node.name}</span>
              <span className="overview-card__count">
                {count} {count === 1 ? 'entry' : 'entries'}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function StoryView({
  tree,
  route,
  onNavigate,
  onActiveChange,
}: {
  tree: TreeNode[];
  route: string;
  onNavigate: (slug: string) => void;
  onActiveChange?: (slug: string) => void;
}) {
  const node = findNode(tree, route);
  const list = entriesUnder(route);
  useScrollSpy(route, onActiveChange);

  if (route === '') return <Overview tree={tree} onNavigate={onNavigate} />;

  if (!list.length) {
    return (
      <div className="pagehead">
        <div>
          <h1>Nothing here</h1>
          <p>
            No stories match <code>{route}</code>.{' '}
            <button type="button" className="srx-btn srx-btn--soft" onClick={() => onNavigate('')}>
              Back to overview
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pagehead">
        <div>
          <span className="srx-eyebrow">
            <span className="srx-eyebrow__dot" />
            {node?.entry ? node.entry.title : route}
          </span>
          <h1>
            {node?.name ?? route}
            <span className="exp-accent">.</span>
          </h1>
        </div>
        <div className="row">
          <span className="srx-badge srx-badge--soft">
            {list.length} {list.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>
      {list.map((entry) => (
        <EntryBlock entry={entry} key={entry.slug} />
      ))}
    </>
  );
}
