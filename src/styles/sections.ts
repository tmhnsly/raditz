// Aggregates the shared section utilities + every section's co-located .css, so
// the app, Storybook, the explorer, and the CSS build all load the same set.
// A new section's styles can't be forgotten — the per-section files are globbed.
// Shared utilities load first; the per-section blocks are component-scoped
// (.sx-<name>__… / .rdz-<name>…), so inter-file order is irrelevant.
import '../sections/sections.css';
const sectionStyles = import.meta.glob('../sections/*/*.css', { eager: true });

export default sectionStyles;
