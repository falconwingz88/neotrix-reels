import type { Article } from "@/content/articles";

type EditorialCoverSource = {
  src: string;
  sourceUrl: string;
  photographer: string;
};

const cover = (filename: string, sourceUrl: string, photographer: string): EditorialCoverSource => ({
  src: `/article-covers/${filename}`,
  sourceUrl,
  photographer,
});

/**
 * Downloaded editorial photography for the journal. The cover registry is
 * deliberately separate from the project archive so project screenshots can
 * never become article thumbnails. Every managed article currently has its
 * own local image, with the category set retained as a safe fallback for new
 * articles.
 */
export const EDITORIAL_ARTICLE_COVER_SOURCES = {
  cameraStudio: cover("unsplash-camera-studio.jpg", "https://unsplash.com/photos/black-and-silver-camera-on-tripod-VmEzN971L3s", "Unsplash / studio camera photograph"),
  concreteFacade: cover("unsplash-concrete-facade.jpg", "https://unsplash.com/photos/modern-building-facade-with-repeating-geometric-pattern-PQXDlapwg9Q", "Unsplash / the_iop"),
  editorWorkstation: cover("unsplash-editor-workstation.jpg", "https://unsplash.com/photos/a-man-edits-video-on-a-computer-brC_7jOF_cg", "Unsplash / TourBox"),
  prismLight: cover("unsplash-prism-light.jpg", "https://unsplash.com/s/photos/prism-light", "Unsplash / prism-light photography"),
  editingMonitor: cover("unsplash-editing-monitor.jpg", "https://unsplash.com/s/photos/video-editing-software", "Unsplash / video-editing photography"),
  filmSet: cover("unsplash-film-set.jpg", "https://unsplash.com/s/photos/filmmaking", "Unsplash / filmmaking photography"),
  cityNight: cover("unsplash-city-night.jpg", "https://unsplash.com/photos/a-group-of-people-walking-on-a-sidewalk-with-lights-UeBZbQ1T4e4", "Unsplash / Mos Sukjaroenkraisri"),
  minimalWorkstation: cover("unsplash-minimal-workstation.jpg", "https://unsplash.com/photos/apple-imac-and-apple-magic-mouse-and-keyboard-on-table-sxrBantx5Wo", "Unsplash / Jakob Owens"),
  liquidPour: cover("unsplash-liquid-pour.jpg", "https://unsplash.com/photos/bottle-with-white-liquid-pouring-through-the-brown-slab-CQEliDTB3Sg", "Unsplash / Alexis Antoine"),
  handsSketch: cover("unsplash-hands-sketch.jpg", "https://unsplash.com/photos/a-person-writing-on-a-piece-of-paper-z46zJzbt6EM", "Unsplash / gomi"),
  dropperBottle: cover("unsplash-dropper-bottle.jpg", "https://unsplash.com/photos/a-close-up-of-a-dropper-bottle-with-drops-of-water-on-it-28Ouhl2LP04", "Unsplash / Cosmin Ursea"),
  collabTable: cover("unsplash-collab-table.jpg", "https://unsplash.com/photos/two-women-look-at-photos-at-a-table-vuFwCFz1nj0", "Unsplash / collaborative photo session"),
  cosmeticBottles: cover("unsplash-cosmetic-bottles.jpg", "https://unsplash.com/photos/a-couple-of-bottles-sitting-on-top-of-a-floor-TqHUvN1yx24", "Unsplash / A Studios"),
  blueLightTrails: cover("unsplash-blue-light-trails.jpg", "https://unsplash.com/photos/blue-and-white-light-streaks-_WcSWRvpAnY", "Unsplash / Annie Spratt"),
  yellowLiquid: cover("unsplash-yellow-liquid.jpg", "https://unsplash.com/photos/clear-glass-bottle-with-yellow-liquid-OacW0FPpNMw", "Unsplash / Colin Lloyd"),
  photoArrangement: cover("unsplash-photo-arrangement.jpg", "https://unsplash.com/photos/people-are-arranging-photos-on-a-table-7Q31yspx1tQ", "Unsplash / Vitaly Gariev"),
  glassReflection: cover("unsplash-glass-reflection.jpg", "https://unsplash.com/s/photos/glass-reflection", "Unsplash / glass-reflection photography"),
  industrialSet: cover("unsplash-industrial-set.jpg", "https://unsplash.com/s/photos/filmmaking", "Unsplash / filmmaking photography"),
  blueBottle: cover("unsplash-blue-bottle.jpg", "https://unsplash.com/photos/a-bottle-of-blue-liquid-sitting-on-top-of-a-table-g1E2pyRLq3A", "Unsplash / Giulio Fabi"),
  neonTrails: cover("unsplash-neon-trails.jpg", "https://unsplash.com/photos/a-blurry-photo-of-a-long-exposure-of-light-4LysFkWr8YQ", "Unsplash / Solen Feyissa"),
  dualMonitor: cover("unsplash-dual-monitor.jpg", "https://unsplash.com/photos/computer-workstation-with-multiple-monitors-and-plants-ay1vG2t-hPQ", "Unsplash / TourBox"),
  modernArchitecture: cover("unsplash-modern-architecture.jpg", "https://unsplash.com/pt-br/fotografias/edificio-de-concreto-cinza-durante-o-dia-wx0DaT-KlGk", "Unsplash / Parsoa Khorsand"),
  laptopStudio: cover("unsplash-laptop-studio.jpg", "https://unsplash.com/photos/a-woman-sitting-at-a-table-working-on-a-laptop-Pfmow4b9GAY", "Unsplash / Surface"),
  windowShadows: cover("unsplash-window-shadows.jpg", "https://unsplash.com/photos/a-dark-room-with-a-light-coming-through-the-window-h01gIDFOY14", "Unsplash / Ramon Vicente"),
  glassBottle: cover("unsplash-glass-bottle.jpg", "https://unsplash.com/photos/a-glass-bottle-with-a-blue-liquid-RCVjjYahVN8", "Unsplash / Aliya Amangeldi"),
  nightArchitecture: cover("unsplash-night-architecture.jpg", "https://unsplash.com/photos/a-city-street-at-night-with-tall-buildings-jiwSlRh6kGo", "Unsplash / Casey Horner"),
  neonLight: cover("unsplash-neon-light.jpg", "https://unsplash.com/photos/a-cell-phone-with-a-long-exposure-of-light-F5ZqOurOZrg", "Unsplash / Solen Feyissa"),
  pedestrianBridge: cover("unsplash-pedestrian-bridge.jpg", "https://unsplash.com/photos/pedestrian-bridge-leading-to-illuminated-building-at-night-js3E2CyGGaA", "Unsplash / Tsuyoshi Kozu"),
} as const;

