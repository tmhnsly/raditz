// Demo imagery — the ONE place showroom/story images come from.
//
// Unsplash hotlinks are free to use but individual photos get deleted upstream
// and start 404ing years later (that is exactly how the grey ImageFocus/Cta
// panels happened). Keeping every URL here means a dead photo is a one-line
// fix, and `pnpm test` can probe this file's URLs in one place if we ever want
// a liveness gate. Rules:
//   • Stories/demos/showroom pages import from here — never inline a raw URL.
//   • The library itself NEVER hard-codes imagery; real products pass their
//     own assets through props.
//   • For throwaway/placeholder needs, `placeholderImage()` (Lorem Picsum) is
//     seeded and stable — it can't rot the way a specific Unsplash photo can.

/** Verified Unsplash set (nature theme, consistent grade). */
const unsplash = (id: string, w: number, q = 75): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

const MOUNTAIN = '1506905925346-21bda4d32df4'; // mountain range, dusk
const LAKE = '1501785888041-af3ef285b470'; // alpine lake
const FOG = '1470071459604-3b5ec3a7fe05'; // foggy forest ridge
const CANOPY = '1441974231531-c6227db76b6e'; // forest canopy road
const WATERFALL = '1433086966358-54859d0ed716'; // waterfall
const PATH = '1447752875215-b2761acb3c5d'; // forest path

export const demoHero = unsplash(MOUNTAIN, 1920);
export const demoBand = unsplash(LAKE, 1920);
export const demoWide = unsplash(FOG, 1920, 70);
export const demoBackdrop = unsplash(MOUNTAIN, 1600);

export const demoPhotos = [
  { src: unsplash(MOUNTAIN, 1200), alt: 'Mountain range', caption: 'Mountain range' },
  { src: unsplash(FOG, 1200), alt: 'Foggy forest', caption: 'Morning fog' },
  { src: unsplash(LAKE, 1200), alt: 'Lake', caption: 'Alpine lake' },
];

export const demoGallery = [
  { src: unsplash(MOUNTAIN, 800, 70), alt: 'Mountain range' },
  { src: unsplash(CANOPY, 800, 70), alt: 'Forest canopy' },
  { src: unsplash(FOG, 800, 70), alt: 'Foggy forest' },
  { src: unsplash(LAKE, 800, 70), alt: 'Lake and mountains' },
  { src: unsplash(WATERFALL, 800, 70), alt: 'Waterfall' },
  { src: unsplash(PATH, 800, 70), alt: 'Forest path' },
];

/** Tiny square thumbs (chart tooltips, avatars-with-photo demos). */
export const demoThumbs = [MOUNTAIN, CANOPY, FOG, LAKE].map((id) => unsplash(id, 80, 60));

/** Seeded, never-rotting placeholder — same seed always returns the same image. */
export const placeholderImage = (seed: string, w = 1200, h = 800): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
