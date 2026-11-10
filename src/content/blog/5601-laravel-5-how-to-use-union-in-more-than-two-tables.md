---
title: "Laravel 5 - How to use union in more than two tables/queries with Query Builder or Eloquent?"
description: "Mastering Multi Table Unions in Laravel: Combining Data from Ten Tables As a senior developer working with Laravel and the Eloquent ORM or Query Builder, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Errors"]
featured: false
---

As a senior developer working with Laravel and the Eloquent ORM or Query Builder, we often deal with complex data aggregation tasks. One common requirement is combining results from multiple tables that share a similar structure—a classic use case for SQL's `UNION` operator. While the official documentation provides excellent examples for two tables, handling a union across ten or more tables requires a more programmatic approach.

This post will dive into how to execute a complex multi-table `UNION` query using Laravel’s Query Builder and Eloquent, providing practical methods for combining data from numerous sources efficiently.

## The Challenge of Multi-Table Unions

The standard Laravel documentation often focuses on the basic syntax of unions. When you need to combine results from $N$ tables (in your case, ten tables named `sell_2007` through `sell_2016`), simply chaining them with a basic method becomes cumbersome and error-prone within the standard Eloquent syntax.

The core challenge is that the Query Builder or Eloquent methods are designed to operate on a single model or query at a time. To achieve a union across ten tables, we must construct the entire SQL statement manually, assembling the necessary `SELECT` statements with the `UNION ALL` operator between them.

## Method 1: Constructing the Union via Raw SQL (The Most Direct Approach)

For complex unions involving many tables, leveraging the Query Builder's ability to execute raw SQL is often the cleanest and most performant path. This method gives us full control over the structure of the final query.

We need to dynamically build a string containing all the individual `SELECT` statements and then wrap them in the final `UNION ALL`.

Imagine we want to select `id`, `sale_date`, and `amount` from all ten tables:

```sql
(SELECT id, sale_date, amount FROM sell_2007)
UNION ALL
(SELECT id, sale_date, amount FROM sell_2008)
UNION ALL
-- ... up to sell_2016
(SELECT id, sale_date, amount FROM sell_2016);
```

In Laravel, we can construct this string dynamically using a loop over our table names.

### Implementation Example

Here is how you would achieve this dynamic construction:

```php
use Illuminate\Support\Facades\DB;

class DataAggregator
{
    public function getCombinedSales()
    {
        $tables = [
            'sell_2007', 'sell_2008', 'sell_2009', 'sell_2010', 
            'sell_2011', 'sell_2012', 'sell_2013', 'sell_2014', 
            'sell_2015', 'sell_2016'
        ];

        $selectClauses = [];

        foreach ($tables as $table) {
            // Construct the SELECT statement for each table
            $selectClause = DB::table($table)->select('id', 'sale_date', 'amount');
            $selectClauses[] = $selectClause;
        }

        // Join all clauses with UNION ALL
        $unionString = implode(' UNION ALL ', $selectClauses);

        // Execute the final raw query
        $results = DB::select("($unionString)"); 

        return $results;
    }
}
```

This approach leverages the Query Builder's ability to select data from individual tables and then stitches them together using standard SQL operators. This is highly efficient because the heavy lifting of the union operation is handled directly by the database engine, which is optimized for these operations.

## Performance and Best Practices

When dealing with unions across many tables, performance is paramount.

1.  **Use `UNION ALL`:** Always prefer `UNION ALL` over `UNION`. `UNION` requires the database to perform an expensive distinct sort operation to remove duplicate rows, whereas `UNION ALL` simply appends all results, which is significantly faster if you are certain there are no duplicates or if you don't need de-duplication at this stage.
2.  **Indexing:** Ensure that the columns used in the `SELECT` statements (especially those used for joining or ordering) are properly indexed on all ten underlying tables. This will drastically reduce execution time, regardless of how complex your query structure is.
3.  **Eloquent vs. Query Builder:** For large-scale aggregation queries like this, sticking to the **Query Builder** when dealing with raw SQL constructs like `UNION` provides better control and performance than trying to force Eloquent relationships into this specific multi-table structure.

## Conclusion

Combining data from ten tables using `UNION` in Laravel is achievable by stepping outside the typical Eloquent abstraction and utilizing the power of raw SQL construction via the Query Builder. By dynamically building the necessary `SELECT` statements and concatenating them with `UNION ALL`, you can efficiently aggregate massive datasets. Remember, for complex database interactions, understanding how to bridge your application logic with optimized SQL is key to mastering Laravel development, as emphasized in guides like those found on https://laravelcompany.com.
