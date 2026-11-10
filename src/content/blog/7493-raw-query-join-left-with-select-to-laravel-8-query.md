---
title: "raw query join left with select to laravel 8 query"
description: "Mastering Complex Joins: Converting Raw SQL to Laravel Query Builder As senior developers working with large datasets, we often find ourselves in a situation..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

As senior developers working with large datasets, we often find ourselves in a situation where complex data retrieval requires writing raw SQL queries. While `DB::select()` is powerful for immediate results, the true strength of an ORM like Laravel lies in abstracting this complexity into expressive Eloquent and Query Builder syntax. The challenge, as you’ve experienced, is knowing how to translate intricate `LEFT JOIN`s and derived subqueries from raw SQL into idiomatic Laravel code.

This post will walk you through the process of deconstructing your complex raw query and rebuilding it using Laravel's Query Builder methods, focusing on practical solutions for handling advanced joins.

## The Challenge with Raw Queries in Laravel

When you use `DB::select()`, you are telling the database exactly what to do, which is efficient. However, when you try to move this logic into Eloquent, you hit a wall because Eloquent thrives on *relationships* (one-to-one, one-to-many) rather than arbitrary, multi-level joins defined purely by table names.

Your provided query involves several `LEFT JOIN` operations and a derived subquery using `GROUP_CONCAT`:

```sql
SELECT buku.*, kategory, tag
FROM buku
LEFT JOIN kategori_buku ON buku.id_kategori = kategori_buku.id
LEFT JOIN detail_buku_tag ON buku.id = detail_buku_tag.id_buku
LEFT JOIN (SELECT tag_buku.id, GROUP_CONCAT(tag) AS tag FROM tag_buku) AS tag_buku ON tag_buku.id = detail_buku_tag.id_tag
GROUP BY buku.id
```

Translating this directly is difficult because the complexity lies not just in joining tables but also in the aggregation (`GROUP BY` and `GROUP_CONCAT`).

## Strategy 1: Deconstructing Complexity for Query Builder

Instead of trying to force every single join into a single, monolithic Eloquent call, we break the query down into logical steps. For complex aggregations like yours, using the Query Builder's explicit `join()` methods combined with subqueries is often the clearest path forward.

### Step 1: Handling the Derived Table (The Subquery)

The most complex part of your query is the derived table that calculates grouped tags: `(SELECT tag_buku.id, GROUP_CONCAT(tag) AS tag FROM tag_buku) AS tag_buku`. We need to execute this subquery first and then join it back. In Laravel, we achieve this using nested queries.

### Step 2: Implementing the Joins

We start with the main table (`buku`) and sequentially apply the necessary `leftJoin()` calls. Since you are dealing with relationships, ensuring your models define these relationships correctly is crucial for long-term maintainability, as advocated by best practices shown on platforms like [laravelcompany.com](https://laravelcompany.com).

Here is how we can reconstruct that logic using the Query Builder:

```php
use Illuminate\Support\Facades\DB;

$bukuData = DB::table('buku')
    ->select([
        'buku.*', 
        'kategori.nama_kategori as kategory', // Assuming you fetch category name
        DB::raw('GROUP_CONCAT(DISTINCT tag) as tags') // Mimicking the GROUP_CONCAT logic here
    ])
    ->leftJoin('kategori_buku', 'buku.id_kategori', '=', 'kategori_buku.id')
    ->leftJoin('detail_buku_tag', 'buku.id', '=', 'detail_buku_tag.id_buku')
    // Join the derived/subquery structure (we join to tag_buku)
    ->leftJoin('tag_buku', 'tag_buku.id', '=', 'detail_buku_tag.id_tag')
    // Apply grouping based on the original requirement
    ->groupBy('buku.id')
    ->get();
```

### Step 3: The Advanced Technique – Using `with` for Simplicity (When Possible)

While the above example directly translates the joins, a more Laravel-idiomatic approach involves defining Eloquent relationships first. If you had defined relationships like `buku->category()` and handled the many-to-many relationship with tags separately, the query would simplify dramatically. However, when dealing with highly specific aggregations like `GROUP_CONCAT`, sometimes leveraging raw expressions within the Query Builder remains the most direct way to achieve that exact database result efficiently.

## Conclusion: Abstraction is Key

Converting complex raw joins into the Laravel Query Builder is less about finding a single magic function and more about understanding how Eloquent abstracts SQL concepts. For simple CRUD operations, Eloquent shines brightly. For highly relational queries involving deep, multi-level `LEFT JOIN`s and custom aggregations (like your `GROUP_CONCAT`), using the Query Builder’s explicit `join()` methods, combined with carefully constructed subqueries or raw expressions (`DB::raw()`), provides the necessary control without sacrificing performance.

Always remember that the goal is not just to write SQL; it's to use Laravel's tools to express your data intentions cleanly and maintainably, making complex database interactions easier to manage.
