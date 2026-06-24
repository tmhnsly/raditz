import { describe, it, expect } from 'vitest';
import { resolveFieldError } from './validate';

describe('resolveFieldError', () => {
  it('is empty when natively valid with no custom error', () => {
    expect(resolveFieldError({ valid: true }, '', undefined, '')).toBe('');
  });
  it('prefers a mapped message for the failing validity key', () => {
    expect(resolveFieldError({ valid: false, valueMissing: true }, 'native', { valueMissing: 'Required!' }, '')).toBe('Required!');
  });
  it('falls back to the browser validationMessage when nothing maps', () => {
    expect(resolveFieldError({ valid: false, typeMismatch: true }, 'Enter a valid email', {}, '')).toBe('Enter a valid email');
  });
  it('uses the custom error only when natively valid (native invalidity wins)', () => {
    expect(resolveFieldError({ valid: true }, '', undefined, 'Passwords differ')).toBe('Passwords differ');
    expect(resolveFieldError({ valid: false, valueMissing: true }, 'native', { valueMissing: 'Required' }, 'custom')).toBe('Required');
  });
  it('treats a missing validity (no element) as the custom-error path', () => {
    expect(resolveFieldError(null, '', undefined, 'custom')).toBe('custom');
  });
});
