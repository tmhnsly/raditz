import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountUp, parseCountUp } from './CountUp';

describe('parseCountUp', () => {
  it('splits prefix / number / suffix and counts decimals', () => {
    expect(parseCountUp('$2.5M')).toEqual({ pre: '$', num: 2.5, post: 'M', decimals: 1 });
    expect(parseCountUp('10k+')).toEqual({ pre: '', num: 10, post: 'k+', decimals: 0 });
    expect(parseCountUp('99.9%')).toEqual({ pre: '', num: 99.9, post: '%', decimals: 1 });
    expect(parseCountUp('1,200')).toEqual({ pre: '', num: 1200, post: '', decimals: 0 });
    expect(parseCountUp(4200)).toEqual({ pre: '', num: 4200, post: '', decimals: 0 });
  });
  it('returns num=null for a non-numeric string', () => {
    expect(parseCountUp('soon').num).toBeNull();
  });
});

describe('CountUp', () => {
  it('renders the final value (with prefix/suffix) for SSR / reduced motion', () => {
    render(<CountUp value="$2.5M" />);
    expect(screen.getByText('$2.5M')).toBeTruthy();
  });
  it('renders a non-numeric value verbatim', () => {
    render(<CountUp value="Coming soon" />);
    expect(screen.getByText('Coming soon')).toBeTruthy();
  });
});
