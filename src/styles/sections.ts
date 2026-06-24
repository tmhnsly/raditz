// Section styles in cascade order: shared utilities FIRST, then each section's
// co-located styles — so a per-section rule wins the same-specificity conflicts it
// won when everything lived (later) in one file (e.g. the nav frame's transparent
// background for hero bleed, the brand chip size). The co-located glob is in its
// own module because an eager glob's generated imports hoist to the top of THEIR
// module; keeping it separate guarantees sections.css evaluates first.
//
// All consumers (app, Storybook, explorer, CSS build) import this one module.
import '../sections/sections.css';
import './section-co-located';
