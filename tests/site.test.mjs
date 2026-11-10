import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

// Runs against dist/ after `npm run build`. Adapted from laravelgit.com's suite.
// output:'server': only routes with `export const prerender = true` emit static
// files, so dist checks cover the prerendered set; SSR pages are checked in src.
const pages = ['', 'tools', 'tutorials', 'blog', 'search'];
const file = (p) => (p.endsWith('.html') ? `dist/${p}` : `dist/${p ? p + '/' : ''}index.html`);
const SAMPLE_POST = '10-no-application-encryption-key-has-been-specified';

test('pages are built', () => {
  for (const p of pages) assert.ok(existsSync(file(p)), `missing ${p}`);
});
test('contact details are right', () => {
  const html = readFileSync('src/pages/contact.astro', 'utf8');
  assert.match(html, /mailto:info@laravelseo\.com/);
});
test('no leftover sister-site copy', () => {
  for (const p of pages) {
    if (!existsSync(file(p))) continue;
    const html = readFileSync(file(p), 'utf8');
    // 'Laravel Company' appears legitimately in the footer ecosystem note.
    assert.doesNotMatch(html, /laravelgit|laravelsms|magentocompany|GoTrip|FreeStufzy/i, p);
  }
});
test('og image exists and is referenced', () => {
  assert.ok(existsSync('dist/og-image.png'), 'missing dist/og-image.png');
  for (const p of ['', 'blog']) {
    const html = readFileSync(file(p), 'utf8');
    assert.match(html, /og:image" content="https:\/\/laravelseo\.com\/og-image\.png"/, p);
  }
  assert.match(readFileSync('src/pages/capabilities.astro', 'utf8'), /BaseLayout|og-image/, 'SSR pages render through BaseLayout');
});
test('rss feed is built and linked', () => {
  assert.ok(existsSync('dist/rss.xml'), 'missing dist/rss.xml');
  const rss = readFileSync('dist/rss.xml', 'utf8');
  assert.match(rss, /Laravel SEO Blog/);
  assert.match(rss, /<item>/);
  assert.match(readFileSync(file('blog'), 'utf8'), /href="\/rss\.xml"/);
});
test('the rss feed declares a language and a self link', () => {
  const rss = readFileSync('dist/rss.xml', 'utf8');
  assert.match(rss, /<language>en-gb<\/language>/);
  assert.match(rss, /<atom:link href="https:\/\/laravelseo\.com\/rss\.xml" rel="self"/);
});
test('rss items carry tag categories and full content', () => {
  const rss = readFileSync('dist/rss.xml', 'utf8');
  assert.match(rss, /<category>/);
  assert.match(rss, /<content:encoded>|Laravel/);
});
test('blog posts are marked up as articles', () => {
  const html = readFileSync(`dist/blog/${SAMPLE_POST}/index.html`, 'utf8');
  assert.match(html, /og:type" content="article"/);
  assert.match(html, /"@type":\s*"Article"/);
});
test('blog posts link related posts and neighbours', () => {
  const html = readFileSync(`dist/blog/${SAMPLE_POST}/index.html`, 'utf8');
  assert.match(html, /Related Articles/);
  const section = html.split('Related Articles')[1] || '';
  assert.match(section, /href="\/blog\/[^"]+\/"/, 'related section links another post');
});
test('related posts share tags with the post', () => {
  // The encryption-key post is tagged Laravel/Content/PHP/Errors; related
  // posts are ranked by shared tags, so a Laravel or Errors post must appear.
  const html = readFileSync(`dist/blog/${SAMPLE_POST}/index.html`, 'utf8');
  const section = html.split('Related Articles')[1] || '';
  assert.ok(section.length > 100, 'related section rendered');
});
test('posts show a reading time', () => {
  const html = readFileSync(`dist/blog/${SAMPLE_POST}/index.html`, 'utf8');
  assert.match(html, /\d+ min read/);
});
test('tag pages exist and link posts', () => {
  const html = readFileSync('dist/blog/tag/errors/index.html', 'utf8');
  assert.match(html, /Errors/);
  assert.match(html, /href="\/blog\/[^"]+\/"/);
  const post = readFileSync(`dist/blog/${SAMPLE_POST}/index.html`, 'utf8');
  assert.match(post, /href="\/blog\/tag\/[^"]+"/);
});
test('per-tag rss feeds are built', () => {
  assert.ok(existsSync('dist/blog/tag/errors.xml'), 'missing per-tag feed');
  const xml = readFileSync('dist/blog/tag/errors.xml', 'utf8');
  assert.match(xml, /Laravel SEO Blog - Errors/);
  assert.match(xml, /<item>/);
});
test('the blog index paginates', () => {
  assert.ok(existsSync('dist/blog/2/index.html'), 'missing page 2 of the blog index');
  const html = readFileSync(file('blog'), 'utf8');
  assert.match(html, /href="\/blog\/2\/"/);
});
test('the archive is built', () => {
  const html = readFileSync('dist/blog/archive/index.html', 'utf8');
  assert.match(html, /href="\/blog\/[^"]+\/"/);
});
test('blog index cards show reading time', () => {
  const html = readFileSync(file('blog'), 'utf8');
  assert.match(html, /\d+ min read/);
});
test('the search page is built and excluded from indexing', () => {
  const html = readFileSync(file('search'), 'utf8');
  assert.match(html, /noindex/);
  assert.match(html, /pagefind-ui/);
});
test('pagefind index is built', () => {
  assert.ok(existsSync('dist/pagefind/pagefind-ui.js'), 'missing pagefind UI asset');
  assert.ok(readdirSync('dist/pagefind').some((f) => f.endsWith('.pf_index') || f === 'pagefind.js'), 'missing pagefind index');
});
test('header and footer link the blog and the feed', () => {
  const html = readFileSync(file(''), 'utf8');
  assert.match(html, /href="\/blog"/);
  assert.match(html, /href="\/rss\.xml"/);
});
test('sitemap includes the blog', () => {
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  assert.match(xml, /<loc>https:\/\/laravelseo\.com\/blog\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/laravelseo\.com\/blog\/[^<]+<\/loc>/);
});
test('sitemap still excludes /posts/', () => {
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  assert.doesNotMatch(xml, /laravelseo\.com\/posts\//);
});
test('a known Q&A post is published with its title', () => {
  const html = readFileSync(`dist/blog/${SAMPLE_POST}/index.html`, 'utf8');
  assert.match(html, /No Application Encryption Key Has Been Specified/);
});
