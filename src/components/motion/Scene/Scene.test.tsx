import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Scene } from './Scene';
import * as stories from './Scene.stories';

const composed = composeStories(stories);

describe('Scene (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Scene', () => {
  it('rides data-preset / data-bg and hides itself from the a11y tree', () => {
    const { container } = render(<Scene preset="flash" bg="solid" />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.getAttribute('data-preset')).toBe('flash');
    expect(el.getAttribute('data-bg')).toBe('solid');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders a hero icon for icon presets (and a fallback core without one)', () => {
    const { container: withIcon } = render(<Scene preset="flash" icon={<svg data-testid="glyph" />} />);
    expect(withIcon.querySelector('.rdz-scene__icon [data-testid="glyph"]')).toBeTruthy();
    expect(withIcon.querySelector('.rdz-scene__core')).toBeNull();

    const { container: noIcon } = render(<Scene preset="flash" />);
    expect(noIcon.querySelector('.rdz-scene__core')).toBeTruthy();
  });

  it('pops a badge chip when given one', () => {
    const { container } = render(<Scene preset="spark" icon={<svg />} badge="+1 PT" />);
    const badge = container.querySelector('.rdz-scene__badge');
    expect(badge?.textContent).toBe('+1 PT');
  });

  it('composes the decorations per preset', () => {
    const { container: flash } = render(<Scene preset="flash" icon={<svg />} />);
    expect(flash.querySelectorAll('.rdz-scene__ring')).toHaveLength(2);
    expect(flash.querySelector('.rdz-scene__glow')).toBeTruthy();

    const { container: spark } = render(<Scene preset="spark" icon={<svg />} />);
    expect(spark.querySelectorAll('.rdz-scene__spark')).toHaveLength(3);

    const { container: bars } = render(<Scene preset="bars" />);
    expect(bars.querySelectorAll('.rdz-scene__bar')).toHaveLength(7);

    const { container: grid } = render(<Scene preset="grid" />);
    expect(grid.querySelectorAll('.rdz-scene__cell')).toHaveLength(16);
  });

  it('sets ratio + raw tone as custom properties (not inline paint/animation)', () => {
    const { container } = render(<Scene preset="flash" ratio="1 / 1" tone="var(--danger)" />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.style.getPropertyValue('--rdz-scene-ratio')).toBe('1 / 1');
    expect(el.style.getPropertyValue('--rdz-scene-ink')).toBe('var(--danger)');
  });

  it('fill + paused toggle their modifier classes', () => {
    const { container } = render(<Scene preset="grid" fill paused />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.classList.contains('rdz-scene--fill')).toBe(true);
    expect(el.classList.contains('is-paused')).toBe(true);
  });
});

describe('Scene v2 canvas', () => {
  it('semantic tone → data-tone attribute, no inline ink', () => {
    const { container } = render(<Scene preset="flash" tone="success" />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.getAttribute('data-tone')).toBe('success');
    expect(el.style.getPropertyValue('--rdz-scene-ink')).toBe('');
  });

  it('non-semantic tone (any CSS colour / token var) → inline --rdz-scene-ink, no data-tone', () => {
    const { container } = render(<Scene preset="flash" tone="var(--accent-2-ink)" />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.getAttribute('data-tone')).toBeNull();
    expect(el.style.getPropertyValue('--rdz-scene-ink')).toBe('var(--accent-2-ink)');
  });

  it('speed sets data-speed only when not normal', () => {
    const { container: slow } = render(<Scene preset="flash" speed="slow" />);
    expect((slow.querySelector('.rdz-scene') as HTMLElement).getAttribute('data-speed')).toBe('slow');
    const { container: normal } = render(<Scene preset="flash" />);
    expect((normal.querySelector('.rdz-scene') as HTMLElement).getAttribute('data-speed')).toBeNull();
  });

  it('children mode renders composed content instead of a preset', () => {
    const { container } = render(<Scene><span data-testid="custom" /></Scene>);
    expect(container.querySelector('.rdz-scene__stage [data-testid="custom"]')).toBeTruthy();
    expect((container.querySelector('.rdz-scene') as HTMLElement).getAttribute('data-preset')).toBeNull();
  });
});

describe('Scene layers', () => {
  it('composes decorations with parameters', () => {
    const { container } = render(
      <Scene>
        <Scene.Glow strength="soft" />
        <Scene.Rings count={5} />
        <Scene.Icon motion="spin"><svg data-testid="g" /></Scene.Icon>
        <Scene.Sparks shape="star" count={4} />
        <Scene.Orbit count={2} />
        <Scene.Beam />
      </Scene>,
    );
    expect(container.querySelector('.rdz-scene__glow--soft')).toBeTruthy();
    expect(container.querySelectorAll('.rdz-scene__ring')).toHaveLength(5);
    expect(container.querySelector('.rdz-scene__icon.rdz-scene__m-spin [data-testid="g"]')).toBeTruthy();
    expect(container.querySelectorAll('.rdz-scene__spark')).toHaveLength(4);
    expect(container.querySelectorAll('.rdz-scene__orbit')).toHaveLength(2);
    expect(container.querySelector('.rdz-scene__beam')).toBeTruthy();
  });

  it('Icon without children falls back to a core disc, badge only renders when added', () => {
    const { container } = render(<Scene><Scene.Icon motion="float" /></Scene>);
    expect(container.querySelector('.rdz-scene__core.rdz-scene__m-float')).toBeTruthy();
    expect(container.querySelector('.rdz-scene__badge')).toBeNull();
  });
});

describe('Scene recipes', () => {
  it('presets render the same marks as their layer recipes', () => {
    const { container: preset } = render(<Scene preset="rings" icon={<svg />} />);
    const { container: composed } = render(
      <Scene><Scene.Glow strength="soft" /><Scene.Rings count={4} /><Scene.Icon><svg /></Scene.Icon></Scene>,
    );
    const marks = (c: HTMLElement) =>
      Array.from(c.querySelectorAll('.rdz-scene__stage *')).map((el) => (el as HTMLElement).className).sort();
    expect(marks(preset as HTMLElement)).toEqual(marks(composed as HTMLElement));
  });

  it('new companion presets: beam sweeps, drift floats with a soft halo', () => {
    const { container: beam } = render(<Scene preset="beam" icon={<svg />} />);
    expect(beam.querySelector('.rdz-scene__beam')).toBeTruthy();
    const { container: drift } = render(<Scene preset="drift" icon={<svg />} />);
    expect(drift.querySelector('.rdz-scene__halo--soft')).toBeTruthy();
    expect(drift.querySelector('.rdz-scene__icon.rdz-scene__m-float')).toBeTruthy();
  });

  it('illustrations exist as layers too', () => {
    const { container } = render(<Scene><Scene.Waves /><Scene.Badge>NEW</Scene.Badge></Scene>);
    expect(container.querySelector('.rdz-scene__wave')).toBeTruthy();
    expect(container.querySelector('.rdz-scene__badge')?.textContent).toBe('NEW');
  });
});
