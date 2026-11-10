---
title: "Select where all 3 columns are not null at the same time (Laravel Query Builder)"
description: "Selecting Records Where Multiple Columns Are Not Null Simultaneously in Laravel As senior developers working with relational databases and the Laravel Query..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

As senior developers working with relational databases and the Laravel Query Builder, we frequently encounter scenarios where selecting data based on the simultaneous state of multiple columns is required. One common challenge arises when trying to ensure that *all* necessary fields are populated, or conversely, when filtering out records where a specific combination of missing data exists.

Today, we will tackle a specific and often misunderstood scenario: how to select all records from a table where three distinct columns (`col_1`, `col_2`, and `col_3`) are *not NULL at the same time*. We will also address the nuance of what happens when some columns are null versus when they are all null.

## The Pitfall of Sequential Null Checks

Let's start by examining the common, but flawed, approach many developers attempt: chaining multiple `whereNotNull()` calls.

Consider a table with three columns: `col_1`, `col_2`, and `col_3`. We want to select only those articles where *all three* columns have values.

The initial thought might lead to this implementation:

```php
Article::select('articles.*')
    ->whereNotNull('col_1')
    ->whereNotNull('col_2')
    ->whereNotNull('col_3')
    ->get();
```

While this query technically selects articles where *each individual column* is not null, it suffers from a critical logical flaw based on the requirement. If your goal is to ensure that **all three columns are populated**, this method works correctly for that specific condition.

However, the prompt introduces a more complex requirement: "I want to select (include) articles where none or one or two of `col_1`, `col_2`, and `col_3` is `NULL`, but *not if all three are NULL*." This implies we want to exclude only those records where *all three* fields are missing data.

If the actual requirement is to select records where **at least one** of the columns has a value (i.e., excluding rows where all three are NULL), the sequential `whereNotNull()` approach becomes overly restrictive and often incorrect for complex filtering logic, as demonstrated in your initial observation.

## The Correct Approach: Negating the "All Null" Condition

The most robust way to solve this kind of multi-conditional requirement is to focus on what you want to *exclude* rather than what you want to include. If we want records where it is **NOT** true that all three columns are NULL, we can use negation logic in SQL.

To select rows where at least one column is NOT NULL (which satisfies the condition of "not all being NULL"), we negate the condition that *all* are NULL:

$$\text{SELECT} \dots \text{WHERE NOT } (\text{col\_1 IS NULL AND col\_2 IS NULL AND col\_3 IS NULL})$$

In Laravel's Query Builder, this translates directly into a more powerful and efficient query. Since we are working with the underlying database structure, we can leverage raw expressions or nested `where` clauses that represent the negation.

Here is how you correctly implement the logic to select articles where **at least one** of the three columns contains data:

```php
$articles = Article::select('articles.*')
    ->where(function ($query) {
        $query->where('col_1 IS NOT NULL')
              ->orWhere('col_2 IS NOT NULL')
              ->orWhere('col_3 IS NOT NULL');
    })
    ->get();
```

### Explanation of the Correct Logic

By using a nested `where(function($query) { ... })` block combined with `orWhere()`, we instruct the database to select any row where *at least one* of the specified conditions is true. This perfectly captures the requirement: if an article has data in `col_1` only, or `col_2` only, or `col_3` only, it will be selected. The only records excluded are those where all three columns simultaneously evaluate to NULL, satisfying your final constraint.

This technique is highly flexible and mirrors standard SQL logic, making the resulting query clear and performant. When building complex queries, understanding how to construct these boolean expressions is fundamental, especially when working with ORM features like those provided by platforms like [Laravel](https://laravelcompany.com).

## Conclusion

When dealing with multi-column null checks in Laravel, avoid chaining multiple `whereNotNull()` calls if your goal is to check for the existence of data across the set. Instead, pivot your logic to express the desired outcome using logical operators (`OR` and `NOT`) within a single conditional block. This approach ensures that your database queries are logically sound, highly readable, and perform efficiently, giving you full control over which records are included in your final result set.