export const EDITORIAL_ARTICLE_COVERS = {
  production: EDITORIAL_ARTICLE_COVER_SOURCES.filmSet.src,
  product: EDITORIAL_ARTICLE_COVER_SOURCES.liquidPour.src,
  hybrid: EDITORIAL_ARTICLE_COVER_SOURCES.editorWorkstation.src,
  ai: EDITORIAL_ARTICLE_COVER_SOURCES.neonLight.src,
  vfx: EDITORIAL_ARTICLE_COVER_SOURCES.glassReflection.src,
  virtual: EDITORIAL_ARTICLE_COVER_SOURCES.industrialSet.src,
  technology: EDITORIAL_ARTICLE_COVER_SOURCES.dualMonitor.src,
  strategy: EDITORIAL_ARTICLE_COVER_SOURCES.collabTable.src,
} as const;

export type EditorialArticleCoverKey = keyof typeof EDITORIAL_ARTICLE_COVERS;

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const articleSearchText = (article: Article) => normalize([
  article.slug,
  article.title,
  article.shortTitle,
  article.category,
  ...article.keywords,
  ...(article.relatedWork || []).flatMap((work) => [work.label, work.query]),
].filter(Boolean).join(" "));

export const getEditorialArticleCoverKey = (article: Article): EditorialArticleCoverKey => {
  const text = articleSearchText(article);
  if (/virtual production|virtual studio|volumetric|led wall|in-camera/i.test(text)) return "virtual";
  if (/vfx|composit|background replacement|visual effect|matte|rotoscop|tracking/i.test(text)) return "vfx";
  if (/ai|generative|machine learning|synthetic|prompt|veo|runway|cosmos/i.test(text)) return "ai";
  if (/telecom|technology|connectivity|network|5g|digital service|interface/i.test(text)) return "technology";
  if (/hybrid|live action|live-action|photoreal|camera shoot/i.test(text)) return "hybrid";
  if (/product|packaging|device|beverage|material|commercial film/i.test(text)) return "product";
  if (/strategy|choose|brief|studio selection|planning|budget|production guide/i.test(text)) return "strategy";
  return "production";
};

