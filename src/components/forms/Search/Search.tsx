import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal';
import { Icon } from '../../foundation/Icon/Icon';

export interface SearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Trailing hint, e.g. a `<kbd>esc</kbd>`. */
  hint?: ReactNode;
  /** Bordered standalone box, or a plain header row (inside popovers/menus). @default "field" */
  variant?: 'field' | 'plain';
  /** @default "md" */
  size?: 'sm' | 'md';
}

/**
 * Search — the one search input used everywhere search appears (Combobox,
 * CommandPalette, the explorer tree). A leading search icon + a borderless
 * input, so every "search" looks, feels and behaves the same. `variant="field"`
 * is a bordered standalone box; `variant="plain"` is a header row for popovers.
 * Forwards its ref so callers can autofocus it. Pair with `fuzzyFilter`.
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { hint, variant = 'field', size = 'md', className, placeholder = 'Search…', ...rest },
  ref,
) {
  return (
    <div className={cx('srx-search', `srx-search--${variant}`, size === 'sm' && 'srx-search--sm', className)}>
      <Icon name="search" size="1em" className="srx-search__icon" />
      <input ref={ref} type="search" className="srx-search__input" placeholder={placeholder} aria-label={placeholder} {...rest} />
      {hint ? <span className="srx-search__hint">{hint}</span> : null}
    </div>
  );
});
