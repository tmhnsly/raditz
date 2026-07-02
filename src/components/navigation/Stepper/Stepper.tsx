'use client';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface StepperStep {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps?: StepperStep[];
  /** Active 0-based index. @default 0 */
  current?: number;
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Makes completed/current steps clickable. */
  onStepClick?: (index: number) => void;
}

/**
 * Stepper — a horizontal (or vertical) progress indicator for multi-step flows.
 * `steps` is `[{ label, description? }]`; `current` is the active 0-based index.
 * Steps before `current` render complete (check), the rest upcoming. Clickable
 * when `onStepClick` is provided.
 */
export function Stepper({ steps = [], current = 0, orientation = 'horizontal', onStepClick, className, ...rest }: StepperProps): ReactElement {
  return (
    <ol className={cx('rdz-stepper', className)} data-orientation={orientation} {...rest}>
      {steps.map((s, i) => {
        const state = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
        const clickable = !!onStepClick && i <= current;
        return (
          <li className="rdz-stepper__step" key={i} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <button
              type="button"
              className="rdz-stepper__node"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(i)}
            >
              <span className="rdz-stepper__dot">
                {state === 'complete'
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  : <span className="rdz-stepper__num">{i + 1}</span>}
              </span>
              <span className="rdz-stepper__text">
                <span className="rdz-stepper__label">{s.label}</span>
                {s.description ? <span className="rdz-stepper__desc">{s.description}</span> : null}
              </span>
            </button>
            {i < steps.length - 1 ? <span className="rdz-stepper__line" aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
