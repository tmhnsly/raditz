// Aggregates every component's co-located .scss (plus the Showcase page) via a
// build-time glob — so adding a component with a stylesheet can't silently drop
// its CSS from dist (the old hand-maintained import list did exactly that when a
// line was forgotten). Imported once globally (app + Storybook) so all rdz-*
// component styles are present.
//
// Cascade safety: the alphabetical glob order keeps the two load-bearing base
// files first — `_shared.scss` (leading underscore sorts first) and
// `internal/Overlay.scss` (the `internal` dir sorts before its overlay/menu
// consumers). Every other stylesheet is component-scoped (.rdz-<name>__…), so
// inter-file order is irrelevant. No .scss `@use`s another, so there's no Sass
// coupling to preserve.
const styles = import.meta.glob(['../components/**/*.scss', '../pages/**/*.scss'], { eager: true });

export default styles;
