---
title: "How to make a union query using Laravel Eloquent and Laravel Query Builder?"
description: "How to Make a UNION Query Using Laravel Eloquent and Query Builder As a senior developer working with Laravel, you often encounter complex data requirements..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As a senior developer working with Laravel, you often encounter complex data requirements that push the boundaries of what standard ORMs are designed for. While Laravel Eloquent provides an incredibly elegant way to interact with your database using expressive object-oriented syntax, operations like `UNION`—which require combining the results of two or more distinct `SELECT` statements into a single result set—often necessitate stepping down to the underlying Query Builder or raw SQL.

This guide will walk you through the most effective ways to implement complex `UNION` queries in Laravel, using both the Query Builder and Eloquent concepts.

## The Challenge with UNION in Eloquent

The core difficulty is that Eloquent models primarily map to a single table or a defined relationship. A `UNION` operation fundamentally merges results from separate tables based on common columns, which is a set operation rather than a simple object retrieval. Therefore, there isn't a direct, one-line method in Eloquent to chain two model queries together with a `UNION`.

To solve this, we must leverage the power of the Laravel Query Builder, which gives us granular control over SQL construction.

## Solution 1: Using the Query Builder's `union()` Method (The Clean Approach)

The most idiomatic way to handle unions in Laravel is by utilizing the `union()` method provided by the Query Builder. This allows you to define multiple selectable queries and combine their results seamlessly.

For your specific requirement, which involves selecting and renaming columns from two tables, we will build each part of the union separately and then combine them.

### Step-by-Step Implementation

Let’s assume you have two Eloquent models, `InRecord` and `OutRecord`, corresponding to your `in_records` and `out_records` tables.

```php
use Illuminate\Support\Facades\DB;

// 1. Build the first part of the UNION query (IN records)
$inQuery = DB::table('in_records')
    ->select(
        'item_id',
        'date',
        DB::raw("'IN' AS 'IN'"), // Alias for the 'IN' column
        DB::raw("'' AS 'OUT'"),  // Placeholder for the 'OUT' column
        'USER'
    );

// 2. Build the second part of the UNION query (OUT records)
$outQuery = DB::table('out_records')
    ->select(
        'item_id',
        'date',
        DB::raw("'' AS 'IN'"),  // Placeholder for the 'IN' column
        'value AS 'OUT',       // Select the actual value for the 'OUT' column
        'USER'
    );

// 3. Combine the queries using union() and apply ordering
$combinedQuery = $inQuery->union($outQuery)
    ->orderBy('date');

// Execute the final query
$results = $combinedQuery->get();

// $results will contain the combined data set
```

**Why this works:** By using `DB::raw()` within the `select` statements, we instruct the database to generate the specific column names required by your SQL structure (`'IN'` and `'OUT'`). The `union()` method then correctly merges these two result sets. This approach keeps the logic within the Query Builder, which is highly efficient.

## Solution 2: Executing Raw SQL (The Direct Approach)

When the logic becomes extremely complex or involves intricate database-specific syntax that is difficult to translate into chained Eloquent methods, executing the raw SQL directly via the `DB` facade is a powerful alternative. This method allows you to use your exact desired structure, ensuring 100% fidelity with your schema requirements.

For your sample query:

```sql
SELECT in_records.item_id, 
       in_records.date, 
       in_records.value AS 'IN', 
       ''               AS 'OUT', 
       in_records.USER 
FROM   in_records 
UNION 
SELECT out_records.item_id, 
       out_records.date, 
       ''                AS 'IN', 
       out_records.value AS 'OUT', 
       out_records.USER 
FROM   out_records 
ORDER  BY date
```

You can execute this using the `DB::select()` method:

```php
$sql = "
    SELECT item_id, date, value AS IN, '' AS OUT, USER FROM in_records
    UNION
    SELECT item_id, date, '' AS IN, value AS OUT, USER FROM out_records
    ORDER BY date
";

$results = DB::select($sql);
```

This method is excellent for performance-critical operations where you need absolute control over the generated SQL. As you build robust applications using Laravel, understanding when to use raw queries versus Eloquent methods is a key skill, allowing you to harness the full power of the framework and its underlying database capabilities. For deeper insights into structuring complex database interactions within the Laravel ecosystem, exploring resources like [laravelcompany.com](https://laravelcompany.com) is highly recommended.

## Conclusion

Making `UNION` queries in Laravel doesn't require forcing Eloquent to do something it isn't designed for. By understanding that set operations are best handled by the Query Builder, you can achieve complex data manipulation efficiently. Whether you use the programmatic `union()` method or execute raw SQL, both approaches provide a powerful, flexible solution for merging data from multiple sources into a unified result set. Choose the method that best suits the complexity and performance needs of your specific application.
