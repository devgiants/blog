import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET() {
  const posts = (await getCollection('posts')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const site = import.meta.env.SITE ?? 'https://devgiants.fr';

  return rss({
    title: 'devGiants',
    description: 'Blog tech et bio.',
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.data.date.getFullYear()}/${String(post.data.date.getMonth() + 1).padStart(2, '0')}/${String(post.data.date.getDate()).padStart(2, '0')}/${post.data.publicSlug ?? post.data.slug ?? post.slug}/`,
    })),
  });
}
