---
title: "Laravel Fluent queries - How do I perform a 'SELECT AS' using Fluent?"
description: "Laravel Fluent Queries: Performing 'SELECT AS' with Complex Expressions As developers working with Laravel, we often gravitate towards the elegance and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "HTML", "Errors"]
featured: false
---

As developers working with Laravel, we often gravitate towards the elegance and chainability of the Fluent Query Builder. It allows us to construct complex database queries in a highly readable manner. However, when we move beyond simple column selection and need to introduce calculated fields—especially those involving complex SQL functions like `CONCAT` or `SUBSTRING_INDEX` with aliasing (`AS`)—we frequently encounter a boundary where the Fluent syntax needs to interface directly with raw SQL power.

This post dives into how you can seamlessly incorporate these powerful, calculated expressions into your Laravel Fluent queries, achieving that desired `SELECT AS` functionality without abandoning the fluent paradigm entirely.

## The Need for Raw Expressions in Fluent Queries

The core of the problem lies in the distinction between selecting existing columns (which is pure Fluent) and calculating new values on the fly (which requires SQL interpretation). Standard methods like `$query->select('column_name')` are designed to select explicitly named fields from the table schema. When you need to execute arbitrary functions or string manipulations directly within the `SELECT` clause, you must step into the realm of raw SQL.

Your example involves creating a new derived column:
```sql
concat(SUBSTRING_INDEX(description, ' ', 25), '...') AS description
```
This expression cannot be handled by simple fluent methods alone; it requires the database engine to interpret the function before returning the result.

## Integrating `DB::raw()` into the Fluent Chain

The solution is to leverage the `select()` method and inject our raw SQL expressions using the `DB::raw()` helper. This allows you to mix standard column selections with custom, calculated columns in a single fluent chain.

Here is how we can modify your scenario to select all rows from the `hire_bikes` table, order them randomly, and calculate a truncated description:

### Step-by-Step Implementation

We will combine the ordering (which is already raw) with a multi-part selection: selecting standard columns alongside our newly calculated, aliased expression.

```php
use Illuminate\Support\Facades\DB;

$results = DB::table('hire_bikes')
    // 1. Apply raw ordering for random sorting
    ->orderBy(DB::raw('RAND()'))
    // 2. Use select() to combine standard columns with a calculated expression aliased as 'description'
    ->select([
        'bike_id', // Example of selecting an existing column
        DB::raw("CONCAT(SUBSTRING_INDEX(description, ' ', 25), '...') AS description")
    ])
    ->get();

// $results now contains the bike data with a newly calculated, aliased description.
```

### Explanation of the Technique

1.  **Fluent Foundation:** We start with `DB::table('hire_bikes')`, maintaining the fluent entry point.
2.  **Ordering:** The random sorting remains clean: `orderBy(DB::raw('RAND()'))`. This is a perfect use case for injecting raw functions where necessary.
3.  **Selective Selection (`select()`):** Instead of passing simple strings to `select()`, we pass an array. Inside this array, we mix standard column names (e.g., `'bike_id'`) with our custom expression wrapped in `DB::raw(...)`.
4.  **Aliasing:** Crucially, the entire raw expression is followed by the desired alias using the `AS` keyword *inside* the `DB::raw()` call, ensuring the database handles the aliasing correctly before Laravel receives the result set.

## Best Practices and Context for Laravel Development

When constructing complex queries in Laravel, remember that the Fluent layer is a powerful abstraction over the underlying SQL. While it shines for CRUD operations, understanding where to deploy raw expressions is key to mastering the Query Builder. As you build more intricate data interactions, like those seen when dealing with relational data or advanced filtering, sticking to clean Eloquent and Query Builder patterns—as promoted by resources like [laravelcompany.com](https://laravelcompany.com)—will keep your code maintainable.

Using `DB::raw()` judiciously is an accepted pattern when you need database-specific functions, complex joins, or custom aggregations that the fluent methods do not abstract away. It doesn't
