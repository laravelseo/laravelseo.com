import fs from 'node:fs';
import assert from 'node:assert/strict';
const entries = JSON.parse(fs.readFileSync('src/data/goai-import-manifest.json', 'utf8'));
assert.equal(entries.length, 84);
assert.equal(new Set(entries.map(e => e.route)).size, 84);
for (const entry of entries) {
  const slug = entry.route.split('/').pop();
  const article = JSON.parse(fs.readFileSync(`src/data/goai/${slug}.json`, 'utf8'));
  assert.ok(fs.existsSync(`src/pages/blog/${slug}.astro`));
  assert.ok(article.title && article.body && article.sourceAuthor && article.sourceUrl);
  assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!/<script[\s>]|<iframe[\s>]|\son\w+=/i.test(article.body));
  for (const match of article.body.matchAll(/src="(\/images\/goai\/[^"?#]+)"/g)) {
    assert.ok(fs.existsSync(`public${match[1]}`), match[1]);
  }
}
console.log(`GOAI import verified: ${entries.length} articles.`);
