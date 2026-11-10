---
title: "Get min(date), max(date) with group by eloquent laravel"
description: "Mastering Date Aggregation in Eloquent: Finding Min and Max Dates with Group By As developers working with relational databases through an ORM like Eloquent,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As developers working with relational databases through an ORM like Eloquent, one of the most common tasks is aggregating data. Often, we need to find the earliest or latest value associated with a specific grouping—in this case, finding the minimum and maximum dates for each unique code.

The challenge you are facing—retrieving `min(date)` and `max(date)` alongside a `group by` clause in Laravel Eloquent—is very common. While standard methods like `unique()` help deduplicate records, they do not perform mathematical aggregation. To solve this effectively, we need to leverage the underlying power of SQL aggregation functions within Eloquent.

This guide will walk you through the most robust and efficient ways to achieve this goal in Laravel, ensuring your data queries are clean, fast, and adhere to best practices.

## Why Simple Grouping Isn't Enough

When you use `->groupBy('code')` followed by `->get()`, Eloquent groups the results but doesn't automatically calculate aggregate functions like `MIN()` or `MAX()` on the grouped fields. To get these calculated values, we must instruct the database directly using aggregation methods.

The key to solving this lies in using the `select()` method combined with the `min()` and `max()` methods on the date column, all within a `groupBy` context.

## Solution 1: Using Eloquent Aggregation (`min()` and `max()`)

The most idiomatic Laravel way to solve this is by utilizing Eloquent's ability to handle raw SQL expressions or using accessor methods if you are defining custom relationships. For simple aggregation, we often combine the grouping with explicit selection of the aggregate functions.

Let’s assume your model is named `Dataset` and you want to find the minimum and maximum date for each `code`.

### The Implementation

We will use the `groupBy()` method combined with selecting the aggregate functions directly.

```php
use App\Models\Dataset;
use Illuminate\Support\Facades\DB;

$results = Dataset::select('code', DB::raw('MIN(date) as min_date'), DB::raw('MAX(date) as max_date'))
    ->groupBy('code')
    ->get();
```

### Explanation of the Code

1.  **`Dataset::select(...)`**: We start by specifying exactly what data we want back.
2.  **`DB::raw('MIN(date) as min_date')`**: Since Eloquent doesn't provide a direct `min()` method mapped easily to a relationship, we use the `DB::raw()` helper. This allows us to inject raw SQL functions (`MIN`, `MAX`) directly into the query. We alias the result as `min_date`.
3.  **`DB::raw('MAX(date) as max_date')`**: Similarly, we calculate the maximum date and alias it as `max_date`.
4.  **`->groupBy('code')`**: This is the crucial step. It tells the database to group all rows that share the same `code` before applying the aggregate functions (`MIN` and `MAX`) to those groups.

This approach ensures that for every unique code, you get one record containing its earliest date and its latest date. This pattern demonstrates how powerful Eloquent is when combined with the underlying SQL capabilities, making complex data manipulation manageable. For advanced querying techniques, reviewing documentation on database interactions, such as what is discussed at [https://laravelcompany.com](https://laravelcompany.com), always provides context for these powerful methods.

## Solution 2: The Two-Query Approach (Alternative)

While the single query above is generally preferred for performance, sometimes developers prefer a two-query approach if the logic becomes overly complex or if they need to fetch the results separately. This involves finding the minimum and maximum dates in separate queries and then joining them back.

```php
// Query 1: Get the minimum date for each code
$minDates = Dataset::select('code', DB::raw('MIN(date) as min_date'))
    ->groupBy('code')
    ->get()
    ->keyBy('code'); // Index results by code for easy lookup

// Query 2: Get the maximum date for each code
$maxDates = Dataset::select('code', DB::raw('MAX(date) as max_date'))
    ->groupBy('code')
    ->get()
    ->keyBy('code');

// Merge the results (Example of a simplified merge)
$finalResults = $minDates->map(function ($code, $data) use ($maxDates) {
    $data->max_date = $maxDates->get($code)->max_date;
    return $data;
});

// $finalResults now contains code, min_date, and max_date for every group.
```

## Conclusion: Choosing the Right Tool

For your specific requirement—getting both the minimum and maximum dates grouped by a code—**Solution 1 (using `DB::raw()` with `groupBy()`) is the superior choice.** It is more efficient because it requires only a single database trip, minimizing latency.

When working with complex data aggregation in Laravel, remember that Eloquent is an abstraction layer over SQL. Understanding how to invoke raw SQL functions like `MIN()`, `MAX()`, and `GROUP BY` within your queries allows you to write highly optimized code. Keep exploring the resources provided by [https://laravelcompany.com](https://laravelcompany.com) to master these concepts, and you will be able to handle virtually any data challenge efficiently.
