import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { PricingA, PricingB, type PricingTier } from './Pricing';
import * as stories from './Pricing.stories';

const composed = composeStories(stories);

describe('Pricing (section) — smoke tests', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const simpleTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: ['1 project', 'Community support'],
    action: { label: 'Get started', variant: 'outline' },
  },
  {
    name: 'Pro',
    price: '$20',
    period: '/mo',
    features: ['Unlimited projects', 'Priority support'],
    action: { label: 'Start trial', variant: 'primary' },
    popular: true,
  },
];

describe('PricingA — content-driven', () => {
  it('renders tier names from props', () => {
    const { getByText } = render(<PricingA tiers={simpleTiers} />);
    getByText('Free');
    getByText('Pro');
  });

  it('renders tier features', () => {
    const { getByText } = render(<PricingA tiers={simpleTiers} />);
    getByText('1 project');
    getByText('Unlimited projects');
  });

  it('renders heading and sub when provided', () => {
    const { getByText } = render(
      <PricingA tiers={simpleTiers} heading="Plans for everyone" sub="No hidden fees" />,
    );
    getByText('Plans for everyone');
    getByText('No hidden fees');
  });

  it('shows Popular badge for popular tier', () => {
    const { getAllByText } = render(<PricingA tiers={simpleTiers} />);
    expect(getAllByText('Popular').length).toBe(1);
  });

  it('does not show Popular badge for non-popular tier', () => {
    const nonPopularTiers: PricingTier[] = [{ name: 'Basic', price: '$0' }];
    const { queryByText } = render(<PricingA tiers={nonPopularTiers} />);
    expect(queryByText('Popular')).toBeNull();
  });

  it('renders action buttons with correct labels', () => {
    const { getByText } = render(<PricingA tiers={simpleTiers} />);
    getByText('Get started');
    getByText('Start trial');
  });

  it('children override replaces auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <PricingA tiers={simpleTiers}>
        <span>custom override</span>
      </PricingA>,
    );
    getByText('custom override');
    expect(queryByText('Free')).toBeNull();
  });
});

const toggleTiers: PricingTier[] = [
  {
    name: 'Pro',
    price: '$24',
    priceYearly: '$19',
    period: '/mo',
    action: { label: 'Choose Pro', variant: 'primary' },
  },
  {
    name: 'Business',
    price: '$60',
    priceYearly: '$48',
    period: '/mo',
    action: { label: 'Choose Business', variant: 'outline' },
  },
];

describe('PricingB — period toggle', () => {
  it('renders tier names', () => {
    const { getByText } = render(<PricingB tiers={toggleTiers} />);
    getByText('Pro');
    getByText('Business');
  });

  it('shows monthly prices by default', () => {
    const { getByText } = render(<PricingB tiers={toggleTiers} />);
    getByText('$24');
    getByText('$60');
  });

  it('shows the toggle when any tier has priceYearly', () => {
    const { getByText } = render(<PricingB tiers={toggleTiers} />);
    getByText('Monthly');
    getByText('Annual (−20%)');
  });

  it('hides the toggle when no tier has priceYearly', () => {
    const noYearlyTiers: PricingTier[] = [{ name: 'Solo', price: '$10' }];
    const { queryByText } = render(<PricingB tiers={noYearlyTiers} />);
    expect(queryByText('Monthly')).toBeNull();
  });

  it('switches to yearly prices when Annual tab is clicked', () => {
    const { getByText, queryByText } = render(<PricingB tiers={toggleTiers} />);
    // Initially monthly
    getByText('$24');
    expect(queryByText('$19')).toBeNull();

    // Click Annual tab
    fireEvent.click(getByText('Annual (−20%)'));

    // Yearly prices now visible, monthly hidden
    getByText('$19');
    getByText('$48');
    expect(queryByText('$24')).toBeNull();
    expect(queryByText('$60')).toBeNull();
  });

  it('children override replaces auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <PricingB tiers={toggleTiers}>
        <span>custom override</span>
      </PricingB>,
    );
    getByText('custom override');
    expect(queryByText('Pro')).toBeNull();
  });
});
