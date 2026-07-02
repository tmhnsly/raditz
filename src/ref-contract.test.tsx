// Ref contract gate: every input-category primitive must forward a consumer
// ref to its actual control element (the thing a form library registers or a
// caller focuses) — not swallow it in a wrapper. Table-driven so a regression
// on any one primitive fails loudly.
import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Checkbox, Input, Radio, Search, Select, Slider, Switch, Textarea } from './index';

type AnyRef = React.RefObject<HTMLElement>;
const as = <E extends HTMLElement>(ref: AnyRef): React.RefObject<E> => ref as React.RefObject<E>;

interface RefCase {
  name: string;
  /** The element class the forwarded ref must land on. */
  expected: new () => HTMLElement;
  render: (ref: AnyRef) => React.ReactElement;
  /** Extra assertion on the resolved element (e.g. its type/role). */
  check?: (el: HTMLElement) => void;
}

const CASES: RefCase[] = [
  {
    name: 'Input',
    expected: HTMLInputElement,
    render: (ref) => <Input ref={as<HTMLInputElement>(ref)} aria-label="Text" />,
  },
  {
    name: 'Textarea',
    expected: HTMLTextAreaElement,
    render: (ref) => <Textarea ref={as<HTMLTextAreaElement>(ref)} aria-label="Notes" />,
  },
  {
    name: 'Checkbox',
    expected: HTMLInputElement,
    render: (ref) => <Checkbox ref={as<HTMLInputElement>(ref)} aria-label="Agree" />,
    check: (el) => expect((el as HTMLInputElement).type).toBe('checkbox'),
  },
  {
    name: 'Radio',
    expected: HTMLInputElement,
    render: (ref) => <Radio ref={as<HTMLInputElement>(ref)} aria-label="Option" name="g" />,
    check: (el) => expect((el as HTMLInputElement).type).toBe('radio'),
  },
  {
    name: 'Switch',
    expected: HTMLInputElement,
    render: (ref) => <Switch ref={as<HTMLInputElement>(ref)} aria-label="Enable" />,
    check: (el) => expect(el.getAttribute('role')).toBe('switch'),
  },
  {
    // Slider has no native input; the contract is the focusable thumb.
    name: 'Slider',
    expected: HTMLSpanElement,
    render: (ref) => <Slider ref={as<HTMLSpanElement>(ref)} aria-label="Amount" />,
    check: (el) => expect(el.getAttribute('role')).toBe('slider'),
  },
  {
    name: 'Search',
    expected: HTMLInputElement,
    render: (ref) => <Search ref={as<HTMLInputElement>(ref)} />,
    check: (el) => expect((el as HTMLInputElement).type).toBe('search'),
  },
  {
    name: 'Select',
    expected: HTMLSelectElement,
    render: (ref) => <Select ref={as<HTMLSelectElement>(ref)} aria-label="Choice" options={[{ value: 'a', label: 'A' }]} />,
  },
];

describe('input primitives forward their ref to the control element', () => {
  for (const c of CASES) {
    it(`${c.name} → ${c.expected.name}`, () => {
      const ref = React.createRef<HTMLElement>();
      render(c.render(ref));
      expect(ref.current).toBeInstanceOf(c.expected);
      c.check?.(ref.current as HTMLElement);
    });
  }

  it('Checkbox composes the forwarded ref with its indeterminate ref (neither clobbers)', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} aria-label="Some" indeterminate readOnly checked={false} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    // The internal indeterminate callback ref still did its job.
    expect(ref.current!.indeterminate).toBe(true);
  });
});
