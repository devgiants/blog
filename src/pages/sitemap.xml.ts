import { getCollection } from 'astro:content';

function pad(value) {
  return String(value).padStart(2, '0');
}

export async function GET() {
  const site = import.meta.env.SITE ?? 'https://devgiants.fr';
  const posts = await getCollection('posts');
  const pages = await getCollection('pages');
  const projects = await getCollection('projects');
  const tags = new Set();
  const blogPageCount = Math.max(1, Math.ceil(posts.length / 10));
  const locales = ['', '/en'];

  for (const post of posts) {
    for (const tag of post.data.tags) tags.add(tag);
  }

  const urls = ['/atom.xml', '/robots.txt'];

  for (const locale of locales) {
    urls.push(`${locale || ''}/`, `${locale || ''}/blog/`, `${locale || ''}/blog/tags/`, `${locale || ''}/projects/`, `${locale || ''}/bio/`);

    for (const post of posts) {
      const date = post.data.date;
      urls.push(
        `${locale || ''}/blog/${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${post.data.publicSlug ?? post.data.slug ?? post.slug}/`,
      );
    }

    for (let page = 2; page <= blogPageCount; page += 1) {
      urls.push(`${locale || ''}/blog/${page}/`);
    }

    for (const page of pages) {
      if (page.slug === 'bio') continue;
      urls.push(`${locale || ''}/${page.slug}/`);
    }

    for (const project of projects) {
      if (project.data.locale !== (locale === '/en' ? 'en' : 'fr')) continue;
      urls.push(`${locale || ''}/projects/${project.data.publicSlug ?? project.data.slug ?? project.slug}/`);
    }

    for (const tag of tags) {
      urls.push(`${locale || ''}/blog/tags/${encodeURIComponent(tag)}/`);
    }
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (url) =>
          `  <url><loc>${new URL(url, site).toString()}</loc></url>`,
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
