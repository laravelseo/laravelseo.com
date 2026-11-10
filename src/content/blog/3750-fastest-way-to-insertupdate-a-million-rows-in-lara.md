---
title: "Fastest way to insert/update a million rows in Laravel 5.7"
description: "The Fastest Way to Insert/Update a Million Rows in Laravel 5.7: Batching and Database Tuning Dealing with high frequency, large scale data synchronization is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

Dealing with high-frequency, large-scale data synchronization is one of the most common performance bottlenecks in application development. When you are dealing with tens of millions of rows and frequent updates, iterating over records one by one—the "N+1" problem applied to database operations—is a guaranteed path to severe slowdowns.

You are facing a classic ETL (Extract, Transform, Load) scenario where the goal is maximum throughput. As a senior developer, my advice is always to push the heavy lifting down to the database engine and use bulk operations in your application layer.

Let's break down your specific challenges regarding inserting and updating millions of rows efficiently in Laravel 5.7, focusing on both application-side optimizations and MySQL InnoDB tuning.

## Phase 1: The Staging Table Strategy – Is It Worth It?

Your idea to use a staging table (Table B) is fundamentally sound. When synchronizing large datasets where only a subset of records changes (60-70%), comparing the new data against the existing state before writing is significantly more efficient than complex, iterative `UPDATE` statements across millions of rows.

**The preferred approach here is not to compare record by record in PHP/Laravel, but to leverage atomic database operations.** Instead of fetching all data into PHP and then trying to determine which specific records need updating, you should let the database handle the synchronization logic directly.

### The Power of UPSERT: `INSERT ... ON DUPLICATE KEY UPDATE`

For your scenario, the most efficient way to achieve the update is using MySQL's `INSERT ... ON DUPLICATE KEY UPDATE` statement. This single command allows the database to check if a row exists (based on a unique key) and either insert a new one or update the existing one in a single, highly optimized operation, avoiding the need for separate `SELECT` queries followed by `INSERT` or `UPDATE`.

This strategy minimizes round trips between your Laravel application and the database, which is critical when dealing with high volumes. If you are building these operations using Laravel's Query Builder, this is achievable through raw SQL execution or specific package implementations that support this syntax (as demonstrated in many robust data handling patterns found on sites like https://laravelcompany.com).

## Phase 2: Optimizing Insertion Speed – Batching vs. Tuning

You have two distinct areas for optimization: the Laravel application layer and the MySQL engine level. Both must be addressed to hit speeds like 50,000 records per second.

### 1. Application Layer Optimization: Batch Inserts

Your current approach of iterating through the response and executing a separate `insert()` call for every record is extremely slow due to network latency and the overhead of establishing individual database connections/queries.

The solution is **Batch Insertion**. Instead of inserting one row at a time, you should collect all the data into a single array or collection and execute one large batch insert query.

**Example using Laravel's Query Builder for Batching:**

Instead of:
```php
foreach ($response as $key => $value) {
    DB::table('table_a')->insert([...]); // Slow, N queries
}
```

You should aggregate all data first and then perform one massive insertion:

```php
$dataToInsert = [];
foreach ($response as $key => $value) {
    // Prepare the data structure for batching
    $dataToInsert[] = [
        'test1' => $value['test1'],
        'test2' => $value['test2'],
        // ... other fields
    ];
}

// Execute a single batch insert operation
DB::table('table_a')->insert($dataToInsert); // Much faster!
```

By reducing the number of database round trips from potentially millions to just one or a few, you drastically reduce overhead and improve throughput.

### 2. Database Layer Optimization: InnoDB Tuning

While application batching handles network efficiency, MySQL/InnoDB tuning handles disk I/O efficiency. Your current settings are a good starting point, but given your goal of achieving high-speed writes on an SSD, we can make some critical adjustments to maximize InnoDB's efficiency.

**Recommended InnoDB Configuration Adjustments:**

Since you are dealing with heavy write operations and have SSD storage (which speeds up I/O significantly compared to traditional HDDs), we need to allocate more memory for caching:

*   `innodb_buffer_pool_size`: This is the single most important setting. It dictates how much memory InnoDB uses to cache data and indexes. For a system with 16GB RAM, you should aim to allocate as much as possible here—often 70-80% of available RAM (e.g., 12GB or 14GB) if the database is the primary workload.
*   `innodb_log_file_size`: Increasing this allows InnoDB to write larger transaction logs, reducing the frequency of checkpointing operations.
*   `innodb_thread_concurrency`: For high concurrent writes, increasing this slightly can help manage parallel processing, although careful tuning is needed to avoid excessive context switching.

**Example Configuration Review:**

```sql
-- Reviewing your existing settings and making performance-focused changes:
innodb_buffer_pool_size        = 12G   -- Increased significantly for caching data/indexes on SSDs
innodb_log_file_size           = 512M  -- Larger log files reduce checkpoint overhead
innodb_thread_concurrency      = 32    -- Slightly increased concurrency
innodb_flush_log_at_trx_commit = 1     -- Use fsync=1 for better performance on SSDs (sacrificing minimal durability guarantee for speed)
innodb_flush_method            = OTHERS -- Let InnoDB choose the best flush method
```

By implementing these changes, you allow MySQL to keep more working data in memory (the buffer pool), reducing slow disk reads/writes, which directly translates into faster insert times. Remember, optimizing your database layer is just as crucial as optimizing your application code when dealing with massive data volumes; efficient architecture is key to performance, and leveraging robust frameworks like Laravel helps manage this complexity effectively.

## Conclusion

To achieve the desired speed for inserting millions of rows in a high-frequency sync scenario:

1.  **Application Layer:** Abandon row-by-row inserts. Implement **Batch Inserts** by collecting data into arrays and executing single, large `INSERT` statements.
2.  **Database Layer:** Optimize your MySQL InnoDB settings. Prioritize increasing the `innodb_buffer_pool_size` to utilize your SSD effectively for caching, and adjust log file sizes to minimize checkpoint overhead.

By combining these two strategies—efficient data handling in Laravel and optimized storage at the database level—you will be able to achieve the high throughput you require.
