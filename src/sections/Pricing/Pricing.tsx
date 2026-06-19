import { useState } from 'react';
import { Frame } from '../../lib/Frame';
import { Tabs } from '../../components/navigation/Tabs';

export function PricingA() {
  return (
    <Frame>
      <div className="s-pad">
        <div className="s-wrap col sx-gap-6">
          <div className="col sx-center sx-gap-2">
            <h3 className="h-section">Simple, scalable pricing</h3>
            <p className="muted">Start free. Upgrade when your team grows.</p>
          </div>
          <div className="sx-g3 sx-price__grid">
            <div className="srx-card col sx-price__card">
              <div className="col sx-price__plan">
                <strong>Starter</strong>
                <span className="muted sx-fs-body-s">For solo builders</span>
              </div>
              <div>
                <span className="sx-price__num">$0</span>
                <span className="muted">/mo</span>
              </div>
              <button className="srx-btn srx-btn--outline sx-price__btn">Get started</button>
              <ul className="col sx-price__list">
                <li>1 project</li>
                <li>Community support</li>
                <li>Core components</li>
              </ul>
            </div>
            <div className="srx-card col sx-price__card-pop">
              <span className="srx-badge srx-badge--solid sx-price__badge">
                Popular
              </span>
              <div className="col sx-price__plan">
                <strong>Team</strong>
                <span className="muted sx-fs-body-s">For growing teams</span>
              </div>
              <div>
                <span className="sx-price__num">$24</span>
                <span className="muted">/seat/mo</span>
              </div>
              <button className="srx-btn srx-btn--primary sx-price__btn">Start trial</button>
              <ul className="col sx-price__list">
                <li>Unlimited projects</li>
                <li>Priority support</li>
                <li>All components</li>
                <li>Dark mode + themes</li>
              </ul>
            </div>
            <div className="srx-card col sx-price__card">
              <div className="col sx-price__plan">
                <strong>Enterprise</strong>
                <span className="muted sx-fs-body-s">For organizations</span>
              </div>
              <div>
                <span className="sx-price__num">Custom</span>
              </div>
              <button className="srx-btn srx-btn--outline sx-price__btn">Contact sales</button>
              <ul className="col sx-price__list">
                <li>SSO &amp; SAML</li>
                <li>Dedicated support</li>
                <li>Custom themes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function PricingB() {
  const [period, setPeriod] = useState<'mo' | 'yr'>('mo');
  return (
    <Frame>
      <div className="s-pad">
        <div className="s-wrap col sx-price__toggle-col">
          <h3 className="h-section">Pay monthly or save yearly</h3>
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as 'mo' | 'yr')}
            tabs={[{ value: 'mo', label: 'Monthly' }, { value: 'yr', label: 'Annual · −20%' }]}
          />
          <div className="sx-price2 sx-gap-4">
            <div className="srx-card col sx-price__card">
              <strong>Pro</strong>
              <div>
                <span className="sx-price__num">{period === 'mo' ? '$24' : '$19'}</span>
                <span className="muted">/mo</span>
              </div>
              <button className="srx-btn srx-btn--primary sx-price__btn">Choose Pro</button>
            </div>
            <div className="srx-card col sx-price__card">
              <strong>Business</strong>
              <div>
                <span className="sx-price__num">{period === 'mo' ? '$60' : '$48'}</span>
                <span className="muted">/mo</span>
              </div>
              <button className="srx-btn srx-btn--outline sx-price__btn">Choose Business</button>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function Pricing() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · 3 tiers, popular highlighted</span><PricingA /></div>
      <div className="variant"><span className="variant__tag">B · Monthly / annual toggle</span><PricingB /></div>
    </div>
  );
}
