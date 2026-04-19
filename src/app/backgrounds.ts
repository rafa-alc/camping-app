export type AppBackgroundId =
  | 'camping-trip-planning'
  | 'trip-setup'
  | 'current-trip'
  | 'saved-trips';

type BackgroundConfig = {
  imageUrl: string;
  position: string;
  overlay: string;
  accent: string;
  vignette?: string;
};

const resolveBackgroundUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export const appBackgrounds: Record<AppBackgroundId, BackgroundConfig> = {
  'camping-trip-planning': {
    imageUrl: resolveBackgroundUrl('backgrounds/camping-trip-planning.png'),
    position: 'center center',
    overlay:
      'linear-gradient(180deg, rgba(238,233,226,0.52) 0%, rgba(227,220,211,0.6) 40%, rgba(208,198,188,0.7) 100%)',
    accent:
      'radial-gradient(circle at top left, rgba(142,168,150,0.18), transparent 34%)',
    vignette:
      'radial-gradient(circle at center, rgba(255,255,255,0) 48%, rgba(66,55,43,0.09) 100%)',
  },
  'trip-setup': {
    imageUrl: resolveBackgroundUrl('backgrounds/trip-setup.png'),
    position: 'center center',
    overlay:
      'linear-gradient(180deg, rgba(240,235,228,0.54) 0%, rgba(228,221,212,0.62) 42%, rgba(210,200,190,0.72) 100%)',
    accent:
      'radial-gradient(circle at top right, rgba(164,183,188,0.15), transparent 30%)',
    vignette:
      'radial-gradient(circle at center, rgba(255,255,255,0) 46%, rgba(59,50,40,0.08) 100%)',
  },
  'current-trip': {
    imageUrl: resolveBackgroundUrl('backgrounds/current-trip.png'),
    position: 'center center',
    overlay:
      'linear-gradient(180deg, rgba(238,234,227,0.6) 0%, rgba(227,220,211,0.69) 42%, rgba(207,197,187,0.8) 100%)',
    accent:
      'radial-gradient(circle at top left, rgba(126,163,144,0.17), transparent 32%)',
    vignette:
      'radial-gradient(circle at center, rgba(255,255,255,0) 44%, rgba(55,47,38,0.12) 100%)',
  },
  'saved-trips': {
    imageUrl: resolveBackgroundUrl('backgrounds/saved-trips.png'),
    position: 'center center',
    overlay:
      'linear-gradient(180deg, rgba(237,232,224,0.58) 0%, rgba(225,218,208,0.67) 40%, rgba(203,194,184,0.77) 100%)',
    accent:
      'radial-gradient(circle at top right, rgba(115,146,155,0.15), transparent 28%)',
    vignette:
      'radial-gradient(circle at center, rgba(255,255,255,0) 46%, rgba(60,51,41,0.1) 100%)',
  },
};

export const appBackgroundPreloadUrls = Object.values(appBackgrounds).map(
  (background) => background.imageUrl,
);
