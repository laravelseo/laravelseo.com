import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, isAbsolute } from 'node:path';
import yaml from 'js-yaml';
const root = new URL('../', import.meta.url).pathname;
const isCart = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name === 'astro-component-starter';
const index = new Map();
const walk = (dir) => existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]) : [];
const plain = (value) => String(value || '').replace(/<[^>]+>/g, ' ').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#*_`>]/g, '').replace(/\s+/g, ' ').trim();
function add(path, title, excerpt, category='Blog', tags=[], date='') {
  const s = path.replace(/^\/+|\/+$/g, '');
  const t = plain(title); const e = plain(excerpt).slice(0,240) || t;
  if (!t || !s) return;
  index.set(s, { s, t, e, c:category, g:Array.isArray(tags) ? tags : [], d:String(date || '').slice(0,10) });
}
function frontmatter(file) {
  const source = readFileSync(file,'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return {data:match ? yaml.load(match[1]) || {} : {}, body:source.slice(match?.[0].length || 0)};
}
for (const file of walk(join(root,'src/content/blog')).filter((file)=>/\.mdx?$/.test(file))) {
  const {data,body} = frontmatter(file);
  let slug = relative(join(root,'src/content/blog'),file).replace(/\.mdx?$/,'');
  // The marketing blog's [slug] handler drops the date prefix for MDX pages.
  if (isCart) slug = slug.replace(/^\d{4}-\d{2}-\d{2}-/,'');
  else slug = data.slug || slug;
  add('blog/'+slug, data.title, data.description || body, 'Blog', data.tags, data.pubDate || data.date);
}
if (isCart) {
  for (const file of walk(join(root,'questions/json')).filter((file)=>file.endsWith('.json'))) {
    const data=JSON.parse(readFileSync(file,'utf8'));
    const slug=relative(join(root,'questions/json'),file).replace(/\.json$/,'').toLowerCase().replace(/[^a-z0-9\-/]+/g,'-');
    add('blog/qa/'+slug,data.title,data.excerpt || data.content,'Questions',data.tags,data.date);
  }
}
// Include hand-authored article pages and other static content. Never execute page code.
for (const file of walk(join(root,'src/pages')).filter((file)=>/\.(astro|md)$/.test(file))) {
  let route=relative(join(root,'src/pages'),file).replace(/\.(astro|md)$/,'').replace(/\/index$/,'');
  if (route.includes('[') || route.startsWith('api/') || route==='search' || route==='404' || route==='index') continue;
  const source=readFileSync(file,'utf8');
  if(file.endsWith('.md')) { const {data,body}=frontmatter(file);add(route,data.title,data.description || body);continue; }
  const constant=(name)=>source.match(new RegExp('const\\s+'+name+'\\s*=\\s*(["\\x27`])([\\s\\S]*?)\\1'))?.[2];
  const attr=(name)=>source.match(new RegExp('\\b'+name+'="([^"]+)"'))?.[1];
  const title=constant('title') || attr('title') || source.match(/<h1\b[^>]*>([^<{]+)<\/h1>/)?.[1];
  const description=constant('description') || attr('description') || source.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1];
  if(title && !title.includes('${'))add(route,title,description,route.startsWith('blog/')?'Blog':'Pages');
}
const entries=[...index.values()].sort((a,b)=>a.s.localeCompare(b.s));
if(!entries.length)throw new Error('Empty search corpus');
const arg=process.argv.find(a=>a.startsWith('--out='))?.slice(6);
const out=arg?(isAbsolute(arg)?arg:join(process.cwd(),arg)):join(root,'public/search-index.json');
mkdirSync(dirname(out),{recursive:true});writeFileSync(out,JSON.stringify(entries));
console.log(JSON.stringify({entries:entries.length,blog:entries.filter(e=>e.s.startsWith('blog/')&&!e.s.startsWith('blog/qa/')).length,questions:entries.filter(e=>e.s.startsWith('blog/qa/')).length,output:out}));