const ARTICLE_COVER_BY_SLUG: Record<string, string> = {
  "how-to-choose-3d-animation-studio-jakarta": EDITORIAL_ARTICLE_COVER_SOURCES.cameraStudio.src,
  "3d-product-animation-vs-live-action": EDITORIAL_ARTICLE_COVER_SOURCES.concreteFacade.src,
  "ai-video-production-for-brands": EDITORIAL_ARTICLE_COVER_SOURCES.editorWorkstation.src,
  "ai-and-3d-animation-commercial-workflow": EDITORIAL_ARTICLE_COVER_SOURCES.prismLight.src,
  "ai-background-replacement-commercial-video": EDITORIAL_ARTICLE_COVER_SOURCES.editingMonitor.src,
  "ai-vfx-3d-virtual-production": EDITORIAL_ARTICLE_COVER_SOURCES.filmSet.src,
  "responsible-generative-ai-advertising": EDITORIAL_ARTICLE_COVER_SOURCES.cityNight.src,
  "how-to-plan-a-product-film-for-a-new-mobile-device": EDITORIAL_ARTICLE_COVER_SOURCES.minimalWorkstation.src,
  "what-makes-a-liquid-product-film-feel-real": EDITORIAL_ARTICLE_COVER_SOURCES.liquidPour.src,
  "character-animation-for-advertising-from-performance-to-pipeline": EDITORIAL_ARTICLE_COVER_SOURCES.handsSketch.src,
  "how-to-build-a-beauty-film-with-3d-vfx-and-macro-detail": EDITORIAL_ARTICLE_COVER_SOURCES.dropperBottle.src,
  "designing-a-social-first-3d-campaign-that-still-feels-premium": EDITORIAL_ARTICLE_COVER_SOURCES.collabTable.src,
  "a-practical-guide-to-3d-packaging-animation-for-fmcg-brands": EDITORIAL_ARTICLE_COVER_SOURCES.cosmeticBottles.src,
  "motion-systems-for-brand-campaigns-making-many-assets-feel-one": EDITORIAL_ARTICLE_COVER_SOURCES.blueLightTrails.src,
  "how-vfx-and-3d-share-the-frame-in-product-advertising": EDITORIAL_ARTICLE_COVER_SOURCES.yellowLiquid.src,
  "what-to-put-in-a-commercial-animation-brief-before-you-contact-a-studio": EDITORIAL_ARTICLE_COVER_SOURCES.photoArrangement.src,
  "from-key-visual-to-campaign-world-extending-one-idea-across-deliverables": EDITORIAL_ARTICLE_COVER_SOURCES.glassReflection.src,
  "3d-commercial-animation-in-indonesia-from-brief-to-broadcast": EDITORIAL_ARTICLE_COVER_SOURCES.industrialSet.src,
  "3d-product-animation-for-indonesian-brands-designing-desire": EDITORIAL_ARTICLE_COVER_SOURCES.blueBottle.src,
  "ai-animation-for-commercials-from-exploration-to-final-frame": EDITORIAL_ARTICLE_COVER_SOURCES.neonTrails.src,
  "ai-production-for-advertising-in-indonesia-a-practical-workflow": EDITORIAL_ARTICLE_COVER_SOURCES.dualMonitor.src,
  "how-indonesian-fmcg-brands-use-3d-product-animation": EDITORIAL_ARTICLE_COVER_SOURCES.modernArchitecture.src,
  "building-an-ai-and-3d-animation-pipeline-for-product-launches": EDITORIAL_ARTICLE_COVER_SOURCES.laptopStudio.src,
  "3d-animation-studio-indonesia-how-to-evaluate-craft-and-fit": EDITORIAL_ARTICLE_COVER_SOURCES.windowShadows.src,
  "commercial-vfx-and-ai-production-keeping-brand-truth-in-the-frame": EDITORIAL_ARTICLE_COVER_SOURCES.glassBottle.src,
  "3d-animation-for-indonesian-telecom-and-technology-campaigns": EDITORIAL_ARTICLE_COVER_SOURCES.nightArchitecture.src,
  "the-future-of-ai-animation-and-3d-product-films-in-indonesia": EDITORIAL_ARTICLE_COVER_SOURCES.neonLight.src,
  "ai-video-3d-reference-pipeline": EDITORIAL_ARTICLE_COVER_SOURCES.pedestrianBridge.src,
};

export const getEditorialArticleCover = (article: Article) =>
  ARTICLE_COVER_BY_SLUG[article.slug] || EDITORIAL_ARTICLE_COVERS[getEditorialArticleCoverKey(article)];

export const getEditorialArticleCoverSource = (article: Article) => {
  const src = getEditorialArticleCover(article);
  return Object.values(EDITORIAL_ARTICLE_COVER_SOURCES).find((item) => item.src === src);
};

export const resolveArticleCovers = (articles: Article[], _projects?: unknown[], _width?: number) => {
  const covers = new Map<string, string>();
  articles.forEach((article) => covers.set(article.id || article.slug, getEditorialArticleCover(article)));
  return covers;
};

export const resolveArticleCover = (article: Article) => getEditorialArticleCover(article);
