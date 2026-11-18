import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdtempSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareIndex,searchIndex} from '../src/search/rank.mjs';
const root=new URL('../',import.meta.url).pathname;
const read=(path)=>readFileSync(join(root,path),'utf8');
const cart=JSON.parse(read('package.json')).name==='astro-component-starter';
const output=join(mkdtempSync(join(tmpdir(),'popup-search-')),'index.json');
execFileSync(process.execPath,['scripts/build-search-index.mjs','--out='+output],{cwd:root});
const index=JSON.parse(readFileSync(output,'utf8'));
test('full content corpus has unique internal paths and required fields',()=>{
 assert.ok(index.length>(cart?3200:9700));
 assert.equal(new Set(index.map(p=>p.s)).size,index.length);
 for(const p of index){assert.ok(p.t&&p.e&&p.c);assert.doesNotMatch(p.s,/^https?:|\.\.|[?#]/);}
 if(cart){
  const count=readdirSync(join(root,'questions/json')).filter(f=>f.endsWith('.json')).length;
  assert.equal(index.filter(p=>p.s.startsWith('blog/qa/')).length,count);
  assert.equal(index.filter(p=>p.s.startsWith('blog/')&&!p.s.startsWith('blog/qa/')).length,11);
 } else {
  for(const file of readdirSync(join(root,'src/content/blog')).filter(f=>f.endsWith('.md')))assert.ok(index.some(p=>p.s==='blog/'+file.slice(0,-3)),file);
  assert.ok(index.some(p=>p.s==='blog/laravel-seo-best-practices'));
 }
});
test('ranker returns title matches first and uses AND matching',()=>{
 const prepared=prepareIndex([{s:'blog/title',t:'Laravel SEO',e:'Helpful guide',c:'Blog',g:[]},{s:'blog/excerpt',t:'PHP guide',e:'Laravel SEO',c:'Blog',g:[]}]);
 assert.equal(searchIndex(prepared,'laravel')[0].s,'blog/title');
 assert.equal(searchIndex(prepared,'laravel missing').length,0);
 assert.deepEqual(searchIndex(prepared,''),[]);
 assert.ok(searchIndex(prepareIndex(index),cart?'cart':'laravel').length>0);
});
test('DocSearch uses same-origin API, mixed path URLs, v5 request shape, and no false provider logo',()=>{
 const client=read('src/components/search/localSearchClient.ts');
 assert.match(client,/\/api\/search\?q=/);assert.match(client,/input\.requests/);assert.match(client,/request\.query/);
 assert.match(client,/url: `\/\$\{hit.s\}\//);
 assert.match(read('src/components/search/AlgoliaDocSearch.tsx'),/transformSearchClient/);
 assert.match(read('src/components/search/AlgoliaDocSearch.css'),/\.DocSearch-Logo\s*\{\s*display:\s*none/);
});
test('build replaces Pagefind with the own index step',()=>{
 const pkg=JSON.parse(read('package.json'));assert.doesNotMatch(pkg.scripts.build,/pagefind/);assert.match(pkg.scripts.build,/build:search-index/);
 assert.equal(pkg.dependencies.pagefind,undefined);assert.equal(pkg.devDependencies?.pagefind,undefined);
 assert.doesNotMatch(read('src/pages/search.astro'),/PagefindUI|pagefind-ui/);
});
test('search backend preserves the site deployment and binds ASSETS',()=>{
 const cfg=JSON.parse(read('wrangler.jsonc'));assert.equal(cfg.assets.binding,'ASSETS');assert.ok(cfg.assets.run_worker_first.includes('/api/search'));
 if(cart){assert.equal(cfg.main,'src/worker.js');assert.match(read(cfg.main),/env\.ASSETS\.fetch\(request\)/);}
 else {assert.equal(cfg.main,'./dist/_worker.js/index.js');assert.match(read('src/pages/api/search.ts'),/prerender = false/);assert.match(read('src/pages/api/search.ts'),/env\.ASSETS\.fetch/);}
});
