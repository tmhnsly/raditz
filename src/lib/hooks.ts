// Consumer-facing hooks & utilities — the same primitives Raditz's own components
// build on, re-exported from the (private) `internal` module so a product can build
// its OWN animated, controllable, or class-composed components with them instead of
// reimplementing reduced-motion checks, IntersectionObserver wiring, the
// controlled/uncontrolled state dance, or a classnames helper.
//
//   import { useInView, useReducedMotion, useControllableState, cx, splitText } from 'raditz';
export { cx, useReducedMotion, useInView, useControllableState, splitText } from '../components/internal';
export type { InViewOptions, SplitBy } from '../components/internal';
