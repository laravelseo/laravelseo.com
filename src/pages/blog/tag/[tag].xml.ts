export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import type { APIContext } from 'astro';

export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function getStaticPaths() {
  const allPosts = await getCollection('blog');
  const tagNames = new Set<string>();
  for (const post of allPosts) {
    for (const t of post.data.tags) tagNames.add(t);
  }
  return [...tagNames].map((tag) => ({
    params: { tag: tagSlug(tag) },
    props: { tagName: tag },
  }));
}

export async function GET(context: APIContext) {
  const tagName = (context.props as { tagName: string }).tagName;
  const posts = (await getCollection('blog'))
    .filter((post) => post.data.tags.includes(tagName))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, 50);
  return rss({
    title: `Laravel SEO Blog - ${tagName}`,
    description: `Laravel SEO articles tagged ${tagName}.`,
    site: context.site ?? 'https://laravelseo.com',
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData:
      '<language>en-gb</language>' +
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>` +
      '<ttl>60</ttl>',
    items: await Promise.all(posts.map(async (post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
      content: await marked.parse(post.body ?? ''),
    }))),
  });
}
