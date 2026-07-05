import { cloneElement, createElement, isValidElement } from 'react';
import type { ElementType, ReactElement } from 'react';
import { mergeProps } from './mergeProps';

/**
 * A `render` prop value: a React element to render *as* (its props merged with
 * the component's), or a function that receives the merged props + component
 * `state` and returns the element. This is Base UI's composition model — a
 * cleaner successor to `asChild`.
 */
export type RenderProp<State = Record<string, never>> =
  | ReactElement
  | ((props: Record<string, unknown>, state: State) => ReactElement);

export interface UseRenderParams<State> {
  /** Consumer override. Omit to render `defaultTag`. */
  render?: RenderProp<State>;
  /** The component's own props (className, data-*, handlers, children, ref). */
  props: Record<string, unknown>;
  /** State handed to a function `render` (e.g. `{ variant, size }`). */
  state?: State;
  /** Element used when no `render` is given. @default 'div' */
  defaultTag?: ElementType;
}

/**
 * useRender — resolve a component's element from an optional `render` prop.
 * Element `render` → clone it, merging the component's props (see
 * {@link mergeProps}); function `render` → call it with the merged props + state
 * so the consumer spreads them; nothing → render `defaultTag`. Lets a consumer
 * swap the underlying element (e.g. render a Button as a routing `<Link>`) while
 * keeping the design-system styling, data-attributes and handlers.
 */
export function useRender<State = Record<string, never>>({
  render,
  props,
  state,
  defaultTag = 'div',
}: UseRenderParams<State>): ReactElement {
  if (typeof render === 'function') {
    return render(props, (state ?? {}) as State);
  }
  if (isValidElement(render)) {
    return cloneElement(render, mergeProps(render.props as Record<string, unknown>, props));
  }
  return createElement(defaultTag, props);
}
