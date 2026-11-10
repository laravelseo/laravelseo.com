---
title: "orderBy case insensitive with Laravel"
description: "Achieving Case Insensitive Ordering in Laravel Eloquent with PostgreSQL As a senior developer working with Laravel and relational databases like PostgreSQL,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel and relational databases like PostgreSQL, you frequently encounter scenarios where standard sorting functions fall short. The issue you've described—where ordering by a string column is case-sensitive—is a very common hurdle. When you use `orderBy('name')`, the database performs a lexicographical sort based strictly on ASCII/collation order, meaning uppercase letters generally precede lowercase letters (e.g., 'A' before 'a').

This post will detail the correct and most efficient way to achieve case-insensitive ordering within Eloquent by leveraging PostgreSQL's powerful string manipulation functions directly through the Query Builder.

## The Case-Sensitivity Problem Explained

When you execute this query:

```php
$users = \App\User::orderBy('name')->get();
```

The database sorts based on the exact byte values of the 'name' column. This results in an order dictated by case sensitivity, which is why 'Adam' might appear before 'alix', leading to the unexpected sequence you observed: Adam, Alix, Beatrice, etc.

To fix this, we cannot rely solely on Eloquent's simple `orderBy` method; we need to instruct the database to perform a comparison on a transformed version of the data—specifically, its lowercase or uppercase equivalent.

## The Solution: Using `DB::raw()` for Case-Insensitive Sorting

The most robust way to handle this in Laravel is by injecting raw SQL expressions into the `orderBy` clause using the `DB::raw()` method. PostgreSQL provides excellent functions like `LOWER()` which allows us to convert the column value to a consistent case before sorting, ensuring all comparisons are based on lowercase letters.

### Implementing the Case-Insensitive Order

To sort by the `name` column in a case-insensitive manner, we instruct the database to order based on the result of applying the `LOWER()` function to that column:

```php
use Illuminate\Support\Facades\DB;

// Get users ordered by the lowercase version of the 'name' field
$users = \App\User::orderBy(DB::raw('LOWER(name)'))->get();
```

### Code Demonstration

Let’s see how this transformation works with your sample data:

**Original Case-Sensitive Order:**
If you ran `orderBy('name')`, the order might look like:
`Adam, Alix, Beatrice, bill, Zorro` (Incorrect alphabetical sort)

**Case-Insensitive Order using `LOWER()`:**
When we use `DB::raw('LOWER(name)')`, the database effectively sorts based on:
*   'adam'
*   'alix'
*   'beatrice'
*   'bill'
*   'zorro'

This results in the desired, correctly alphabetical order:
`adam, Alix, Beatrice, bill, Zorro` (Correct alphabetical sort)

## Best Practices and Eloquent Context

While using `DB::raw()` directly solves the ordering problem perfectly, it’s important to understand where this logic lives. In a larger application structure, you might consider abstracting this sorting logic into an Eloquent Scope or a Mutator if you need this behavior consistently across your application without repeating the raw expression everywhere.

For instance, defining a scope makes the intent clearer:

```php
// In your User model
public function scopeCaseInsensitiveByName($query)
{
    $query->orderBy(DB::raw('LOWER(name)'));
}
```

Then, you can use it cleanly:

```php
$users = \App\User::caseInsensitiveByName()->get();
```

This approach keeps your models clean and leverages the power of Laravel's query builder while ensuring that the underlying database operations are optimally handled. This focus on leveraging database functions is a core principle in building high-performance applications, much like the philosophy behind robust frameworks like [Laravel](https://laravelcompany.com).

## Conclusion

To solve the case-insensitive ordering challenge in Laravel Eloquent against PostgreSQL, avoid relying solely on simple string comparisons in `orderBy()`. Instead, embrace the power of raw SQL expressions via `DB::raw()` to utilize PostgreSQL's built-in functions like `LOWER()`. This technique provides a clean, efficient, and database-native way to ensure your data is sorted exactly how you expect it to be, resulting in accurate and predictable results every time.
