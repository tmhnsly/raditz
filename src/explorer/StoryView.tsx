import { useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
import { cx, useReplay } from '../components/internal';
import { entries, type Entry, type TreeNode } from './registry';
import { activeSection } from './scrollSpy';
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

/** One isolated variant preview. The Replay control remounts the preview (a key
 *  bump) so any entrance animation — Reveal / TextReveal / the title-anim heading
 *  entrance / a section's `animate` — re-fires for visual testing, on EVERY
 *  showcase (not just the few sections with a built-in Replay). `.rdz-preview` opts
 *  the preview into the bordered "card" chrome; page entries render their own flat
 *  `.rdz-page` inside. */
function VariantPreview({ name, Component, showTag }: { name: string; Component: ComponentType; showTag: boolean }) {
  const { key, replay } = useReplay();
  return (
    <div className={cx('variant', 'rdz-preview')}>
      {showTag && <span className="variant__tag">{name}</span>}
      <button type="button" className="variant__replay" onClick={replay} aria-label={`Replay ${name}`} title="Replay animations">
        ↻ Replay
      </button>
      <div className="variant__stage" key={key}>
        <Component />
      </div>
    </div>
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
          <VariantPreview key={id} name={name} Component={Component} showTag={entry.variants.length > 1} />
        ))}
      </LazyMount>
    </section>
  );
}

/** Scroll-spy: report the section the reader is on so the tree + breadcrumb track
 * the scroll position. Recomputed from live geometry every scroll frame (see
 * `activeSection`) — NOT from an IntersectionObserver's changed-entries batch,
 * which could hold a stale section under fast scroll or post-lazy-mount reflow. */
function useScrollSpy(onActiveChange?: (slug: string) => void): void {
  useEffect(() => {
    if (!onActiveChange) return undefined;
    let raf = 0;
    let last: string | null = null;
    const compute = (): void => {
      raf = 0;
      const secs = Array.from(document.querySelectorAll<HTMLElement>('.sec[id]')).map((el) => ({
        id: el.id,
        top: el.getBoundingClientRect().top,
      }));
      // Activation line a quarter down the viewport — the section crossing it is "current".
      const id = activeSection(secs, window.innerHeight * 0.25);
      if (id !== last) {
        last = id;
        onActiveChange(id);
      }
    };
    const onScroll = (): void => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
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
