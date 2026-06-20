import type { ReactNode } from 'react';
import { SectionShell, SectionActions, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';

export interface NotFoundProps extends SectionBaseProps {
  /** Page heading. @default 'Page not found' */
  title?: ReactNode;
  /** Body copy. */
  message?: ReactNode;
  /** Recovery actions. */
  actions?: SectionAction[];
}

/** NotFound A — centered 404 page. */
export function NotFoundA({ title, message, actions, background = 'none', children, ...props }: NotFoundProps) {
  return (
    <SectionShell wrap="col sx-center sx-gap-4" background={background} {...props}>
      {children ?? (
        <>
          <span className="sx-nf__code">404</span>
          <h3 className="h-section">{title ?? 'Page not found'}</h3>
          {message && <p className="lede sx-nf__lede">{message}</p>}
          <SectionActions actions={actions} size="lg" className="row sx-row-center" />
        </>
      )}
    </SectionShell>
  );
}
