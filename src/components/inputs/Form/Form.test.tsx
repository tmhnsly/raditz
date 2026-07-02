import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Form.stories';
import { Form } from './Form';
import type { FormFieldSpec } from './Form';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Form', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('reveals a `when` field only once its condition is met', () => {
    render(<composed.ConditionalField />);
    // Hidden initially (reason !== 'Other').
    expect(screen.queryByLabelText(/please specify/i)).toBeNull();
    // Selecting "Other" reveals it.
    fireEvent.change(screen.getByLabelText(/reason for contact/i), { target: { value: 'Other' } });
    expect(screen.getByLabelText(/please specify/i)).toBeTruthy();
    // Switching away hides it again.
    fireEvent.change(screen.getByLabelText(/reason for contact/i), { target: { value: 'sales' } });
    expect(screen.queryByLabelText(/please specify/i)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Live-validation state machine. The pure cores (resolveFieldError, formModel)
// are unit-tested; these pin the Form composer's submitted-gating, error wiring
// (Field's aria-describedby / aria-invalid), live recompute, and `when` pruning
// through the public interface.
// ---------------------------------------------------------------------------

// One field per control kind, each with mapped valueMissing copy so the
// assertions don't depend on jsdom's browser validationMessage.
const makeFields = (): FormFieldSpec[] => [
  { name: 'name', label: 'Name', required: true, messages: { valueMissing: 'Name is required' } },
  {
    name: 'topic', label: 'Topic', type: 'select', required: true, placeholder: 'Choose…',
    options: [{ value: 'sales', label: 'Sales' }, { value: 'other', label: 'Other' }],
    messages: { valueMissing: 'Pick a topic' },
  },
  { name: 'notes', label: 'Notes', type: 'textarea', required: true, messages: { valueMissing: 'Notes are required' } },
  {
    name: 'detail', label: 'Detail', required: true,
    when: (v) => v.topic === 'other',
    messages: { valueMissing: 'Detail is required' },
  },
];

const submitButton = (): HTMLElement => screen.getByRole('button', { name: 'Submit' });

describe('Form validation state machine', () => {
  it('shows no errors while typing before the first submit', () => {
    render(<Form fields={makeFields()} onSubmit={vi.fn()} />);
    const name = screen.getByLabelText(/^name/i);

    // Type, then empty the required field again — still pre-submit, so quiet.
    fireEvent.change(name, { target: { value: 'T' } });
    fireEvent.change(name, { target: { value: '' } });
    fireEvent.blur(name);

    expect(screen.queryByText('Name is required')).toBeNull();
    expect(name.getAttribute('aria-invalid')).toBeNull();
    expect(document.querySelector('.rdz-field__error')).toBeNull();
  });

  it('renders wired errors for every visible field kind on invalid submit and withholds onSubmit', () => {
    const onSubmit = vi.fn();
    render(<Form fields={makeFields()} onSubmit={onSubmit} />);

    fireEvent.click(submitButton());

    // input / select / textarea all validate required the same way, and each
    // control is linked to its message via aria-describedby + aria-invalid.
    const cases: Array<[RegExp, string, string]> = [
      [/^name/i, 'Name is required', 'INPUT'],
      [/^topic/i, 'Pick a topic', 'SELECT'],
      [/^notes/i, 'Notes are required', 'TEXTAREA'],
    ];
    for (const [label, message, tag] of cases) {
      const control = screen.getByLabelText(label);
      expect(control.tagName).toBe(tag);
      expect(control.getAttribute('aria-invalid')).toBe('true');
      const msgId = control.getAttribute('aria-describedby');
      expect(msgId).toBeTruthy();
      expect(document.getElementById(msgId!)?.textContent).toBe(message);
    }
    expect(onSubmit).not.toHaveBeenCalled();
    // The `when`-hidden field was neither rendered nor validated.
    expect(screen.queryByLabelText(/^detail/i)).toBeNull();
    expect(screen.queryByText('Detail is required')).toBeNull();
  });

  it('recomputes a field live on change after a failed submit', () => {
    render(<Form fields={makeFields()} onSubmit={vi.fn()} />);
    fireEvent.click(submitButton());

    const name = screen.getByLabelText(/^name/i);
    expect(screen.getByText('Name is required')).toBeTruthy();

    // Fixing the field clears its error immediately (no second submit needed)…
    fireEvent.change(name, { target: { value: 'Tom' } });
    expect(screen.queryByText('Name is required')).toBeNull();
    expect(name.getAttribute('aria-invalid')).toBeNull();
    // …and the untouched fields keep theirs.
    expect(screen.getByText('Pick a topic')).toBeTruthy();

    // Breaking it again re-raises live — the gate is submitted, not once-only.
    fireEvent.change(name, { target: { value: '' } });
    expect(screen.getByText('Name is required')).toBeTruthy();
  });

  it('prunes a hidden `when` field’s stale error and excludes it from submit validation', () => {
    const onSubmit = vi.fn();
    render(<Form fields={makeFields()} onSubmit={onSubmit} />);

    // Fill everything visible, reveal the conditional field, leave it empty.
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Tom' } });
    fireEvent.change(screen.getByLabelText(/^topic/i), { target: { value: 'other' } });
    fireEvent.change(screen.getByLabelText(/^notes/i), { target: { value: 'hi' } });
    fireEvent.click(submitButton());

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Detail is required')).toBeTruthy();

    // Switching the controlling value hides the field AND prunes its error.
    fireEvent.change(screen.getByLabelText(/^topic/i), { target: { value: 'sales' } });
    expect(screen.queryByLabelText(/^detail/i)).toBeNull();
    expect(screen.queryByText('Detail is required')).toBeNull();

    // Hidden fields are excluded from submit validation: the form is now valid.
    fireEvent.click(submitButton());
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with the values map when every visible field is valid', () => {
    const onSubmit = vi.fn();
    render(<Form fields={makeFields()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Tom' } });
    fireEvent.change(screen.getByLabelText(/^topic/i), { target: { value: 'sales' } });
    fireEvent.change(screen.getByLabelText(/^notes/i), { target: { value: 'hello' } });
    fireEvent.click(submitButton());

    expect(onSubmit).toHaveBeenCalledTimes(1);
    // The whole values map is delivered — including the never-shown `when`
    // field's (empty) value; hiding excludes it from validation, not the map.
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Tom', topic: 'sales', notes: 'hello', detail: '' });
    expect(document.querySelector('.rdz-field__error')).toBeNull();
  });
});
