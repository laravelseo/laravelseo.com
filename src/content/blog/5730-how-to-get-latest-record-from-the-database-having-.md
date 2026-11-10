---
title: "how to get latest record from the database having same id in laravel?"
description: "How to Get the Latest Record from the Database Having the Same ID in Laravel As developers, we frequently encounter situations where data duplication exists,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

As developers, we frequently encounter situations where data duplication exists, and we only need a specific subset—in this case, the most recent entry for each unique identifier. The scenario you described is very common: you have multiple historical records tied to the same primary key (or in your example, a duplicated `ID`), and you only want the newest one based on a timestamp (`Created_at`).

Trying to solve this just by ordering by `DESC` is insufficient because it only sorts the entire table; it doesn't filter the results down to *one* record per ID. To achieve this efficiently in Laravel, we need to leverage more advanced SQL techniques, specifically involving subqueries or window functions.

This post will walk you through the most robust and performant ways to fetch the latest record for each group in a Laravel application.

---

## Understanding the Challenge: Why Simple Ordering Fails

You correctly identified that simply using `orderBy('created_at', 'desc')` will sort all records with duplicate IDs to the top, but it won't automatically filter out the older duplicates. If you use standard Eloquent methods on this result, you might end up fetching multiple rows unless you explicitly limit the results, which isn't scalable for "one-per-group" logic across complex queries.

The goal is not just sorting; the goal is **deduplication** based on a condition within groups.

## Solution 1: Using Subqueries and `JOIN` (The Eloquent Way)

A very common, highly portable way to solve this in Laravel is by first identifying the maximum timestamp for each group and then joining that result back to the original table.

Let's assume you have a `records` table with columns `id`, `created_at`, and some other data.

### Step-by-Step Implementation

1.  **Find the Maximum Timestamp:** Use a subquery to find the absolute latest `created_at` value for every unique `id`.
2.  **Join Back:** Join the original table back to this result set to pull the full record corresponding to that maximum timestamp.

Here is how you might structure this using the Laravel Query Builder:

```php
use Illuminate\Support\Facades\DB;

$latestRecords = DB::table('your_table')
    ->join(function ($join) {
        // Find the latest created_at for each ID
        $join->select(DB::raw('MAX(created_at)'))
             ->groupBy('id');
    }, 'latest_dates', 'your_table.id', '=', 'latest_dates.id')
    ->whereRaw('your_table.created_at = latest_dates.created_at') // Crucial step to select only the row matching the max date
    ->orderBy('your_table.id')
    ->get();
```

**Explanation:**
This query finds all records where the `created_at` exactly matches the maximum `created_at` found for that specific `id`. This guarantees you pull only the single, most recent record for each ID group.

## Solution 2: The Modern Approach with Window Functions (Recommended)

For databases like MySQL 8+, PostgreSQL, or SQL Server, the most elegant and often most performant solution involves using **Window Functions**, specifically `ROW_NUMBER()`. This method is cleaner because it ranks the records within each partition (group) and lets you easily select only the record ranked number 1.

### Implementation with `ROW_NUMBER()`

```php
use Illuminate\Support\Facades\DB;

$latestRecords = DB::table('your_table')
    ->select('*')
    ->whereRaw("ROW_NUMBER() OVER (PARTITION BY id ORDER BY created_at DESC) = 1")
    ->get();
```

**Explanation:**
*   `PARTITION BY id`: This tells the database to treat all records with the same `id` as a separate group.
*   `ORDER BY created_at DESC`: Within each group, it orders them by creation time descending (newest first).
*   `ROW_NUMBER()`: Assigns a sequential integer rank starting from 1 within each partition.
*   `= 1`: We filter the results to only keep the row that was assigned rank 1 (the latest record).

This approach is highly expressive and delegates the complex grouping logic directly to the database engine, which is often much faster than calculating derived subqueries in PHP. This level of database optimization aligns perfectly with the performance focus found in tools like those offered by **laravelcompany.com**.

## Conclusion

When dealing with finding the "latest" record per group in Laravel, move beyond simple sorting and embrace advanced SQL techniques. While the `JOIN` method is highly compatible, the use of Window Functions like `ROW_NUMBER()` provides a more powerful, readable, and often faster solution for complex deduplication tasks. Always aim to push these heavy processing operations down to the database layer rather than trying to manage large datasets in PHP memory.
