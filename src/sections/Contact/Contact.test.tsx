import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Contact.stories';
import { ContactA } from './Contact';

const composed = composeStories(stories);

describe('Contact (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders header, lede and details (href renders a link)', () => {
    const { container } = render(
      <ContactA
        eyebrow="Contact"
        heading="Get in touch"
        lede="We reply fast."
        details={[
          { label: 'Email', value: 'hello@studio.com', href: 'mailto:hello@studio.com' },
          { label: 'Studio', value: '12 Print Works Lane' },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Get in touch' })).toBeTruthy();
    expect(screen.getByText('We reply fast.')).toBeTruthy();
    // Detail labels ride the mono eyebrow style ('Email' also names a form field,
    // so scope the assertion to the details list).
    const labels = [...container.querySelectorAll('.sx-contact__detail .eyebrow2')].map((el) => el.textContent);
    expect(labels).toEqual(['Email', 'Studio']);
    const link = screen.getByRole('link', { name: 'hello@studio.com' });
    expect(link.getAttribute('href')).toBe('mailto:hello@studio.com');
    // Plain detail (no href) stays a span.
    expect(screen.queryByRole('link', { name: '12 Print Works Lane' })).toBeNull();
    expect(screen.getByText('12 Print Works Lane')).toBeTruthy();
  });

  it('renders the aside under the details', () => {
    render(<ContactA heading="H" aside="Open Mon–Thu" />);
    expect(screen.getByText('Open Mon–Thu')).toBeTruthy();
  });

  it('submit fires onSubmit with the typed values (uncontrolled, FormData)', () => {
    const onSubmit = vi.fn();
    const { container } = render(<ContactA heading="H" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'ada@lovelace.dev' } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Hi there' } });
    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@lovelace.dev', message: 'Hi there' });
  });

  it('uses the submitLabel on the default form button', () => {
    render(<ContactA heading="H" submitLabel="Fire away" />);
    expect(screen.getByRole('button', { name: 'Fire away' })).toBeTruthy();
  });

  it('the form slot replaces the default form entirely', () => {
    const { container } = render(<ContactA heading="H" form={<div>custom form</div>} />);
    expect(screen.getByText('custom form')).toBeTruthy();
    expect(container.querySelector('form')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Send message' })).toBeNull();
  });

  it('children override replaces the auto-rendered body', () => {
    render(
      <ContactA heading="unused heading" details={[{ label: 'unused', value: 'unused too' }]}>
        <span>override content</span>
      </ContactA>,
    );
    expect(screen.getByText('override content')).toBeTruthy();
    expect(screen.queryByText('unused heading')).toBeNull();
    expect(screen.queryByText('unused')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Send message' })).toBeNull();
  });

  it('honours SectionBaseProps (className + image/scrim backdrop)', () => {
    const { container } = render(<ContactA heading="H" className="anchor-cls" image="/x.jpg" scrim />);
    expect(container.querySelector('.anchor-cls')).toBeTruthy();
    expect(container.querySelector('.rdz-secbg--scrim')).toBeTruthy();
    expect(container.querySelector('.rdz-secbg__content .sx-contact')).toBeTruthy();
  });
});
