---
title: "Importing large CSV files in MySQL using Laravel"
description: "Mastering Massive Imports: Importing Large CSV Files in Laravel Without Crashing Your Server Importing large datasets—think 50,000 or 100,000 rows of product..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

Importing large datasets—think 50,000 or 100,000 rows of product data—is a common challenge for developers using PHP and relational databases. When you combine file handling with complex relational lookups, memory limits and timeouts become inevitable roadblocks. As a senior developer, I’ve seen countless attempts to brute-force these imports, often resulting in marginal success, as you experienced with your chunking efforts.

This post dives deep into why standard iteration fails for massive imports and outlines advanced strategies using Laravel and MySQL to handle these behemoths efficiently.

## The Bottleneck: Why Chunking Isn't Enough

Your experience perfectly illustrates the core problem: iterating through rows one by one, performing complex `JOIN` operations within that loop (looking up categories, specifics, etc.), is computationally expensive and memory-intensive. Even with chunking results, if each iteration involves multiple database queries (an N+1 problem), the cumulative load quickly exhausts PHP’s memory limit or causes the process to time out before completion.

The issue isn't just reading the CSV; it's the heavy lifting performed *inside* the loop: fetching related data for every single row.

## Strategy 1: Optimizing File Ingestion with Maatwebsite/Laravel-Excel

While chunking is a necessary first step, we need to ensure we are not overloading the system at the reading stage either. The `maatwebsite/excel` package is excellent for parsing, but its efficiency depends entirely on what you do *after* the data is loaded into memory.

Instead of relying solely on loading everything before processing, focus on streaming and minimizing object creation during the read process. For very large files, consider moving away from reading the entire file into PHP memory at once if possible, although for standard CSV parsing, careful chunking remains the most practical immediate fix within Laravel.

```php
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ProductImport;

class ProductImportController extends Controller
{
    public function import(Request $request)
    {
        $file = $request->file('upload_file');

        Excel::import(new ProductImport, $file);

        return response()->json(['message' => 'Import initiated. Check jobs for progress.']);
    }
}
```

## Strategy 2: Shifting the Load to the Database (Batching and Raw Queries)

The most significant performance gain comes from minimizing PHP execution time for database operations. Instead of fetching related data inside the loop, we should leverage MySQL's power for bulk insertion and retrieval.

### A. Batch Inserts over Individual Eloquent Saves

Avoid calling `$model->save()` inside your chunked loop. Instead, collect all necessary data for a chunk and use raw SQL or Laravel’s `DB::table()` for bulk inserts. This dramatically reduces the overhead of establishing database connections for every single row.

### B. Pre-processing and Batch Lookups

Before starting the main import loop, identify which foreign keys you need to look up (e.g., categories). Instead of querying one by one inside the loop, read all necessary `category_id`s from the current chunk and perform a single mass lookup query:

```php
// Example conceptual step within your chunked loop
$categoryIds = $chunk->pluck('category_id')->unique();
$categories = DB::table('categories')
    ->whereIn('id', $categoryIds)
    ->get()
    ->keyBy('id'); // Use keyBy for fast O(1) lookup later

// Now, when processing the row:
if ($category_id && $categories->has($category_id)) {
    $category = $categories->get($category_id);
    // Proceed with insertion/update using the pre-fetched data.
} else {
    // Handle missing category error
}
```

## Strategy 3: The Long-Term Solution – File Splitting and Asynchronous Processing

For true 50k+ row imports, relying solely on a single request is inherently risky. Your instinct to explore splitting files and using cron jobs is correct. This shifts the heavy lifting from a synchronous web request (which has strict time limits) to an asynchronous background process.

1.  **Splitting:** Implement logic to split the massive CSV into smaller, manageable files (e.g., 5,000 rows each).
2.  **Queueing:** Instead of running the import in a controller method, trigger a queue job for *each* small file. This allows you to manage memory and timeouts gracefully.
3.  **Worker Efficiency:** The worker processes one small file at a time, minimizing the risk of total server failure.

This approach aligns perfectly with best practices in scalable Laravel applications, ensuring that your application remains responsive while heavy data operations occur safely in the background. For robust architecture advice on scaling your services, exploring patterns found in high-performance frameworks like those promoted by **Laravel Company** is highly recommended.

## Conclusion

Importing large CSV files successfully requires moving beyond simple file reading. The secret lies in optimizing the interaction between your application layer (PHP), your data access layer (SQL), and your queuing system. By focusing on batch operations, pre-loading relational data, and adopting asynchronous processing patterns, you can easily scale your import feature from handling a few thousand rows to managing hundreds of thousands without fear of hitting memory or timeout limits.
