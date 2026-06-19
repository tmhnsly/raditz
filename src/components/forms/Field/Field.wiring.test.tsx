import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field, useField } from './Field';

describe('Field — owns label/control/description/validity wiring', () => {
  it('links label → control and points aria-describedby at the error', () => {
    render(<Field label="Email" error="Bad email"><input /></Field>);
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email');
    const msg = screen.getByText('Bad email');
    expect(input.id).toBeTruthy();
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(msg.id);
    expect(msg.id).toBeTruthy();
  });

  it('points aria-describedby at the hint when there is no error', () => {
    render(<Field label="Name" hint="Your full name"><input /></Field>);
    const input = screen.getByRole('textbox');
    const hint = screen.getByText('Your full name');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('marks the control required and shows the asterisk', () => {
    render(<Field label="Name" required><input /></Field>);
    expect(screen.getByRole('textbox').hasAttribute('required')).toBe(true);
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('respects an explicit htmlFor over the generated id', () => {
    render(<Field label="X" htmlFor="custom"><input /></Field>);
    const input = screen.getByRole('textbox');
    expect(input.id).toBe('custom');
    expect(screen.getByText('X').getAttribute('for')).toBe('custom');
  });

  it('does not override props the control sets itself', () => {
    render(<Field label="X" error="e"><input id="mine" aria-describedby="other" /></Field>);
    const input = screen.getByRole('textbox');
    expect(input.id).toBe('mine');
    expect(input.getAttribute('aria-describedby')).toBe('other');
  });

  it('exposes the wiring to a nested control via useField()', () => {
    function Probe(): JSX.Element {
      const f = useField();
      return <span data-testid="probe">{f?.invalid ? 'invalid' : 'ok'}</span>;
    }
    render(<Field label="X" error="e"><div><Probe /></div></Field>);
    expect(screen.getByTestId('probe').textContent).toBe('invalid');
  });
});
