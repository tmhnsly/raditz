'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { SectionShell, SectionActionButton, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';
import { Tabs } from '../../components/navigation/Tabs';

export interface PricingTier {
  name: ReactNode;
  price: ReactNode;
  /** Yearly price displayed when the annual toggle is active (PricingB). */
  priceYearly?: ReactNode;
  /** Period label, e.g. "/mo". */
  period?: ReactNode;
  blurb?: ReactNode;
  features?: ReactNode[];
  action?: SectionAction;
  popular?: boolean;
}

export interface PricingProps extends SectionBaseProps {
  /** Tiers to render as cards. */
  tiers: PricingTier[];
  heading?: ReactNode;
  sub?: ReactNode;
  /** Align the heading block: 'center' or 'start' (left). @default 'center' */
  align?: 'start' | 'center';
}

/** Private: renders one pricing tier card. `displayPrice` lets the caller
 * substitute the period-toggled price (PricingB). `wrapPlan` wraps name+blurb
 * in the `sx-price__plan` column used by PricingA. */
function TierCard({
  tier,
  displayPrice,
  wrapPlan,
}: {
  tier: PricingTier;
  displayPrice: ReactNode;
  wrapPlan: boolean;
}) {
  return (
    <div className={`rdz-card col ${tier.popular ? 'sx-price__card-pop' : 'sx-price__card'}`}>
      {tier.popular && (
        <span className="rdz-badge rdz-badge--solid sx-price__badge">Popular</span>
      )}
      {wrapPlan ? (
        <div className="col sx-price__plan">
          <strong>{tier.name}</strong>
          {tier.blurb && <span className="muted sx-fs-body-s">{tier.blurb}</span>}
        </div>
      ) : (
        <>
          <strong>{tier.name}</strong>
          {tier.blurb && <span className="muted sx-fs-body-s">{tier.blurb}</span>}
        </>
      )}
      <div>
        <span className="sx-price__num">{displayPrice}</span>
        {tier.period && <span className="muted">{tier.period}</span>}
      </div>
      {tier.action && (
        <SectionActionButton
          action={tier.action}
          defaultVariant={tier.popular ? 'primary' : 'outline'}
          className="sx-price__btn"
        />
      )}
      {tier.features && tier.features.length > 0 && (
        <ul className="col sx-price__list">
          {tier.features.map((f, j) => <li key={j}>{f}</li>)}
        </ul>
      )}
    </div>
  );
}

/** PricingA — static 3-up tier cards with optional Popular badge. */
export function PricingA({
  tiers,
  heading,
  sub,
  align = 'center',
  background = 'surface-2',
  children,
  ...props
}: PricingProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          {(heading || sub) && (
            <div className={align === 'center' ? 'col sx-center sx-gap-2' : 'col sx-align-start sx-gap-2'}>
              {heading && <h3 className="h-section">{heading}</h3>}
              {sub && <p className="muted">{sub}</p>}
            </div>
          )}
          <div className="sx-price__grid">
            {tiers.map((tier, i) => (
              <TierCard key={i} tier={tier} displayPrice={tier.price} wrapPlan={true} />
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}

/** PricingB — interactive monthly/yearly toggle (requires a client boundary). */
export function PricingB({
  tiers,
  heading,
  sub,
  background = 'gradient-accent',
  children,
  ...props
}: PricingProps) {
  const [period, setPeriod] = useState<'mo' | 'yr'>('mo');
  const hasYearly = tiers.some((t) => t.priceYearly !== undefined);

  return (
    <SectionShell wrap="col sx-price__toggle-col" background={background} {...props}>
      {children ?? (
        <>
          <div className="sx-price__toggle-head">
            {heading && <h3 className="h-section">{heading}</h3>}
            {sub && <p className="muted">{sub}</p>}
            {hasYearly && (
              <Tabs
                value={period}
                onValueChange={(v) => setPeriod(v as 'mo' | 'yr')}
                tabs={[
                  { value: 'mo', label: 'Monthly' },
                  { value: 'yr', label: 'Annual (−20%)' },
                ]}
              />
            )}
          </div>
          <div className="sx-price2 sx-gap-4">
            {tiers.map((tier, i) => {
              const displayPrice = period === 'yr' && tier.priceYearly !== undefined
                ? tier.priceYearly
                : tier.price;
              return (
                <TierCard key={i} tier={tier} displayPrice={displayPrice} wrapPlan={false} />
              );
            })}
          </div>
        </>
      )}
    </SectionShell>
  );
}
