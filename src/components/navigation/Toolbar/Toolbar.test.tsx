import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Toolbar } from './Toolbar';
import * as stories from './Toolbar.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Toolbar (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const btn = (name: string): HTMLElement => screen.getByRole('button', { name });

describe('Toolbar (behaviour)', () => {
  it('is a single tab stop: only one control keeps tabIndex 0', () => {
    render(
      <Toolbar aria-label="tools">
        <button>One</button>
        <button>Two</button>
        <button>Three</button>
      </Toolbar>,
    );
    const stops = screen.getAllByRole('button').filter((b) => b.tabIndex === 0);
    expect(stops).toEqual([btn('One')]);
    expect(btn('Two').tabIndex).toBe(-1);
    expect(btn('Three').tabIndex).toBe(-1);
  });

  it('arrow keys move focus between controls (with wrap) and move the tab stop', () => {
    render(
      <Toolbar aria-label="tools">
        <button>One</button>
        <button>Two</button>
        <button>Three</button>
      </Toolbar>,
    );
    btn('One').focus();
    fireEvent.keyDown(btn('One'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(btn('Two'));
    expect(btn('Two').tabIndex).toBe(0);
    expect(btn('One').tabIndex).toBe(-1);

    fireEvent.keyDown(btn('Two'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(btn('One'));

    // wraps past the start
    fireEvent.keyDown(btn('One'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(btn('Three'));
  });

  it('Home/End jump to the first/last control', () => {
    render(
      <Toolbar aria-label="tools">
        <button>One</button>
        <button>Two</button>
        <button>Three</button>
      </Toolbar>,
    );
    btn('Two').focus();
    fireEvent.keyDown(btn('Two'), { key: 'End' });
    expect(document.activeElement).toBe(btn('Three'));
    fireEvent.keyDown(btn('Three'), { key: 'Home' });
    expect(document.activeElement).toBe(btn('One'));
  });

  it('skips disabled controls', () => {
    render(
      <Toolbar aria-label="tools">
        <button>One</button>
        <button disabled>Two</button>
        <button>Three</button>
      </Toolbar>,
    );
    btn('One').focus();
    fireEvent.keyDown(btn('One'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(btn('Three'));
  });

  it('focusing a control directly makes it the tab stop (re-entry resumes there)', () => {
    render(
      <Toolbar aria-label="tools">
        <button>One</button>
        <button>Two</button>
      </Toolbar>,
    );
    fireEvent.focus(btn('Two'));
    expect(btn('Two').tabIndex).toBe(0);
    expect(btn('One').tabIndex).toBe(-1);
  });

  it('leaves arrow keys already handled by composite children alone', () => {
    render(
      <Toolbar aria-label="tools">
        <button onKeyDown={(e) => e.preventDefault()}>Owns keys</button>
        <button>Two</button>
      </Toolbar>,
    );
    btn('Owns keys').focus();
    fireEvent.keyDown(btn('Owns keys'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(btn('Owns keys'));
  });

  it('respects aria-orientation="vertical" (Up/Down instead of Left/Right)', () => {
    render(
      <Toolbar aria-label="tools" aria-orientation="vertical">
        <button>One</button>
        <button>Two</button>
      </Toolbar>,
    );
    btn('One').focus();
    fireEvent.keyDown(btn('One'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(btn('One'));
    fireEvent.keyDown(btn('One'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(btn('Two'));
  });
});
