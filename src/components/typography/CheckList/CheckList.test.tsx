import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CheckList } from './CheckList';

describe('CheckList', () => {
  it('renders every item as a list entry', () => {
    render(<CheckList items={['One', 'Two', 'Three']} columns={2} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Two')).toBeTruthy();
  });
});
