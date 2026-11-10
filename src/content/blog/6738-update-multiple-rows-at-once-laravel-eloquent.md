---
title: "Update multiple rows at once Laravel Eloquent"
description: "Mastering Bulk Updates: Efficiently Updating Multiple Eloquent Rows in Laravel As senior developers, we often encounter scenarios where we need to modify a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As senior developers, we often encounter scenarios where we need to modify a large set of records based on a specific condition—a classic bulk operation. When working with Laravel Eloquent, especially when dealing with database operations that involve looping over results and saving individual models, performance can quickly degrade.

Let’s examine the common approach for updating multiple rows and explore how we can achieve this task far more efficiently, leveraging the power of the underlying database engine rather than relying on N+1 object saves.

## The Performance Bottleneck in Iterative Saving

The initial code snippet provided demonstrates a functional way to solve the problem:

```php
$yes = Tour::whereIn('id', $request->promote)->get();
$no = Tour::whereNotIn('id', $request->promote)->get();

foreach ($yes as $item) {
    $item->promote = 1;
    $item->save(); // N individual database operations
}

foreach ($no as $item) {
    $item->promote = 0;
    $item->save(); // M individual database operations
}
```

While this code successfully updates the data, it is inherently inefficient for large datasets. For every item retrieved in `$yes` and `$no`, the code executes a separate `UPDATE` query (via `$item->save()`). If you have hundreds or thousands of records, this results in potentially hundreds or thousands of individual database round trips, which significantly slows down the overall process. This pattern is often referred to as the N+1 problem applied to mass updates.

## The Efficient Solution: Leveraging Mass Updates

The goal is to replace these iterative saves with a single, atomic database operation where possible. Instead of fetching records and saving them one by one, we should ask the database to perform the update directly on the selected set of IDs.

For this specific scenario—setting values based on whether an ID exists in a list—we can use Eloquent's `whereIn` or raw query builders to execute bulk updates.

### Method 1: Using Conditional `update()`

Since we know exactly which records need to be set to `1` and which need to be set to `0`, we don't necessarily need to fetch the models first. We can perform two targeted mass updates directly on the `products` table (assuming your model is `Product` or `Tour`):

```php
use App\Models\Tour; // Or your actual model

$selectedIds = $request->promote;

// 1. Set 'promote' to 1 for all IDs in the request list
Tour::whereIn('id', $selectedIds)->update(['promote' => 1]);

// 2. Set 'promote' to 0 for all IDs NOT in the request list
Tour::whereNotIn('id', $selectedIds)->update(['promote' => 0]);
```

This approach is vastly superior because it translates directly into two highly optimized SQL `UPDATE` statements executed by the database engine, minimizing PHP processing time and drastically reducing database load. This is the most idiomatic and efficient way to handle bulk data manipulation in Laravel. For more complex relational updates or scenarios involving inserting new records based on conditions, understanding Eloquent's capabilities is key, as discussed in resources like those found at https://laravelcompany.com.

### Method 2: Using `upsert` for Complex Scenarios (Alternative)

If your requirement was slightly different—for example, updating only specific fields or inserting a new record if it doesn't exist—Laravel provides the powerful `upsert()` method. While not strictly necessary for this simple boolean flip, it is essential knowledge for complex database interactions.

For instance, if you were setting other related data based on these promotions, `upsert` allows you to handle these operations in a single query, which can be extremely beneficial when dealing with large data migrations or synchronizations.

## Conclusion

When optimizing Eloquent operations involving multiple records, always prioritize database-level efficiency over application-level iteration. The lesson here is simple: **avoid looping through results to perform individual saves whenever possible.** By utilizing Eloquent's mass update capabilities, such as `whereIn` combined with the `update()` method, you transform an inefficient N+1 process into a highly optimized bulk operation. This practice ensures your Laravel applications remain fast, scalable, and maintain high performance regardless of the data volume you handle.
