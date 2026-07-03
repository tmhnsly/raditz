import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './HowItWorks.stories';
import { HowItWorksA, HowItWorksB } from './HowItWorks';

const composed = composeStories(stories);

const steps = [
  { title: 'Install', description: 'Add the package.' },
  { title: 'Compose', description: 'Assemble pages.' },
  { title: 'Ship', description: 'Go live.' },
];

describe('HowItWorks (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('HowItWorksA renders an ordered list with one item per step', () => {
    render(<HowItWorksA items={steps} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('HowItWorksA numbers steps 1-based in the marker', () => {
    const { container } = render(<HowItWorksA items={steps} />);
    const markers = Array.from(container.querySelectorAll('.sx-hiw__marker'));
    expect(markers.map((m) => m.textContent)).toEqual(['1', '2', '3']);
  });

  it('HowItWorksA renders an icon instead of the number when provided', () => {
    const { container } = render(
      <HowItWorksA
        items={[
          { title: 'With icon', icon: <svg data-testid="stepicon" /> },
          { title: 'Without icon' },
        ]}
      />,
    );
    expect(screen.getByTestId('stepicon')).toBeTruthy();
    const markers = Array.from(container.querySelectorAll('.sx-hiw__marker'));
    expect(markers[0]?.textContent).toBe('');
    expect(markers[1]?.textContent).toBe('2');
  });

  it('HowItWorksA renders titles, descriptions and the header block', () => {
    render(<HowItWorksA eyebrow="How" heading="It works" items={steps} />);
    expect(screen.getByText('How')).toBeTruthy();
    expect(screen.getByText('It works')).toBeTruthy();
    expect(screen.getByText('Install')).toBeTruthy();
    expect(screen.getByText('Assemble pages.')).toBeTruthy();
  });

  it('HowItWorksB renders an ordered list with numbered steps', () => {
    render(<HowItWorksB items={steps} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('HowItWorksB renders the media slot beside the list', () => {
    const { container } = render(
      <HowItWorksB items={steps} media={<img data-testid="hiwmedia" src="x.jpg" alt="" />} />,
    );
    expect(screen.getByTestId('hiwmedia')).toBeTruthy();
    expect(container.querySelector('.sx-hiw__split')).toBeTruthy();
  });

  it('HowItWorksB omits the split wrapper without media', () => {
    const { container } = render(<HowItWorksB items={steps} />);
    expect(container.querySelector('.sx-hiw__split')).toBeNull();
  });

  it('HowItWorksA children override auto-rendered body', () => {
    render(
      <HowItWorksA items={[{ title: 'hidden step' }]}>
        <div data-testid="hiwoverride">Custom body</div>
      </HowItWorksA>,
    );
    expect(screen.getByTestId('hiwoverride')).toBeTruthy();
    expect(screen.queryByText('hidden step')).toBeNull();
  });

  it('HowItWorksB children override auto-rendered body', () => {
    render(
      <HowItWorksB items={[{ title: 'hidden step' }]} media={<img data-testid="hiddenmedia" src="x.jpg" alt="" />}>
        <div data-testid="hiwboverride">Custom body</div>
      </HowItWorksB>,
    );
    expect(screen.getByTestId('hiwboverride')).toBeTruthy();
    expect(screen.queryByText('hidden step')).toBeNull();
    expect(screen.queryByTestId('hiddenmedia')).toBeNull();
  });

  it('forwards SectionBaseProps (className, id, data-*) to the section root', () => {
    render(<HowItWorksA items={steps} className="my-hiw" id="how" data-testid="hiwroot" />);
    const root = screen.getByTestId('hiwroot');
    expect(root.classList.contains('my-hiw')).toBe(true);
    expect(root.id).toBe('how');
  });

  it('HowItWorksB forwards SectionBaseProps to the section root', () => {
    render(<HowItWorksB items={steps} className="my-hiw-b" id="how-b" data-testid="hiwbroot" />);
    const root = screen.getByTestId('hiwbroot');
    expect(root.classList.contains('my-hiw-b')).toBe(true);
    expect(root.id).toBe('how-b');
  });
});
