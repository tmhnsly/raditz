import { describe, it, expect } from 'vitest';
import { GROUP_HEADING_CLASS, SECTION_CLASS, SPY_SECTION_SELECTOR } from './anchors';

// The anchor contract: entry sections with an id are spy-visible; group headings
// and id-less sections are not. Guarded here so a class rename that forgets one
// side of the contract fails loudly instead of silently blinding the spy.
describe('anchor contract', () => {
  const el = (tag: string, className: string, id?: string): Element => {
    const node = document.createElement(tag);
    node.className = className;
    if (id) node.id = id;
    return node;
  };

  it('matches an entry section that carries an id', () => {
    expect(el('section', SECTION_CLASS, 'components/actions/button').matches(SPY_SECTION_SELECTOR)).toBe(true);
  });

  it('matches a fullscreen entry section (modifier keeps the base class)', () => {
    const node = el('section', `${SECTION_CLASS} ${SECTION_CLASS}--fullscreen`, 'pages/landing');
    expect(node.matches(SPY_SECTION_SELECTOR)).toBe(true);
  });

  it('does not match an id-less section', () => {
    expect(el('section', SECTION_CLASS).matches(SPY_SECTION_SELECTOR)).toBe(false);
  });

  it('does not match a group heading — anchored but not spy-visible', () => {
    expect(el('h2', GROUP_HEADING_CLASS, 'components/actions').matches(SPY_SECTION_SELECTOR)).toBe(false);
  });
});
