---
title: "How to write select query with subquery using laravel Eloquent Querybuilder?"
description: "How to Write Complex Select Queries with Subqueries in Laravel Eloquent QueryBuilder As developers working with relational databases, we frequently encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As developers working with relational databases, we frequently encounter scenarios where simple `SELECT` statements fall short. Complex reporting often requires nested logic, aggregations, and filtering based on results from other tables—this is where subqueries become essential. While Laravel Eloquent provides a beautiful, expressive layer over the underlying SQL, handling deeply nested structures requires understanding how to bridge the gap between abstract code and raw database power.

This post will walk you through your specific example, analyzing why the direct use of `DB::select(DB::raw(...))` works, and then demonstrate the more structured, maintainable way to achieve the same result using Laravel's Query Builder features.

## Understanding the Challenge: Subqueries in SQL

The SQL query you presented involves a derived table (a subquery in the `FROM` clause) that performs aggregation (`COUNT`) and date grouping *before* being joined back to another table.

Your initial attempt, using `DB::select(DB::raw(...))`, successfully executed this complex logic. However, mixing raw SQL strings directly into your application logic can reduce readability, make debugging harder, and bypass some of the safety features Eloquent provides. Our goal is to find a method that keeps our code expressive while still leveraging powerful database features.

## Method 1: The Direct Raw Approach (What You Did)

Your approach was functional because it delegates the entire complex logic directly to the database engine:

```php
$responseData = DB::select(DB::raw('
    select t.driver_id,
           total_delieveries,
           DATE_FORMAT(q1.created_at ,\'%Y-%m-%d\') as created_at
    from (
        SELECT
            driver_id,
            created_at,
            COUNT(driver_id) AS total_delieveries
        FROM
            orders
        WHERE
            is_paid = 0
            AND order_status = 5
            AND created_at BETWEEN :first_Day AND :last_Day
        GROUP BY DATE_FORMAT(created_at ,\'%Y-%m-%d\'),driver_id
    ) q1
    INNER JOIN orders t ON q1.driver_id = t.driver_id
    GROUP BY q1.created_at
'));
```

**Pros:** Maximum control over the SQL execution; highly efficient if you know the exact query structure.
**Cons:** Low Eloquent abstraction; difficult to read, maintain, and modify when dealing with complex date functions or nested logic.

## Method 2: The Structured Approach using Eloquent (The Better Way)

While you cannot perfectly replicate a deeply nested derived table directly within simple Eloquent relationships, the best practice is to break down the complexity into manageable steps using the Query Builder methods. This improves readability and adheres more closely to the principles of building queries in Laravel.

For complex aggregations like yours, we often use nested subqueries or Common Table Expressions (CTEs) if your database supports them (like PostgreSQL or MySQL 8+). Since Eloquent focuses on model interaction, we can structure the logic by first calculating the necessary aggregates and then joining.

Here is a more structured way to approach this, focusing on clarity, which aligns with best practices seen in modern Laravel development:

```php
use Illuminate\Support\Facades\DB;

// Define dynamic dates for safety (Crucial step!)
$first_Day = '2023-01-01'; // Example date
$last_Day = '2023-01-31';  // Example date

$results = DB::table('orders as o1')
    ->join(function ($join) {
        $join->select(DB::raw('DATE_FORMAT(q1.created_at ,\'%Y-%m-%d\') as created_at'))
             ->from(function ($query) {
                 // Step 1: Create the subquery (Derived Table)
                 $query->select(
                            DB::raw('driver_id'),
                            DB::raw('created_at'),
                            DB::raw('COUNT(driver_id) AS total_delieveries')
                        )
                        ->from('orders')
                        ->where('is_paid', 0)
                        ->where('order_status', 5)
                        ->whereBetween('created_at', [$first_Day, $last_Day])
                        ->groupBy(DB::raw('DATE_FORMAT(created_at ,\'%Y-%m-%d\'), driver_id)); // Grouping complexly here

                 // Step 2: Join the results back to orders (o2)
                 $query->join('orders as o2', 'q1.driver_id', '=', 'o2.driver_id')
                      ->groupBy('q1.created_at');
             });
    }, 'q1.driver_id', '=', 'o1.driver_id')
    ->select(
        'o1.driver_id',
        'o1.total_delieveries',
        DB::raw('o1.created_at') // Note: Date formatting might need to be applied at the end if possible
    )
    ->groupBy('o1.created_at');

// Process results
$responseData = $results->get();
```

**Why this is better:**

1.  **Readability:** By using nested `join` clauses, we define the logic step-by-step, making it much easier for another developer (or future you) to understand the flow of data transformation than a long string in `DB::raw()`.
2.  **Maintainability:** If you need to change how the subquery is filtered or aggregated, you only modify the specific block where the subquery is defined, rather than rewriting a monolithic SQL string.
3.  **Laravel Philosophy:** This approach keeps the heavy lifting on the database while using Eloquent’s fluent interface to orchestrate the query construction. As we explore more advanced database interactions in Laravel, understanding these structured methods becomes key, especially when dealing with complex reporting features provided by frameworks like those found at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

When tackling advanced SQL concepts like subqueries and derived tables within Laravel, the choice between raw expressions and the Query Builder is a trade-off between absolute control and application maintainability. For simple queries, Eloquent shines. For complex reporting involving nested logic and aggregations, use the Query Builder's powerful `join` nesting capabilities to structure your query logically. Always prioritize code clarity; it ensures that your application remains robust and easy to evolve.
