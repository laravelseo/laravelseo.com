---
title: "Laravel 5.5 - update or create bulk insert"
description: "Mastering Bulk Operations in Laravel: Updating or Creating 200,000 Records Efficiently As a senior developer working with large datasets in Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As a senior developer working with large datasets in Laravel applications, performance is often the bottleneck. When we start dealing with operations that involve updating or creating hundreds of thousands of records, the simple Eloquent methods, while elegant for small tasks, quickly become performance liabilities when executed iteratively.

You’ve hit a very common roadblock: performing `updateOrCreate` inside a `foreach` loop on 200,000 records is slow. This slowdown isn't necessarily due to the Eloquent syntax itself, but rather the sheer number of individual database round trips and the overhead associated with initializing and committing transactions for each iteration.

This post will dive into how you can move beyond iterative processing and leverage Laravel and underlying database capabilities to achieve lightning-fast bulk updates or inserts.

---

## The Performance Pitfall of Iterative Operations

When you use methods like `Model::updateOrCreate()` within a loop iterating over 200,000 records, you are essentially forcing the database to execute 200,000 separate write operations. Each operation incurs network latency and transaction overhead, making the process excruciatingly slow.

If you are dealing with large-scale data manipulation, the goal should always be to minimize the number of interactions between your application layer (PHP/Laravel) and the database engine. We need to transition from row-by-row processing to set-based operations.

## Solution 1: The Modern Eloquent Approach – `upsert()`

For modern Laravel applications (especially those running on MySQL 8+, PostgreSQL, or SQLite), the most elegant and performant solution for an "update or create" scenario is the built-in `upsert()` method. This method allows you to pass an array of data directly to the database in a single query, handling the logic internally.

The `upsert` method is designed precisely for this use case, allowing you to define which columns to update if a matching record exists and which to insert if it does not.

### Code Example using `upsert()`

Let’s assume we are working with a `Product` model and want to synchronize 200,000 records from an array of data.

```php
use App\Models\Product;
use Illuminate\Support\Facades\DB;

// 1. Prepare the data batch (e.g., fetched from a CSV or API)
$dataToUpsert = [
    ['sku' => 'A100', 'name' => 'Laptop Pro', 'price' => 1200.00],
    ['sku' => 'B200', 'name' => 'Monitor X', 'price' => 350.50],
    // ... 199,998 more records
];

// 2. Perform the bulk upsert operation
DB::table('products')->upsert(
    $dataToUpsert,
    ['sku'], // The columns that define a unique constraint (the match key)
    ['name', 'price'] // The columns to update if a match is found
);

// This single query replaces 200,000 individual database calls.
```

This approach drastically reduces overhead because the entire operation is handled within one highly optimized SQL statement executed by the database engine. For more complex scenarios involving multiple tables or conditional logic, mastering these bulk operations is crucial for building scalable systems, much like understanding advanced Eloquent features available on the [Laravel Company website](https://laravelcompany.com).

## Solution 2: Raw SQL for Extreme Performance (The Alternative)

If you are dealing with truly massive datasets (millions of records) or need absolute maximum performance without relying solely on Eloquent abstractions, a direct raw SQL query using `INSERT ... ON DUPLICATE KEY UPDATE` (for MySQL) or `MERGE` statements (for SQL Server/PostgreSQL) can be the fastest route.

This method bypasses the ORM overhead entirely and communicates directly with the database engine. While it requires more manual SQL knowledge, it is unbeatable for raw speed on bulk operations.

```sql
-- Example using MySQL syntax for update or insert
INSERT INTO products (sku, name, price) VALUES 
('A100', 'Laptop Pro', 1200.00),
('B200', 'Monitor X', 350.50)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    price = VALUES(price);
```

## Conclusion: Choose the Right Tool

For your scenario involving 200,000 records, **`upsert()` is the recommended path**. It provides the necessary performance gain while keeping your code clean, readable, and idiomatic within the Laravel ecosystem. It represents the best balance between developer experience and database efficiency. Reserve raw SQL for scenarios where even `upsert()` proves insufficient or when dealing with highly specialized database features. By adopting these bulk techniques, you move from writing slow scripts to engineering high-performance data pipelines.
