export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // Cap the feed at the latest posts: with thousands of posts a
  // full-content feed is unreadable and expensive to build.
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  ).slice(0, 50);
  return rss({
    title: 'Laravel SEO Blog',
    description: 'Expert articles about Laravel SEO optimization, meta tags, structured data and technical SEO best practices.',
    site: context.site ?? 'https://laravelseo.com',
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData:
      '<language>en-gb</language>' +
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>` +
      '<ttl>60</ttl>' +
      '<atom:link href="https://laravelseo.com/rss.xml" rel="self" type="application/rss+xml" />',
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
