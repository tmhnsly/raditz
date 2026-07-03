import { NavbarA } from '../../sections/Navbar';
import { FooterA } from '../../sections/Footer';
import { Prose } from '../../components/typography/Prose';
import { Avatar } from '../../components/surfaces/Avatar';
import { Badge } from '../../components/display/Badge';
import { demoWide } from '../../demos/images';

/**
 * Article — a long-form editorial page: the glass Navbar over a titled header
 * (eyebrow, headline, byline, cover) and a {@link Prose} body, closed by the
 * Footer. Prose gives the rendered rich text its rhythm, so a CMS/Markdown body
 * drops straight in. Re-themes from the same tokens as every other page.
 */
export function Article() {
  return (
    <div className="rdz-page">
      <NavbarA
        brand={{ name: 'Raditz', logo: <span className="sx-nav__logo-glyph">R</span> }}
        links={[
          { label: 'Writing', href: '#' },
          { label: 'Work', href: '#' },
          { label: 'About', href: '#' },
        ]}
        actions={[{ label: 'Subscribe', href: '#', variant: 'primary' }]}
      />

      <article className="art">
        <header className="art__head">
          <Badge variant="soft">Engineering</Badge>
          <h1 className="art__title">Designing a token system that re-themes itself</h1>
          <p className="art__standfirst">One accent variable, every surface. How a small set of agreements about colour and space lets a whole product change its skin without touching a component.</p>
          <div className="art__byline">
            <Avatar initials="AL" size="sm" />
            <span>Ada Lovelace</span>
            <span className="art__dot" aria-hidden="true">·</span>
            <span>8 min read</span>
            <span className="art__dot" aria-hidden="true">·</span>
            <time dateTime="2026-07-03">Jul 3, 2026</time>
          </div>
        </header>

        <img className="art__cover" src={demoWide} alt="Layered ridgelines fading into mist" />

        <Prose className="art__body" size="lg">
          <p className="lead">A design system is less a kit of parts than a set of agreements — about spacing, colour, and the words we use for both. Get the agreements right and the parts almost draw themselves.</p>
          <p>Every component reads from the same tokens, so a single accent change re-themes the whole page. The trick is to never let a raw value leak into a component: authors reach for semantic names, and the names resolve to the scale.</p>
          <h2>Why semantic tokens win</h2>
          <p>Raw hex values scatter intent across a codebase. Semantic tokens gather it in one place, so a rebrand is a diff in the token file rather than a hunt through every stylesheet.</p>
          <ul>
            <li>Author with semantic tokens, never raw values.</li>
            <li>Match sibling elements — one radius per group.</li>
            <li>Prefer container queries over breakpoints.</li>
          </ul>
          <blockquote>The backdrop should feel like depth, never decoration.</blockquote>
          <h2>Spacing is a rhythm, not a number</h2>
          <p>A modular scale keeps vertical rhythm consistent whether you're stacking a form or an essay. Prose here uses the same scale as the rest of the system, so an article and a settings panel feel like siblings.</p>
          <pre><code>{`:root { --accent: var(--jade-9); }\n/* every surface follows */`}</code></pre>
          <p>That's the whole idea: change one thing, and the system carries it everywhere it belongs.</p>
        </Prose>
      </article>

      <FooterA
        brand={{ name: 'Raditz', blurb: 'A modular design foundation built on Radix that re-themes from a single accent.' }}
        columns={[
          { heading: 'Writing', links: [{ label: 'Latest' }, { label: 'Archive' }, { label: 'Tags' }] },
          { heading: 'Elsewhere', links: [{ label: 'GitHub', href: 'https://github.com' }, { label: 'Mastodon' }] },
        ]}
      />
    </div>
  );
}
