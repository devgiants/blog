export const locales = {
  fr: {
    code: 'fr',
    name: 'Français',
    short: 'FR',
    nav: {
      blog: 'Blog',
      bio: 'Bio',
      tags: 'Tags',
      feed: 'Flux',
      language: 'English',
    },
    common: {
      featuredArticles: 'Derniers articles',
      viewAll: 'Tout voir',
      focus: 'Focus',
      techBlog: 'Blog tech',
      bioLabel: 'Bio',
      archive: 'Archive',
      tagCloud: 'Parcourir les sujets',
      previousArticle: 'Article précédent',
      nextArticle: 'Article suivant',
      olderPosts: 'Articles plus anciens',
      newerPosts: 'Nouveaux articles',
      notFound: 'Page introuvable',
      backHome: 'Retour à l’accueil',
      about: 'À propos',
      bioTitle: 'Parcours et approche',
      homeKicker: 'Blog tech et bio compacte.',
      homeIntro: 'Un site statique pensé pour publier des notes techniques et garder une page bio propre.',
      bioKicker: 'Bio',
      aboutKicker: 'À propos',
      aboutTitle: 'À propos du site et du parcours',
      aboutIntro: 'Une vue d’ensemble courte et utile de ce que je fais et de ce que j’explore.',
      bioIntro: 'Une présentation concise de mon parcours, de mes sujets de fond et de la façon dont je travaille.',
      homeBlogNote: 'Articles Markdown, classés par tags et archivés proprement.',
      homeBioNote: 'Un résumé actuel, court et directement exploitable.',
      overview: 'Vue d’ensemble',
      coreStack: 'Stack principale',
      recurringThemes: 'Thèmes récurrents',
      contact: 'Contact',
      bioCoreStackText: 'Symfony, PHP, Docker, API et architecture applicative.',
      bioRecurringThemesText: 'Outillage, automatisation, observabilité, intégration et maintenabilité long terme.',
      tagPage: 'Sujet',
      footer: 'Site statique hébergé sur GitHub Pages',
    },
  },
  en: {
    code: 'en',
    name: 'English',
    short: 'EN',
    nav: {
      blog: 'Blog',
      bio: 'Bio',
      tags: 'Tags',
      feed: 'Feed',
      language: 'Français',
    },
    common: {
      featuredArticles: 'Latest articles',
      viewAll: 'View all',
      focus: 'Focus',
      techBlog: 'Tech blog',
      bioLabel: 'Bio',
      archive: 'Archive',
      tagCloud: 'Browse topics',
      previousArticle: 'Previous article',
      nextArticle: 'Next article',
      olderPosts: 'Older posts',
      newerPosts: 'Newer posts',
      notFound: 'Page not found',
      backHome: 'Back home',
      about: 'About',
      bioTitle: 'Profile and approach',
      homeKicker: 'Tech blog and a compact bio.',
      homeIntro: 'A static site for technical notes and a clean personal bio.',
      bioKicker: 'Bio',
      aboutKicker: 'About',
      aboutTitle: 'About the site and the background',
      aboutIntro: 'A short, useful overview of what I do and what I explore.',
      bioIntro: 'A concise presentation of my background, recurring topics, and working style.',
      homeBlogNote: 'Markdown articles, tagged and archived cleanly.',
      homeBioNote: 'A current, short, and practical snapshot.',
      overview: 'Overview',
      coreStack: 'Core stack',
      recurringThemes: 'Recurring themes',
      contact: 'Contact',
      bioCoreStackText: 'Symfony, PHP, Docker, APIs, and application architecture.',
      bioRecurringThemesText: 'Tooling, automation, observability, integration, and long-term maintainability.',
      tagPage: 'Topic',
      footer: 'Static site hosted on GitHub Pages',
    },
  },
} as const;

export type LocaleKey = keyof typeof locales;

export function getLocale(url: URL): LocaleKey {
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  if (url.searchParams.get('lang') === 'en') return 'en';
  return 'fr';
}

export function t(locale: LocaleKey, path: string) {
  const keys = path.split('.');
  let value = locales[locale] as any;
  for (const key of keys) value = value?.[key];
  return value;
}

export function withLang(pathname: string, locale: LocaleKey) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const stripped = normalized.replace(/^\/en(?=\/|$)/, '') || '/';
  if (locale === 'en') {
    return stripped === '/' ? '/en/' : `/en${stripped}`;
  }
  return stripped;
}
