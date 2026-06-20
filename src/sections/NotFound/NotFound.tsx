import { SectionShell, type SectionVariantProps } from '../../lib/SectionShell';

export function NotFoundA({ background = 'none', ...props }: SectionVariantProps = {}) {
  return (
    <SectionShell wrap="col sx-center sx-gap-4" background={background} {...props}>
      <span className="sx-nf__code">404</span>
      <h3 className="h-section">This page wandered off</h3>
      <p className="lede sx-nf__lede">The page you’re after doesn’t exist or has moved. Let’s get you back on track.</p>
      <div className="row sx-row-center"><button className="rdz-btn rdz-btn--primary rdz-btn--lg">Back home</button><button className="rdz-btn rdz-btn--ghost rdz-btn--lg">Search docs</button></div>
    </SectionShell>
  );
}
