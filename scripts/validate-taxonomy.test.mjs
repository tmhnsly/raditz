import { describe, it, expect } from 'vitest';
import { validateTaxonomy, CATEGORIES } from './validate-taxonomy.mjs';

describe('taxonomy', () => {
  const { errors, counts } = validateTaxonomy();

  it('every component folder is a documented category and its story title matches', () => {
    // A non-empty list means a folder/title drifted — the message names each one.
    expect(errors, errors.join('\n')).toEqual([]);
  });

  it('only the 13 documented categories are in use, none empty', () => {
    for (const cat of Object.keys(counts)) expect(CATEGORIES, cat).toHaveProperty(cat);
    for (const cat of Object.keys(CATEGORIES)) expect(counts[cat], `category "${cat}" has no members`).toBeGreaterThan(0);
  });
});
