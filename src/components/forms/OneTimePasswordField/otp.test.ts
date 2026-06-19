import { describe, it, expect } from 'vitest';
import { otpDigits, withOtpChar, sanitizeOtpPaste } from './otp';

describe('otpDigits', () => {
  it('splits a code into fixed-length boxes, padding short codes with empties', () => {
    expect(otpDigits('12', 4)).toEqual(['1', '2', '', '']);
    expect(otpDigits('1234', 4)).toEqual(['1', '2', '3', '4']);
  });
});

describe('withOtpChar', () => {
  it('sets the char at a box, staying within length', () => {
    expect(withOtpChar('12', 0, '9', 4)).toBe('92');
    expect(withOtpChar('12', 2, '3', 4)).toBe('123');
  });
  it('clearing a box collapses the joined code (box-join behaviour)', () => {
    expect(withOtpChar('123', 1, '', 4)).toBe('13');
  });
});

describe('sanitizeOtpPaste', () => {
  it('strips whitespace and truncates to length', () => {
    expect(sanitizeOtpPaste('1 2 3 4 5 6', 4)).toBe('1234');
    expect(sanitizeOtpPaste('\t12\n34 ', 6)).toBe('1234');
  });
});
