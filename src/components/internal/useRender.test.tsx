import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRender } from './useRender';
import { mergeProps, composeRefs } from './mergeProps';

describe('mergeProps', () => {
  it('concatenates className and merges style (override wins per key)', () => {
    const out = mergeProps(
      { className: 'base', style: { color: 'red', margin: 1 } },
      { className: 'more', style: { color: 'blue' } },
    );
    expect(out.className).toBe('base more');
    expect(out.style).toEqual({ color: 'blue', margin: 1 });
  });

  it('chains matching event handlers (base then override)', () => {
    const calls: string[] = [];
    const out = mergeProps({ onClick: () => calls.push('base') }, { onClick: () => calls.push('override') });
    (out.onClick as () => void)();
    expect(calls).toEqual(['base', 'override']);
  });

  it('keeps base children unless the override provides its own', () => {
    expect(mergeProps({ children: 'kept' }, { className: 'x' }).children).toBe('kept');
    expect(mergeProps({ children: 'kept' }, { children: 'new' }).children).toBe('new');
  });
});

describe('composeRefs', () => {
  it('assigns the node to a callback ref and an object ref', () => {
    const cb = vi.fn();
    const obj: { current: HTMLDivElement | null } = { current: null };
    composeRefs<HTMLDivElement>(cb, obj)(document.createElement('div'));
    expect(cb).toHaveBeenCalled();
    expect(obj.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('useRender', () => {
  const Widget = ({ render, label }: { render?: Parameters<typeof useRender>[0]['render']; label: string }) =>
    useRender({ render, props: { className: 'rdz-widget', 'data-part': 'root', children: label }, state: { on: true } });

  it('renders the default tag when no render is given', () => {
    const { container } = render(<Widget label="hi" />);
    // default tag is div
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('rdz-widget')).toBe(true);
    expect(el.getAttribute('data-part')).toBe('root');
  });

  it('clones an element render, merging the component props onto it', () => {
    render(<Widget render={<a href="/z" />} label="link" />);
    const a = screen.getByText('link') as HTMLAnchorElement;
    expect(a.tagName).toBe('A');
    expect(a.getAttribute('href')).toBe('/z');
    expect(a.classList.contains('rdz-widget')).toBe(true);
  });

  it('calls a function render with merged props', () => {
    render(<Widget render={(props) => <button {...props} type="button" />} label="fn" />);
    const btn = screen.getByText('fn');
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.classList.contains('rdz-widget')).toBe(true);
  });
});
