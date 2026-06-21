import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Blog.stories';
import { BlogA, BlogB } from './Blog';

const composed = composeStories(stories);

describe('Blog (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders post titles in BlogA', () => {
    const { getByText } = render(
      <BlogA
        posts={[
          { title: 'First Post', tag: 'Engineering', excerpt: 'A short excerpt.' },
          { title: 'Second Post', tag: 'Design' },
        ]}
      />,
    );
    getByText('First Post');
    getByText('Second Post');
    getByText('A short excerpt.');
  });

  it('renders post titles in BlogB', () => {
    const { getByText } = render(
      <BlogB
        posts={[
          { title: 'Row Post', tag: 'Product', date: 'Jun 1' },
        ]}
      />,
    );
    getByText('Row Post');
    getByText('Jun 1');
  });

  it('children override auto-rendered body in BlogA', () => {
    const { getByText, queryByText } = render(
      <BlogA posts={[{ title: 'Hidden' }]}>
        <span>custom blog content</span>
      </BlogA>,
    );
    getByText('custom blog content');
    expect(queryByText('Hidden')).toBeNull();
  });
});
