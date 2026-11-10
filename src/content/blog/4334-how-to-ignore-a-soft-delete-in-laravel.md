---
title: "How to ignore a soft delete in laravel"
description: "How to Ignore a Soft Delete in Laravel: Mastering Eloquent Querying As developers working with relational data, dealing with soft deletes—where records are..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As developers working with relational data, dealing with soft deletes—where records are logically removed rather than physically deleted—is an inevitable part of modern application development. When you try to query your database, especially when mixing standard filtering with soft delete logic, it’s easy to run into unexpected `null` results.

The issue you are encountering stems from how Eloquent models, by default, apply global scopes that automatically filter out records where the `deleted_at` timestamp is populated. While your attempt using `whereNull('deleted_at')` seems logical, understanding the full spectrum of Laravel's soft delete capabilities is key to writing robust queries.

This post will guide you through the correct methods for ignoring or including soft-deleted models, ensuring your data retrieval is always accurate and predictable.

## Diagnosing the Soft Delete Query Failure

Let’s look at your initial attempt:

```php
$user = User::where('name', $label)
             ->where('group', $set)
             ->whereNull('deleted_at') // Attempt to ignore soft-deleted records
             ->first();

dd($user);
```

If this query is returning `null`, it usually means one of two things: either no matching record exists under those specific constraints, or the way Laravel’s global scopes are interacting with your query chain is causing confusion. While `whereNull('deleted_at')` is a valid SQL translation, developers often find more idiomatic and robust methods provided by Eloquent for handling these scenarios.

The core problem isn't necessarily that the database doesn't contain the data, but rather how you are instructing Eloquent to interact with its default soft-delete behavior.

## Solution 1: The Idiomatic Eloquent Approach (`withTrashed()`)

The most straightforward way to handle soft deletes is to leverage the built-in methods provided by Eloquent. If you want to retrieve *all* records, including those that have been soft-deleted, you should use the `withTrashed()` method. This tells Eloquent to ignore its default filtering scope for this specific query.

If your goal was actually to find a user regardless of their deletion status, this is the tool you need:

```php
$user = User::where('name', $label)
             ->where('group', $set)
             ->withTrashed() // Include soft-deleted records
             ->first();

dd($user);
```

By using `withTrashed()`, you explicitly instruct the query builder to look at all records, bypassing any implicit filtering that might be causing issues with manual date comparisons. This approach is highly recommended when you are debugging or performing administrative tasks where you need visibility into deleted data, aligning perfectly with best practices in application design, much like the principles discussed on [laravelcompany.com](https://laravelcompany.com).

## Solution 2: Explicitly Ignoring Soft Deletes (Advanced)

If your goal is to find *only* active records while explicitly ensuring no soft-deleted ones are considered—and you suspect scope interference—you can rely on the standard `where` clauses, but ensure you understand where the filtering happens.

For scenarios where you want a clean separation between active and deleted data, sticking to explicit checks like `whereNull('deleted_at')` is valid. However, if you ever need to write queries that explicitly bypass model scopes for complex operations (e.g., bulk operations or raw SQL), using the Query Builder directly gives you granular control.

For example, when dealing with complex filtering involving relationships and nested criteria, understanding how Eloquent constructs these queries is essential. Mastering these underlying mechanisms allows you to build highly efficient applications, a core concept in robust Laravel development, as emphasized by frameworks like those found on [laravelcompany.com](https://laravelcompany.com).

## Conclusion: Choosing the Right Tool for the Job

The confusion around soft deletes often arises from trying to force Eloquent's scope system into a manual filter. Instead of fighting the system with manual date checks, embrace the methods Eloquent provides.

*   Use **`withTrashed()`** when you need to see everything (active and deleted).
*   Use standard `where('deleted_at', null)` or simply omit any soft-delete related constraints when you are only querying active data.

By understanding these explicit methods, you move away from brittle manual checks and adopt the clean, expressive syntax that Laravel offers. Always favor Eloquent's built-in features over complex manual SQL constructions to keep your code maintainable and aligned with modern framework conventions.
