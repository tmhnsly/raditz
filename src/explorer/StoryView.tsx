import { useEffect, useMemo } from 'react';
import { cx } from '../components/internal';
import { entries, type Entry, type TreeNode } from './registry';
import { LazyMount } from './LazyMount';

const VARIANT_TOTAL = entries.reduce((n, e) => n + e.variants.length, 0);

type PageRow =
  | { kind: 'group'; slug: string; name: string; level: number }
  | { kind: 'entry'; slug: string; entry: Entry };

// Pre-order the tree into a flat list of group headings + entries, so the whole
// system renders on one page in tree order with anchorable ids.
function pageRows(tree: TreeNode[], level = 0, out: PageRow[] = []): PageRow[] {
  for (const node of tree) {
    if (node.entry) {
      out.push({ kind: 'entry', slug: node.slug, entry: node.entry });
    } else {
      out.push({ kind: 'group', slug: node.slug, name: node.name, level });
      if (node.children) pageRows(node.children, level + 1, out);
    }
  }
  return out;
}

/** A group heading in the long page. Top-level (l0) sticks under the bar and
 * shares its frosted surface (see App.css) so the two read as one sticky unit. */
function GroupHeading({ slug, name, level }: { slug: string; name: string; level: number }) {
  return (
    <h2 id={slug} className={cx('page-group', `page-group--l${level}`)}>
      {name}
    </h2>
  );
}

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
 * highlights + expands to whatever the user is scrolled to. */
function useScrollSpy(onActiveChange?: (slug: string) => void): void {
  useEffect(() => {
    if (!onActiveChange) return undefined;
    const secs = Array.from(document.querySelectorAll<HTMLElement>('.sec[id]'));
    if (!secs.length) return undefined;
    const io = new IntersectionObserver(
      (list) => {
        const visible = list
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) onActiveChange((visible[0].target as HTMLElement).id);
      },
      { rootMargin: '0px 0px -75% 0px', threshold: 0 },
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onActiveChange]);
}

export function StoryView({
  tree,
  route,
  onActiveChange,
}: {
  tree: TreeNode[];
  route: string;
  onActiveChange?: (slug: string) => void;
}) {
  const rows = useMemo(() => pageRows(tree), [tree]);
  useScrollSpy(onActiveChange);

  // Deep-link: on first load, jump to the section named in the hash.
  useEffect(() => {
    if (!route) return;
    const el = document.getElementById(route);
    el?.scrollIntoView?.({ block: 'start' });
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="pagehead">
        <div>
          <span className="rdz-eyebrow">
            <span className="rdz-eyebrow__dot" />
            Raditz · Showcase
          </span>
          <h1>
            Component Library<span className="exp-accent">.</span>
          </h1>
          <p>
            Every foundation, component, section and page on one scrollable page — jump with the tree
            or search; offscreen sections lazy-load so it stays fast to scan for regressions.
          </p>
        </div>
        <div className="row">
          <span className="rdz-badge rdz-badge--soft">{entries.length} entries</span>
          <span className="rdz-badge rdz-badge--solid">{VARIANT_TOTAL} variants</span>
        </div>
      </div>

      {rows.map((r) =>
        r.kind === 'group' ? (
          <GroupHeading key={r.slug} slug={r.slug} name={r.name} level={r.level} />
        ) : (
          <EntryBlock key={r.slug} entry={r.entry} />
        ),
      )}
    </>
  );
}
