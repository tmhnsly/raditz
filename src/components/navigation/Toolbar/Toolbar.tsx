import type { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface ToolbarProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
}

/**
 * Toolbar — a horizontal container that groups actions (Radix Toolbar). Put
 * IconButtons, Buttons, Toggles and ToggleGroups inside; separate groups with
 * `<Separator orientation="vertical" />`.
 */
export function Toolbar({ as: Tag = 'div', className, children, ...rest }: ToolbarProps): ReactElement {
  return (
    <Tag className={cx('srx-toolbar', className)} role="toolbar" {...rest}>
      {children}
    </Tag>
  );
}
