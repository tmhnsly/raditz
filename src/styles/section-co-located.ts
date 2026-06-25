/// <reference types="vite/client" />
// Eager glob of every section's co-located <Name>/<Name>.css. Isolated in its own
// module ON PURPOSE: an eager `import.meta.glob` compiles to static imports that
// hoist to the TOP of their module, so if this lived beside the explicit
// `import '../sections/sections.css'` it would jump ahead of it and the shared
// utilities would lose same-specificity conflicts (nav frame bg, brand chip size).
// Kept separate, `sections.ts` evaluates sections.css first, then this. See sections.ts.
const styles = import.meta.glob('../sections/*/*.css', { eager: true });

export default styles;
