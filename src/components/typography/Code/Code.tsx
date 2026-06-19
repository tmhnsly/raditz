import * as React from 'react';
import { cx } from '../../internal';

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** Render a dark block instead of inline code. @default false */
  block?: boolean;
  children?: React.ReactNode;
}

/**
 * Monospace code. Inline by default; pass `block` for a dark code block.
 */
export function Code({ block = false, className, style, children, ...rest }: CodeProps): React.ReactElement {
  if (block) {
    return (
      <pre className={cx('srx-code-block', className)} style={style} {...rest}>
        <code>{children}</code>
      </pre>
    );
  }
  return <code className={cx('srx-code', className)} style={style} {...rest}>{children}</code>;
}
