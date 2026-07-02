import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Announcement.stories';
import { AnnouncementA, AnnouncementB } from './Announcement';

const composed = composeStories(stories);

describe('Announcement (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('AnnouncementA renders required text', () => {
    render(<AnnouncementA text="Breaking news" />);
    expect(screen.getByText('Breaking news')).toBeTruthy();
  });

  it('AnnouncementA shows a dismiss affordance only when dismissible', () => {
    const { rerender } = render(<AnnouncementA text="x" />);
    expect(screen.queryByLabelText('Dismiss')).toBeNull();
    rerender(<AnnouncementA text="x" dismissible />);
    expect(screen.getByLabelText('Dismiss')).toBeTruthy();
  });

  it('AnnouncementA dismiss button hides the banner when clicked', () => {
    render(<AnnouncementA text="Dismiss me" dismissible />);
    expect(screen.getByText('Dismiss me')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(screen.queryByText('Dismiss me')).toBeNull();
  });

  it('AnnouncementA renders an href action as a text-link anchor', () => {
    render(<AnnouncementA text="x" action={{ label: 'Read more', href: '/blog' }} />);
    const el = screen.getByText('Read more');
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('/blog');
    expect(el.className).toContain('sx-ann__link');
  });

  it('AnnouncementA renders a handler-only action as a real <button> (focusable, same link styling)', () => {
    const onClick = vi.fn();
    render(<AnnouncementA text="x" action={{ label: 'Act now', onClick }} />);
    const el = screen.getByText('Act now') as HTMLButtonElement;
    expect(el.tagName).toBe('BUTTON');
    expect(el.type).toBe('button');
    expect(el.className).toContain('sx-ann__link');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalled();
  });

  it('AnnouncementA children override the body', () => {
    render(
      <AnnouncementA text="unused">
        <span>override content</span>
      </AnnouncementA>,
    );
    expect(screen.getByText('override content')).toBeTruthy();
    expect(screen.queryByText('unused')).toBeNull();
  });

  it('AnnouncementB renders required text', () => {
    render(<AnnouncementB text="Cookie notice" />);
    expect(screen.getByText('Cookie notice')).toBeTruthy();
  });

  it('AnnouncementB children override the body', () => {
    render(
      <AnnouncementB text="unused">
        <span>override content</span>
      </AnnouncementB>,
    );
    expect(screen.getByText('override content')).toBeTruthy();
    expect(screen.queryByText('unused')).toBeNull();
  });
});
