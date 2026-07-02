import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Stepper.stories';
import { Stepper } from './Stepper';
import type { StepperStep } from './Stepper';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Stepper', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const STEPS: StepperStep[] = [
  { label: 'Account' },
  { label: 'Shipping', description: 'Where it goes' },
  { label: 'Payment' },
];

describe('Stepper — behaviour', () => {
  it('marks steps complete/current/upcoming around `current`', () => {
    render(<Stepper steps={STEPS} current={1} />);
    const [account, shipping, payment] = screen.getAllByRole('listitem');

    expect(account.getAttribute('data-state')).toBe('complete');
    expect(shipping.getAttribute('data-state')).toBe('current');
    expect(payment.getAttribute('data-state')).toBe('upcoming');

    // Only the current step carries aria-current="step".
    expect(shipping.getAttribute('aria-current')).toBe('step');
    expect(account.getAttribute('aria-current')).toBeNull();
    expect(payment.getAttribute('aria-current')).toBeNull();

    // Completed steps swap their number for a check; the rest keep numbers.
    expect(within(account).queryByText('1')).toBeNull();
    expect(within(shipping).getByText('2')).toBeTruthy();
    expect(within(payment).getByText('3')).toBeTruthy();
  });

  it('is inert without onStepClick: every step button is disabled', () => {
    render(<Stepper steps={STEPS} current={1} />);
    const buttons = screen.getAllByRole('button') as HTMLButtonElement[];
    expect(buttons).toHaveLength(3);
    buttons.forEach((b) => expect(b.disabled).toBe(true));
  });

  it('with onStepClick, completed and current steps are clickable; upcoming are not', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper steps={STEPS} current={1} onStepClick={onStepClick} />);

    // Accessible names include the step number / description (e.g. "3Payment").
    const account = screen.getByRole('button', { name: /Account/ }) as HTMLButtonElement;
    const shipping = screen.getByRole('button', { name: /Shipping/ }) as HTMLButtonElement;
    const payment = screen.getByRole('button', { name: /Payment/ }) as HTMLButtonElement;

    expect(account.disabled).toBe(false);
    expect(shipping.disabled).toBe(false);
    expect(payment.disabled).toBe(true);

    await user.click(account);
    expect(onStepClick).toHaveBeenLastCalledWith(0);
    await user.click(shipping);
    expect(onStepClick).toHaveBeenLastCalledWith(1);
    await user.click(payment); // disabled → no call
    expect(onStepClick).toHaveBeenCalledTimes(2);
  });
});
