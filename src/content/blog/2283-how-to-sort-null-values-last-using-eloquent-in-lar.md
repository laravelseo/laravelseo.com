---
title: "How to sort NULL values last using Eloquent in Laravel"
description: "How to Sort NULL Values Last Using Eloquent in Laravel As developers working with relational databases, handling NULL values during sorting is a common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers working with relational databases, handling `NULL` values during sorting is a common sticking point. In your scenario—managing employee relationships and needing a specific sort order that includes nullable integer fields—you run into a fundamental behavior of SQL: by default, when sorting in ascending order (`ASC`), `NULL` values are treated as the lowest possible value and thus appear first.

You are on the right track trying to use SQL functions like `ISNULL`, but as you discovered, relying solely on raw SQL can introduce portability issues or lead to errors if the specific database dialect doesn't support that exact function in the context you need. The trick here is not to manipulate the data *before* sorting, but to instruct the database engine how to handle the sort order directly within the query.

This guide will show you the most idiomatic and robust way to ensure `NULL` values are always sorted last using Eloquent's powerful methods.

## Understanding the SQL Limitation

When you use `$this->orderBy('sortOrder', 'asc')`, Laravel generates a standard SQL `ORDER BY sortOrder ASC`. In most relational databases (like MySQL, PostgreSQL), this naturally places all rows where `sortOrder` is `NULL` at the very beginning of the result set.

To achieve the desired behavior—placing `NULL`s at the end—we need to leverage database-specific extensions that allow for explicit NULL handling within the sort context.

## The Eloquent Solution: Leveraging Database Features

The most elegant solution involves utilizing functions that explicitly handle nulls during sorting, which modern SQL databases fully support. This allows you to keep your Eloquent code clean while achieving complex sorting logic.

### Method 1: Using `NULLS LAST` (Recommended)

Many advanced database systems allow you to append the `NULLS LAST` clause directly to an `ORDER BY` statement. Laravel’s Eloquent supports passing these raw expressions through its query builder, letting the database handle the heavy lifting efficiently.

Since this feature is highly dependent on your underlying database (PostgreSQL handles this exceptionally well), it's important to know that while standard MySQL might require a slightly different approach (see Method 2), this is the cleanest method when available.

Your `Group` model implementation would look like this:

```php
class Group extends Eloquent {

    public function employees()
    {
        // Instruct the database to sort by sortOrder ascending, placing NULLs last.
        return $this->belongsToMany('Employee')
                    ->orderBy('sortOrder', 'asc')
                    ->orderBy('sortOrder', 'last'); // Note: Specific syntax might vary slightly based on DB driver setup, but we aim for the functional equivalent.
    }
}
```

**A more portable and robust approach is often to use a `CASE` statement within the query builder if direct `NULLS LAST` support isn't universally guaranteed.**

### Method 2: The Robust Fallback using `CASE` Expressions

If you need maximum compatibility across different database systems, the most reliable method is to explicitly map `NULL` values to a very large number when sorting. Any number larger than your maximum possible sort value will naturally be sorted after the actual data.

We can achieve this by using the `DB::raw()` method within Eloquent to construct a custom sorting expression:

```php
use Illuminate\Support\Facades\DB;

// In your controller or model scope:
$board = Group::find(6)->employees()->orderBy(DB::raw("CASE WHEN sortOrder IS NULL THEN 1000000 ELSE sortOrder END"), 'asc');
```

**Explanation of the `CASE` logic:**

1.  **`CASE WHEN
