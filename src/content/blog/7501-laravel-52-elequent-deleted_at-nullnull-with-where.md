---
title: "Laravel 5.2 : Elequent deleted_at Null/!Null with where clause and count"
description: "Mastering Soft Deletes in Eloquent: The Correct Way to Count Records As developers working with Laravel and Eloquent, managing data states—especially soft..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with Laravel and Eloquent, managing data states—especially soft deletes—is a common requirement. When you introduce soft deletes (using a `deleted_at` timestamp column), querying the database becomes slightly more nuanced. A common point of confusion arises when trying to use standard equality operators (`=`) to check for the presence or absence of `NULL` values in these timestamp fields, particularly when combining them with aggregate functions like `COUNT()`.

This post will dissect a specific issue you encountered with counting records based on the status of the `deleted_at` column and show you the idiomatic, robust way to handle these conditions in Eloquent.

## The Pitfall: Why Direct Comparison Fails

You are attempting to distinguish between records that have been soft-deleted (`deleted_at` is not null) and those that have not (`deleted_at` is `NULL`).

Let's look at the code snippet you provided:

```php
$completed = Task::where('user_id', Auth::user()->id)->where('deleted_at', '=', !Null)->get()->count();
$incompleted = Task::where('user_id', Auth::user()->id)->where('deleted_at', '=', Null)->get()->count();
```

While this looks logically sound, the issue lies in how SQL handles comparisons with `NULL`. In standard SQL, comparing a value directly to `NULL` (e.g., `'deleted_at' = NULL`) always evaluates to **unknown**, not true or false. This is why your query for `$incompleted` returned 0 instead of the expected count of 1.

The fundamental error here is treating `NULL` as a regular value in a strict equality check. To correctly ask "Is this column null?" or "Is this column not null?", you must use specific SQL comparison operators designed for this purpose.

## The Solution: Using Eloquent's Null Helpers

Eloquent provides dedicated, highly readable methods specifically designed to handle these NULL comparisons safely and efficiently. Instead of relying on raw equality checks, we should leverage the built-in query scopes provided by the framework. This approach makes your code less prone to SQL errors and much clearer to maintain, which aligns perfectly with the principles of clean, expressive code promoted by resources like those found at [laravelcompany.com](https://laravelcompany.com).

To correctly count records based on whether `deleted_at` is present or absent, use `whereNull()` and `whereNotNull()`:

### Correct Implementation Example

Here is how you should rewrite your logic to accurately fetch the counts for completed and incomplete tasks belonging to the authenticated user:

```php
use Illuminate\Support\Facades\Auth;
use App\Models\Task; // Assuming Task model is used

$userId = Auth::id();

// Count records that are NOT soft-deleted (i.e., deleted_at IS NULL)
$incompletedCount = Task::where('user_id', $userId)
                      ->whereNull('deleted_at') // Correct way to check for NULL
                      ->count();

// Count records that ARE soft-deleted (i.e., deleted_at IS NOT NULL)
$completedCount = Task::where('user_id', $userId)
                     ->whereNotNull('deleted_at') // Correct way to check for NOT NULL
                     ->count();

// Alternatively, if you only want to count active tasks:
$activeTasks = Task::where('user_id', $userId)->whereNull('deleted_at')->get();
```

### Why This Works Better

1.  **Clarity:** `whereNull('column_name')` explicitly tells the database engine exactly what you intend to query, removing ambiguity about operator precedence or SQL NULL semantics.
2.  **Safety:** These methods abstract away the raw SQL complexity, making your code safer and easier for other developers (and future you) to understand.
3.  **Performance:** While the performance difference is negligible in this context, using these explicit checks ensures that the database can optimize the query efficiently against indexed columns.

## Conclusion

The lesson here is a critical best practice for working with Eloquent: **avoid direct equality comparisons (`=`, `!=`) when testing for the existence or absence of `NULL` values.** Always utilize Eloquent’s specialized helper methods like `whereNull()` and `whereNotNull()`. By adopting these idioms, you write more robust, readable, and maintainable Laravel code. When building complex data interactions, relying on framework features rather than raw SQL operators is the path to writing exceptional code, much like leveraging the full power of the Laravel ecosystem.
