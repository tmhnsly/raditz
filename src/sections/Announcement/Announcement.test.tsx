import { describe, it, expect } from 'vitest';
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
