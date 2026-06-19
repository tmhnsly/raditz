import { Frame } from '../../lib/Frame';

export function NotFoundA() {
  return (
    <Frame>
      <div className="s-pad"><div className="s-wrap col sx-center sx-gap-4">
        <span className="sx-nf__code">404</span>
        <h3 className="h-section">This page wandered off</h3>
        <p className="lede sx-nf__lede">The page you’re after doesn’t exist or has moved. Let’s get you back on track.</p>
        <div className="row sx-row-center"><button className="srx-btn srx-btn--primary srx-btn--lg">Back home</button><button className="srx-btn srx-btn--ghost srx-btn--lg">Search docs</button></div>
      </div></div>
    </Frame>
  );
}

export function NotFound() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Centered, big code</span><NotFoundA /></div>
    </div>
  );
}
