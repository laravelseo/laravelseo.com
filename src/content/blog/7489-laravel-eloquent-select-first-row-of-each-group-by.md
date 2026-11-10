---
title: "Laravel eloquent select first row of each group by"
description: "Mastering Group Selection in Laravel Eloquent: Selecting the First Row Per Group As developers working with relational databases through an ORM like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with relational databases through an ORM like Eloquent, we frequently encounter scenarios where we need to perform complex grouping operations. One common challenge is not just aggregating data (like `groupBy` and `sum`), but selecting a specific representative row—the "first" or "best" record—from each resulting group.

This post dives into a practical scenario using your provided structure: selecting one uncompleted tutorial for every subject. We will explore why the standard Eloquent grouping method falls short and introduce more robust, performant SQL techniques to achieve the desired result efficiently.

## The Challenge: Selecting One Row Per Group

You have two tables: `subjects` and `tutorials`. Your goal is to find exactly one uncompleted tutorial for each subject.

**Your Current Attempt:**
```php
$query->where('completed', false)->groupBy('subj_id')->get();
```
As you observed, this query successfully groups the results by `subj_id`, but it essentially returns the grouped IDs. It doesn't select the actual tutorial records; it just tells the database which subjects have uncompleted tutorials, leading to an incomplete result set.

**Desired Outcome:** Select the specific rows corresponding to `tutorial.id` 2 (for subject 1) and `tutorial.id` 6 (for subject 2).

## Why Simple Grouping Fails

The issue with using only `groupBy()` in Eloquent is that it aggregates the data based on the keys provided, discarding the individual columns you wish to retrieve. When you use `groupBy()`, you are telling the database to collapse multiple rows into a single summary row. To retrieve the actual data from those collapsed groups, you must use an aggregation function (like `MIN()`, `MAX()`, or `SUM()`) or a more complex technique that explicitly selects one record per group.

## Solution 1: The Relational Approach using Subqueries and Joins

A straightforward way to solve this without advanced window functions is to first identify the minimum `tutorial.id` for each distinct `subj_id` where `completed` is false, and then join back to retrieve the full record.

This approach relies on finding a specific ID within the group, which requires an extra step. While perfectly valid, it can sometimes be less performant than direct window functions on large datasets.

```php
use App\Models\Tutorial;

$results = Tutorial::where('completed', false)
    ->select('tutorials.*')
    ->join('subjects', 'tutorials.subj_id', '=', 'subjects.id')
    // Subquery to find the minimum tutorial ID for each subject group
    ->whereIn('tutorials.id', function ($query) {
        $query->select(DB::raw('MIN(tutorials.id)'))
              ->from('tutorials')
              ->where('completed', false)
              ->groupBy('subj_id');
    })
    ->get();
```

This method forces the database to perform two operations: first, determine which `subj_id` groups have an uncompleted tutorial (the `whereIn` subquery), and second, retrieve the actual rows matching those criteria. For complex selections like this, leveraging raw SQL or window functions often provides a cleaner solution.

## Solution 2: The Efficient Approach using Window Functions (Recommended)

For selecting "the first row" per group, the most idiomatic and efficient SQL technique is using **Window Functions**, specifically `ROW_NUMBER()`. This function assigns a sequential integer rank to each row within a partition of a result set. We can use this to explicitly select only the row ranked number 1 for each subject ID.

This method is highly recommended when dealing with larger datasets, as it avoids multiple complex joins and subqueries by performing the selection in a single pass over the data.

Here is how you would structure the query using raw SQL within Eloquent:

```php
use Illuminate\Support\Facades\DB;

$results = DB::table('tutorials')
    ->select('*')
    ->where('completed', false)
    // Assign a row number partitioned by subject_id, ordered by tutorial id
    ->selectRaw('*, ROW_NUMBER() OVER (PARTITION BY subj_id ORDER BY id ASC) as rn')
    ->where('rn', 1) // Select only the first row for each group
    ->get();
```

**Explanation of the Window Function:**
*   `ROW_NUMBER() OVER (...)`: This is the window function.
*   `PARTITION BY subj_id`: This tells the database to restart the numbering whenever the `subj_id` changes (i.e., for each unique subject).
*   `ORDER BY id ASC`: This determines which row gets assigned the number 1. By ordering by `id`, we ensure that for any given subject, we select the tutorial with the lowest ID (which corresponds to your desired "first" record in this context).

This approach directly translates your requirement into highly optimized SQL. When building robust database interactions within Laravel, understanding these advanced SQL features is key to writing efficient code, aligning perfectly with the principles of development promoted by teams at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

While Eloquent provides a beautiful layer over SQL, complex selection logic like "select the first row per group" often requires dropping down to raw SQL or utilizing advanced features like Window Functions. By understanding how these functions operate, you can move beyond simple grouping and write powerful, highly performant queries that solve real-world data challenges efficiently.
