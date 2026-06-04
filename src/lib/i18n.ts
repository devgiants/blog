export const locales = {
  fr: {
    code: 'fr',
    name: 'Français',
    short: 'FR',
    nav: {
      blog: 'Blog',
      projects: 'Projets',
      bio: 'Bio',
      tags: 'Tags',
      feed: 'Flux',
      language: 'English',
    },
    common: {
      featuredArticles: 'Derniers articles',
      viewAll: 'Tout voir',
      focus: 'Focus',
      focusNote: 'Développeur backend entre salarié et freelance, avec un focus sur la cybersécurité et l’IA appliquée.',
      techBlog: 'Blog tech',
      projectsLabel: 'Projets',
      bioLabel: 'Bio',
      archive: 'Archive',
      tagCloud: 'Parcourir les sujets',
      previousArticle: 'Article précédent',
      nextArticle: 'Article suivant',
      olderPosts: 'Articles plus anciens',
      newerPosts: 'Nouveaux articles',
      notFound: 'Page introuvable',
      backHome: 'Retour à l’accueil',
      bioTitle: 'Parcours et approche',
      homeKicker: 'Bienvenue sur mon espace.',
      homeIntro: 'Projets, notes tech et bio.',
      bioKicker: 'Bio',
      projectsKicker: 'Projets',
      bioIntro: 'Une présentation concise de mon parcours, de la cybersécurité, de mon activité de freelance autour de l’IA et de mon travail de développeur backend.',
      homeBlogNote: 'Articles Markdown, classés par tags et archivés proprement.',
      homeProjectsNote: 'Quelques réalisations récentes, résumées sans jargon.',
      homeBioNote: 'Un résumé actuel, court et directement exploitable.',
      overview: 'Vue d’ensemble',
      coreStack: 'Stack principale',
      recurringThemes: 'Thèmes récurrents',
      contact: 'Contact',
      bioCoreStackText: 'Symfony, PHP, Docker, API et architecture applicative.',
      bioRecurringThemesText: 'Outillage, automatisation, observabilité, intégration, cybersécurité et IA appliquée, avec un focus freelance sur le cadrage fonctionnel et les modèles locaux.',
      projectsIntro: 'Des réalisations concrètes, décrites brièvement et reliées à leur dépôt ou à leur page dédiée.',
      projectsTitle: 'Derniers projets',
      projectsViewAll: 'Voir tous les projets',
      projectStatus: 'Statut',
      projectStack: 'Stack',
      projectSource: 'Source',
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
      projects: 'Projects',
      bio: 'Bio',
      tags: 'Tags',
      feed: 'Feed',
      language: 'Français',
    },
    common: {
      featuredArticles: 'Latest articles',
      viewAll: 'View all',
      focus: 'Focus',
      focusNote: 'Backend developer working across salaried and freelance work, with a focus on cybersecurity and applied AI.',
      techBlog: 'Tech blog',
      projectsLabel: 'Projects',
      bioLabel: 'Bio',
      archive: 'Archive',
      tagCloud: 'Browse topics',
      previousArticle: 'Previous article',
      nextArticle: 'Next article',
      olderPosts: 'Older posts',
      newerPosts: 'Newer posts',
      notFound: 'Page not found',
      backHome: 'Back home',
      bioTitle: 'Profile and approach',
      homeKicker: 'Welcome on my space.',
      homeIntro: 'Projects, tech notes, and bio.',
      bioKicker: 'Bio',
      projectsKicker: 'Projects',
      bioIntro: 'A concise presentation of my background, cybersecurity interests, freelance AI work, and backend development.',
      homeBlogNote: 'Markdown articles, tagged and archived cleanly.',
      homeProjectsNote: 'A few recent deliveries, kept short and direct.',
      homeBioNote: 'A current, short, and practical snapshot.',
      overview: 'Overview',
      coreStack: 'Core stack',
      recurringThemes: 'Recurring themes',
      contact: 'Contact',
      bioCoreStackText: 'Symfony, PHP, Docker, APIs, and application architecture.',
      bioRecurringThemesText: 'Tooling, automation, observability, integration, cybersecurity, and applied AI, with a freelance focus on functional framing and local models.',
      projectsIntro: 'Concrete deliveries, kept brief and linked to their repository or dedicated page.',
      projectsTitle: 'Latest projects',
      projectsViewAll: 'View all projects',
      projectStatus: 'Status',
      projectStack: 'Stack',
      projectSource: 'Source',
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
