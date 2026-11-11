---
title: "Laravel Sitemaps for Large Sites: Indexes, Chunks and Caching"
description: "How to structure XML sitemaps when your Laravel app has tens of thousands of URLs: sitemap indexes, chunked files, and cache strategy."
pubDate: 2026-11-11
author: Stefan Bogdanescu
tags: ["laravel seo", "xml sitemap", "sitemap index", "large sites"]
featured: false
---

<h2>Why One Sitemap File Stops Working</h2>
      <p>XML sitemaps have hard limits: 50,000 URLs or 50MB uncompressed per file. A growing Laravel application - blog posts, products, tag pages, profiles - crosses that line faster than expected. The answer is not a bigger file; it is a different structure.</p>

      <h2>The Sitemap Index Pattern</h2>
      <p>A sitemap index is a sitemap of sitemaps. The root file - <code>/sitemap.xml</code> - lists child sitemaps: one for posts, one for products, one per month of archive content. Search engines read the index and fetch the children on their own schedule. Each child stays small, fast to generate and fast to crawl.</p>
      <ul>
        <li>Group children by content type so a re-crawl of one section does not touch the others</li>
        <li>Keep each child well under the limits - 10,000 URLs is a comfortable working ceiling</li>
        <li>Set <code>lastmod</code> on the index entries honestly; Google uses it to decide what to re-fetch</li>
      </ul>

      <h2>Generate or Serve From Cache?</h2>
      <p>Rendering 10,000 URLs per request is wasted work. The practical pattern for Laravel: generate each child sitemap on a schedule or on content change, store the XML, and serve the stored file. A model observer that marks the relevant chunk dirty on save gives you fresh sitemaps without per-request cost.</p>

      <h2>What to Leave Out</h2>
      <p>A sitemap is a suggestion of what deserves crawling. Include canonical URLs that you want indexed. Do not automatically exclude later pages of a paginated sequence: Google treats them as separate pages. Keep unwanted search and filter variants out of the sitemap, and decide their crawl and indexing rules separately. Sitemap inclusion helps discovery but does not guarantee crawling or indexing.</p>

      <h2>Submit and Verify</h2>
      <p>Reference the index in <code>robots.txt</code> and submit it in Google Search Console. The coverage reports then tell you per child sitemap which sections are being indexed and which are being ignored - free diagnostics most sites never read.</p>

<h2>Sources and scope</h2>
<p>The search guidance below comes from Google Search Central. The Laravel implementation patterns in this article are engineering suggestions, not claims that a particular package implements them or guarantees rankings.</p>
<ul>
<li><a href="https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap">Google Search Central: build-sitemap</a></li>
<li><a href="https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading">Google Search Central: pagination-and-incremental-page-loading</a></li>
</ul>
