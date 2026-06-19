import { useState } from 'react';
import type { ChangeEvent, HTMLAttributes, KeyboardEvent, ReactElement } from 'react';
import { cx, useControllableState, onKeys, KEYS } from '../../internal';
import { addTag } from './tags';

export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled tags. */
  value?: string[];
  /** Initial tags (uncontrolled). @default [] */
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  /** Quick-add suggestion chips. */
  suggestions?: string[];
  /** Max number of tags. */
  max?: number;
  disabled?: boolean;
}

/**
 * TagInput — a multi-value text input. Type and press Enter or comma to add a
 * tag; Backspace on an empty field removes the last. Controlled with `value`
 * (string[]) / `onChange`, or uncontrolled with `defaultValue`. `suggestions`
 * offers quick-add chips; `max` caps the count.
 */
export function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = 'Add tag…',
  suggestions = [],
  max,
  disabled = false,
  className,
  'aria-label': ariaLabel = 'Add tag',
  'aria-labelledby': ariaLabelledby,
  ...rest
}: TagInputProps): ReactElement {
  const [tags, setTags] = useControllableState<string[]>({ value, defaultValue, onChange });
  const [draft, setDraft] = useState('');

  const add = (raw: string): void => {
    const next = addTag(tags, raw, max);
    if (next) { setTags(next); setDraft(''); }
  };
  const removeAt = (i: number): void => setTags(tags.filter((_, x) => x !== i));
  const onKeyDown = onKeys<KeyboardEvent<HTMLInputElement>>({
    [KEYS.Enter]: (e) => { e.preventDefault(); add(draft); },
    [KEYS.Comma]: (e) => { e.preventDefault(); add(draft); },
    [KEYS.Backspace]: () => { if (!draft && tags.length) removeAt(tags.length - 1); },
  }, { preventDefault: false });
  const remaining = suggestions.filter((s) => !tags.includes(s));

  return (
    <div className={cx('srx-taginput-wrap', className)} {...rest}>
      <div className={cx('srx-taginput', disabled && 'is-disabled')}>
        {tags.map((t, i) => (
          <span className="srx-tag" key={t}>
            {t}
            {!disabled ? (
              <button type="button" className="srx-tag__x" aria-label={`Remove ${t}`} onClick={() => removeAt(i)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
              </button>
            ) : null}
          </span>
        ))}
        <input
          className="srx-taginput__field"
          aria-label={ariaLabelledby ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledby}
          value={draft}
          placeholder={tags.length ? '' : placeholder}
          disabled={disabled || (max !== undefined && tags.length >= max)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
        />
      </div>
      {remaining.length && !disabled ? (
        <div className="srx-taginput__suggest">
          {remaining.map((s) => <button type="button" key={s} className="srx-pill" onClick={() => add(s)}>+ {s}</button>)}
        </div>
      ) : null}
    </div>
  );
}
