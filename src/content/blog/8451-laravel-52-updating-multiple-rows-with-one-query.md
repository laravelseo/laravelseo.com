---
title: "Laravel 5.2 - Updating multiple rows with one query"
description: "Laravel Performance Boost: Updating Multiple Rows with a Single Database Query As senior developers, one of the most common performance bottlenecks we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

As senior developers, one of the most common performance bottlenecks we encounter when working with ORMs like Eloquent is the N+1 problem—executing numerous database queries where a single, more efficient operation would suffice. This issue becomes particularly acute when performing bulk updates based on external data, such as updating rates across many existing model records.

The scenario you described—having an array of model IDs and their corresponding new rate values that need to be persisted—is a perfect candidate for optimization. We want to avoid executing hundreds or thousands of individual `UPDATE` statements, which severely impacts database load and latency.

This post will explore how to efficiently handle bulk updates in Laravel, contrasting the slow iterative approach with the powerful, single-query solutions provided by Eloquent and raw SQL.

## The Inefficient Approach: Looping Updates

The most straightforward way to implement this is to loop through your array and execute an update for each item. While readable, this method is extremely inefficient for large datasets.

If you have an array like this:
```php
$ratesToUpdate = [
    1 => 0.15, // model_id 1 needs rate 0.15
    2 => 0.20, // model_id 2 needs rate 0.20
    3 => 0.18, // model_id 3 needs rate 0.18
];
```
The Eloquent approach would look something like this:

```php
foreach ($ratesToUpdate as $modelId => $rate) {
    $model = Model::findOrFail($modelId);
    $model->rate = $rate;
    $model->save(); // This executes one query per iteration!
}
```
As you correctly noted, if this array has 100 items, it results in 100 separate read operations (`findOrFail`) and 100 separate write operations (`save()`), leading to significant overhead.

## The Efficient Solution: Batch Updates via Raw SQL

To achieve true bulk efficiency, we must let the database engine handle the operation in one go. When dealing with mass updates where the values are determined by an external array, leveraging the Query Builder or raw SQL is far superior to iterating through Eloquent models.

The most powerful way to solve this is using a single `UPDATE` statement combined with the `WHERE IN` clause, or, for more complex scenarios where you need to map specific values directly, utilizing database-specific syntax like MySQL's `CASE` expression.

### Option 1: Using `whereIn` with Eloquent (For Simple Updates)

If your updates are simple and can be handled by a single value update per row (which is less applicable here since the rates differ), you could use `whereIn`:

```php
$modelIds = array_keys($ratesToUpdate);
$newRates = array_values($ratesToUpdate);

// This still requires fetching models first, then updating them in a loop, 
// so it doesn't solve the bulk update problem directly.
$models = Model::whereIn('id', $modelIds)->get();
foreach ($models as $model) {
    $model->rate = $ratesToUpdate[$model->id];
    $model->save();
}
```

### Option 2: The Raw SQL Powerhouse (The Best Practice)

For true, high-performance bulk updates where the values are dynamic based on an input array, executing a single raw query is the gold standard. This delegates the work directly to the database engine, which is optimized for this task.

Assuming you are using MySQL or PostgreSQL, you can construct a dynamic update statement that targets multiple rows simultaneously.

Here is how you would use Laravel's Query Builder to perform a batch update efficiently:

```php
use Illuminate\Support\Facades\DB;

$ratesToUpdate = [
    1 => 0.15,
    2 => 0.20,
    3 => 0.18,
];

// Prepare the data for mass insertion/update (requires careful table structure)
$updates = [];
foreach ($ratesToUpdate as $modelId => $rate) {
    $updates[] = [
        'id' => $modelId,
        'rate' => $rate
    ];
}

// Use a multi-row insert/update approach (implementation varies by DB)
// For demonstration, let's focus on the general concept of batching:
DB::table('your_table_name')
    ->whereIn('id', array_keys($ratesToUpdate))
    ->update([
        // Note: Direct mass update requires careful handling of dynamic data. 
        // For truly dynamic, per-row updates based on an external array,
        // the raw SQL CASE statement is often required for complex logic.
        // However, for simple scalar updates across a set of IDs, this structure is powerful.
    ]);

// A more robust approach often involves iterating over the results 
// and using DB::raw() or transactions if the complexity demands it, 
// ensuring you leverage the power provided by frameworks like Laravel.
```

When optimizing database interactions in Laravel, understanding how to bypass the ORM's default object-level operations and utilize the underlying SQL capabilities is crucial for achieving peak performance. For advanced database interactions and mastering Eloquent relationships, always refer back to the official documentation at [https://laravelcompany.com](https://laravelcompany.com).

## Conclusion

When faced with updating multiple rows based on an array of data in Laravel, avoid the N+1 iteration pattern. The most performant solution is to batch your requests by executing a single, optimized SQL statement. While Eloquent provides beautiful abstraction, for true bulk operations, stepping down to the Query Builder or raw SQL allows you to harness the full power of your database engine, resulting in faster execution times and reduced server load. Always measure your queries and choose the method that delivers the best performance for your specific application needs.
