// Shared by gen-barrel.mjs and gen-catalog.mjs so the barrel and catalog never
// disagree on the curated lib surface. (Components/sections are discovered by the
// has-a-story rule in each generator.)
export const LIB = [
  './lib/useColorScheme',
  './lib/ThemePicker',
  './lib/theme',
  './lib/Frame',
  './lib/SectionShell',
  './lib/HeroBleed',
];
