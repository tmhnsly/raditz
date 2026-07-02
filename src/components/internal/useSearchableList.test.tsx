import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useSearchableList } from './useSearchableList';

// Harness matching how the faces (Combobox, CommandPalette) consume the hook:
// an input spreading inputProps, a listbox spreading listProps, options
// spreading optionProps(i).
function Harness({ items, onPick }: { items: string[]; onPick: (item: string, index: number) => void }) {
  const list = useSearchableList<string>({ items, itemText: (s) => s, onPick });
  return (
    <>
      <input data-testid="input" {...list.inputProps} />
      <button data-testid="reset" onClick={list.reset}>reset</button>
      <div data-testid="list" {...list.listProps}>
        {list.filtered.map((s, i) => (
          <button key={s} type="button" {...list.optionProps(i)}>{s}</button>
        ))}
      </div>
    </>
  );
}

const ITEMS = ['Apple', 'Banana', 'Cherry'];
const setup = (onPick = vi.fn()) => {
  const utils = render(<Harness items={ITEMS} onPick={onPick} />);
  return { ...utils, onPick, input: utils.getByTestId('input') as HTMLInputElement, options: () => Array.from(utils.getByTestId('list').querySelectorAll('[role="option"]')) };
};

describe('useSearchableList', () => {
  it('wires the combobox → listbox → option aria contract', () => {
    const { input, getByTestId, options } = setup();
    const listbox = getByTestId('list');
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);
    expect(listbox.getAttribute('role')).toBe('listbox');
    expect(options()).toHaveLength(3);
    // activedescendant points at the highlighted option's real id
    expect(input.getAttribute('aria-activedescendant')).toBe(options()[0].id);
  });

  it('fuzzy-filters on typing and resets the highlight to the first match', () => {
    const { input, options } = setup();
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // highlight #1
    fireEvent.change(input, { target: { value: 'ban' } });
    expect(options().map((o) => o.textContent)).toEqual(['Banana']);
    expect(options()[0].getAttribute('data-active')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(options()[0].id);
  });

  it('drops aria-activedescendant when nothing matches', () => {
    const { input, options } = setup();
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(options()).toHaveLength(0);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('arrows move the highlight (data-active) and Enter picks the filtered item', () => {
    const { input, options, onPick } = setup();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(options()[1].getAttribute('data-active')).toBe('true');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onPick).toHaveBeenCalledWith('Banana', 1);
  });

  it('Enter with no matches picks nothing', () => {
    const { input, onPick } = setup();
    fireEvent.change(input, { target: { value: 'zzz' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onPick).not.toHaveBeenCalled();
  });

  it('hovering an option moves the highlight; clicking picks it and clears the query', () => {
    const { input, options, onPick } = setup();
    fireEvent.change(input, { target: { value: 'ch' } });
    fireEvent.mouseEnter(options()[0]);
    fireEvent.click(options()[0]);
    expect(onPick).toHaveBeenCalledWith('Cherry', 0);
    expect(input.value).toBe(''); // query cleared after a pick
    expect(options()).toHaveLength(3);
  });

  it('reset() clears the query and re-highlights the first item', () => {
    const { input, options, getByTestId } = setup();
    fireEvent.change(input, { target: { value: 'ban' } });
    fireEvent.click(getByTestId('reset'));
    expect(input.value).toBe('');
    expect(options()).toHaveLength(3);
    expect(options()[0].getAttribute('data-active')).toBe('true');
  });
});
