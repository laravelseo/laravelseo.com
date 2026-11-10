---
title: "Laravel Eloquent - get last insert of related model"
description: "Laravel Eloquent: Getting the Last Inserted Related Model Efficiently As developers working with relational databases in Laravel, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

As developers working with relational databases in Laravel, one of the most common operations we perform is retrieving a specific record based on its parent—for example, finding the most recent rent associated with a particular terminal. When dealing with one-to-many relationships, simply using standard eager loading (`with()`) followed by filtering can often lead to inefficient database queries or complex logic.

This post will dive into how to correctly and efficiently retrieve the *last inserted* related model in an Eloquent relationship, focusing on performance and best practices.

## The Scenario: Terminal and TerminalRent

Let’s set up our scenario. We have two models: `Terminal` and `terminalRent`. A `Terminal` can have many `terminalRent` records. Our goal is to find the single most recent rent record for a specific terminal ID.

The database structure looks like this:

```sql
Terminal
----
ID (Primary Key)

terminalRent
-----
ID (Primary Key)
terminal_id (Foreign Key referencing Terminal.ID)
-- other columns...
```

We need to find the `terminalRent` record with the highest (or latest) insertion time that belongs to a specific `Terminal`.

## Why Simple Eager Loading Fails for "Last Insert"

A common, but often inefficient, approach might look like this:

```php
// Inefficient approach example
$terminal = Terminal::with('terminalRent')->find($id);

// Attempting to find the latest rent afterward requires manual PHP sorting, 
// which forces Laravel to load all related records first.
$latestRent = $terminal->terminalRent->sortByDesc('created_at')->first();
```

While this works, it loads potentially thousands of rental records into memory only to sort them in PHP, which is a significant performance bottleneck, especially with large datasets. We need a solution that pushes the sorting logic down to the database level.

## The Optimized Solution: Querying the Relationship Directly

The most efficient way to solve this is to bypass loading all related data via `with()` and instead query the relationship table directly, applying constraints and ordering within the database query itself. This leverages the power of SQL for speed.

We can achieve this by querying the `terminalRent` model, filtering by the parent `terminal_id`, ordering by the creation timestamp in descending order, and then limiting the result to just one record.

Here is how you implement this optimized logic:

```php
use App\Models\Terminal;
use App\Models\terminalRent;

class TerminalService
{
    public function getLastTerminalRent(int $terminalId): ?terminalRent
    {
        // Find the most recent terminalRent record for a specific terminal.
        $latestRent = terminalRent::where('terminal_id', $terminalId)
                                 ->orderBy('created_at', 'desc')
                                 ->first();

        return $latestRent;
    }
}
```

### Explanation of the Code

1.  **`terminalRent::where('terminal_id', $terminalId)`**: This efficiently filters the `terminalRent` table to only include records linked to the specific terminal we are interested in.
2.  **`orderBy('created_at', 'desc')`**: This is the critical step. By ordering by the timestamp (`created_at`) in descending order, we ensure that the most recently inserted record appears at the very top of the result set.
3.  **`first()`**: This limits the query to return only the first (i.e., the latest) matching record.

This approach results in a single, highly optimized SQL query executed by the database, avoiding unnecessary object hydration and sorting within PHP memory. For more complex scenarios involving nested relationships, exploring Laravel’s powerful querying features, such as using `whereHas` combined with subqueries or advanced scope definitions, can provide even greater abstraction, aligning perfectly with the principles taught by **Laravel Company** regarding robust data handling.

## Conclusion

When performing operations like finding the "last inserted" record in a relationship, always prioritize pushing the logic to the database layer. Avoid loading large datasets into PHP memory only to sort them afterward. By utilizing direct queries on the related model, ordering by the appropriate timestamp column, and using methods like `first()`, you ensure your Laravel applications remain fast, scalable, and adhere to modern performance standards. Mastering these techniques is fundamental for building high-performance applications with Eloquent.
