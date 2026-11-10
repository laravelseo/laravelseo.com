---
title: "How to calculate the percentage in eloquent?"
description: "Calculating Percentages in Eloquent: A Database First Approach As a senior developer, I often encounter scenarios where seemingly simple calculations bog..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As a senior developer, I often encounter scenarios where seemingly simple calculations bog down the application logic. The problem you've described—calculating conditional percentages from relational data—is a classic example where pushing the computation to the database layer (SQL) offers significantly better performance and scalability than iterating over large result sets in PHP.

While your current solution using a PHP loop works, it scales poorly. For large tables, fetching every row and processing it in application memory is inefficient. The superior approach is to leverage MySQL's powerful aggregation functions directly within the query. This allows the database engine, which is optimized for set-based operations, to perform the heavy lifting before sending the final, calculated result back to your Laravel application.

This post will demonstrate how to solve this specific percentage calculation efficiently using raw SQL expressions combined with Eloquent, ensuring you write cleaner, faster code, a principle central to building robust applications with frameworks like Laravel.

---

## The Inefficient Way vs. The Efficient Way

You correctly identified the bottleneck:
1. Fetch all rows from the `member` table.
2. Loop through them in PHP.
3. Manually tally the counts for 'W' and 'L'.
4. Perform the percentage calculation in PHP.

This approach forces unnecessary data transfer and processing on the application server. The ideal solution is to calculate the numerator (count of 'W') and the denominator (count of 'W' + 'L') directly in MySQL.

## Solution: Conditional Aggregation in SQL

To solve this, we use conditional aggregation, specifically `SUM()` combined with a `CASE` expression within the `SELECT` statement. This allows us to count specific conditions across groups without needing multiple subqueries or complex joins for simple counts.

Let's assume your table structure is:
| id | result |
|----|--------|
| 1  | W      |
| 2  | W      |
| 3  | W      |
| 4  | L      |
| 5  | V      |

We want to calculate: $\frac{\text{Count of 'W'}}{\text{Count of 'W'} + \text{Count of 'L'}} \times 100$.

### Step 1: Writing the Optimized MySQL Query

Instead of fetching all rows, we can aggregate everything in a single query. We will use conditional summing to count only the relevant values ('W' and 'L').

```sql
SELECT
    SUM(CASE WHEN result = 'W' THEN 1 ELSE 0 END) AS count_w,
    SUM(CASE WHEN result = 'L' THEN 1 ELSE 0 END) AS count_l
FROM
    member;
```

If you needed the final percentage directly from the database:

```sql
SELECT
    SUM(CASE WHEN result = 'W' THEN 1 ELSE 0 END) * 100.0 / 
    (SUM(CASE WHEN result IN ('W', 'L') THEN 1 ELSE 0 END)) AS percentage_w
FROM
    member;
```

This query calculates the total count of 'W' and the combined total of 'W' and 'L' in one go. This is significantly faster than retrieving all data and processing it separately.

## Step 2: Implementing with Eloquent

While raw SQL is powerful, integrating it cleanly into an Eloquent context is key. We can use the `DB` facade to execute this query and retrieve a single result object, rather than fetching many model instances. This aligns perfectly with best practices for optimizing database interactions in Laravel.

```php
use Illuminate\Support\Facades\DB;

class Member
{
    // ... model properties
}

class ReportService
{
    public function calculatePercentage()
    {
        $results = DB::table('member')->selectRaw(
            // Calculate the numerator: Count of 'W'
            DB::raw("SUM(CASE WHEN result = 'W' THEN 1 ELSE 0 END) * 100.0") . ' AS percentage_w',

            // Calculate the denominator: Count of ('W' or 'L')
            DB::raw("SUM(CASE WHEN result IN ('W', 'L') THEN 1 ELSE 0 END) AS total_w_l")
        )->first(); // Use first() since we only expect one aggregated row

        if ($results) {
            $percentage = (float)$results->percentage_w;
            // Note: The denominator calculation would require a second query or more complex raw SQL if you want the final ratio easily.
            // For simplicity here, let's assume we calculate the denominator separately or use a slightly simpler aggregation focusing only on 'W'.

            // A cleaner way for this specific problem is often to fetch the counts first:
            $counts = DB::table('member')
                ->select(
                    DB::raw("SUM(CASE WHEN result = 'W' THEN 1 ELSE 0 END) as w_count"),
                    DB::raw("SUM(CASE WHEN result = 'L' THEN 1 ELSE 0 END) as l_count")
                )->first();

            if ($counts) {
                $total = $counts->w_count + $counts->l_count;
                if ($total > 0) {
                    $percentageW = ($counts->w_count / $total) * 100;
                    return $percentageW;
                }
            }
        }
    }
}
```

## Conclusion

By shifting the calculation logic from PHP to MySQL using conditional aggregation, we achieve a substantial performance gain. This technique is fundamental for building high-performance applications. When working with data in Laravel, remember that Eloquent is an elegant ORM, but it should always be paired with optimized database queries. As you build complex features, focusing on efficient SQL and leveraging the power of your underlying database—much like ensuring proper data handling in frameworks like [Laravel](https://laravelcompany.com)—will lead to cleaner, faster, and more scalable code.
