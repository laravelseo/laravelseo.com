---
title: "How to extract all rows which is duplicates in laravel?"
description: "How to Extract All Duplicate Rows in Laravel: A Deep Dive into SQL Grouping As a senior developer working with Laravel, you frequently encounter scenarios..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel, you frequently encounter scenarios where you need to identify and extract entire sets of duplicate records from your database. The problem you've encountered—where using `groupBy` only returns one representative row instead of all the duplicates—is a very common stumbling block when moving between simple aggregation and full record retrieval in SQL.

This post will walk you through the correct, efficient, and idiomatic ways to extract *all* rows that share the same combination of values (like `name` and `location`) in your Laravel application, providing practical solutions for your data management needs.

## The Pitfall of Simple Grouping

You correctly identified the initial step: grouping by the fields you consider duplicates. Your attempt using `groupBy('name', 'location')` combined with `having('count', '>', 1)` is the standard way to *identify* which combinations are duplicated. However, this query only returns the unique groups themselves (e.g., John/Europe, Smith/Dubai). It does not return the actual rows belonging to those groups.

To get all the duplicate records, we need a strategy that first identifies the duplicate keys and then uses those keys to pull every matching row from the original table.

## Solution 1: Using Subqueries with `WHERE IN` (The Eloquent Approach)

The most straightforward way in Laravel is to use a subquery to find the combinations that are duplicated, and then select all records matching those combinations. This approach is highly readable and works perfectly within the Laravel Query Builder or Eloquent.

Let’s assume we are working with the `users` table. We want to find all users who share the same `name` and `location`.

### The Implementation

We will first find the distinct combinations of `name` and `location` that appear more than once, and then use those results to filter the original table.

```php
use Illuminate\Support\Facades\DB;

$duplicates = DB::table('users')
    // Step 1: Filter for groups that have duplicates based on name and location
    ->whereIn(function ($query) {
        $query->select('name', 'location')
              ->groupBy('name', 'location')
              ->havingRaw('COUNT(*) > 1');
    }, 'name', 'location') // This part handles the complexity of filtering based on the group count
    ->select('users.*') // Select all columns from the users table
    ->get();

// Note: The complexity above is often easier handled by finding the duplicate keys first.
```

A cleaner and more robust approach involves using a subquery to isolate the duplicated combinations:

```php
$duplicateCombinations = DB::table('users')
    ->select('name', 'location')
    ->groupBy('name', 'location')
    ->havingRaw('COUNT(*) > 1');

// Now, select all users whose (name, location) combination exists in the duplicated list
$allDuplicateRows = DB::table('users')
    ->joinSub($duplicateCombinations, 'duplicates', function ($join) {
        $join->on('users.name', '=', 'duplicates.name')
             ->on('users.location', '=', 'duplicates.location');
    })
    ->select('users.*')
    ->get();

// $allDuplicateRows now contains all rows that are part of a duplicate group.
```

## Solution 2: Using Window Functions (The Modern SQL Approach)

For more complex scenarios or when dealing with very large datasets, using SQL window functions like `PARTITION BY` offers a highly efficient way to solve this problem without needing multiple joins. This is often the preferred method in high-performance database operations.

Window functions allow you to perform calculations across a set of table rows that are related to the current row. We use `COUNT()` partitioned by our duplicate columns.

```php
$allDuplicateRowsWithWindow = DB::table('users')
    ->select(
        'id', 
        'name', 
        'location', 
        'phone_number'
    )
    ->where(function ($query) {
        // Filter only for rows where the count of identical (name, location) pairs is greater than 1
        $query->selectRaw("COUNT(*) OVER (PARTITION BY name, location) > 1");
    })
    ->get();
```

This method is powerful because it calculates the group count for every row in a single pass and only returns the rows that belong to groups with more than one member. This leverages the database engine's optimization capabilities effectively.

## Conclusion: Best Practices in Laravel Data Handling

When dealing with duplicate data in Laravel, remember that the goal shifts from simple aggregation (`groupBy`) to set retrieval (finding all members of a set).

1.  **For Simplicity:** Use the `JOIN` with a subquery method (Solution 1) if readability is paramount.
2.  **For Performance:** Embrace Window Functions (Solution 2). They are often faster for large tables as they avoid creating intermediate result sets that require multiple joins.

As you build complex applications using Laravel, mastering these underlying SQL concepts is crucial. Understanding how to write efficient queries directly impacts the performance and scalability of your application. Always strive to leverage the power of the database efficiently; for more advanced Eloquent patterns and best practices in data modeling within Laravel, I highly recommend exploring resources from [laravelcompany.com](https://laravelcompany.com).
