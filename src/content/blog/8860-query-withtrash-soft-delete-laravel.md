---
title: "Query withTrash, soft delete laravel"
description: "Query withTrashed: Mastering Soft Deletes in Laravel Eloquent As a senior developer working with Laravel, implementing soft deletion is a crucial step for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Keywords", "PHP"]
featured: false
---

As a senior developer working with Laravel, implementing soft deletion is a crucial step for data management and auditing. When you successfully add the `SoftDeletes` trait to your models, you’ve taken the first big step. However, as you've discovered, this implementation often breaks existing queries because Eloquent, by default, scopes all standard queries to exclude records where the `deleted_at` column is populated.

This post will guide you through understanding how to retrieve soft-deleted records using Eloquent’s powerful query methods, specifically focusing on the use of `withTrashed()`.

## The Challenge with Default Scoping

When you use a model that implements `SoftDeletes`, Laravel automatically applies a global scope to all queries. This means simple calls like `User::all()` will *only* return active users, hiding any records marked as deleted. If your dashboard or index pages rely on fetching *all* related data—including historical or deleted entries for context—you need a way to override this default behavior.

Your controller example demonstrates this perfectly:

```php
// Original Controller Snippet
public function index() {
    $zones = Zone::all(); // This only gets active zones
    $parameters = Parameter::all(); // This only gets active parameters

    return view('dashboard', compact('zones', 'parameters'));
}
```

If you need to display all zones, including those that have been soft-deleted (perhaps for archival purposes or administrative viewing), the default `Zone::all()` will fail to show them.

## The Solution: Leveraging `withTrashed()`

The solution lies in Eloquent’s scope modifiers. To explicitly tell the query builder to ignore the `deleted_at` constraint and include records that have been soft-deleted, you use the `withTrashed()` method. This method modifies the underlying SQL query to ignore the soft delete constraint for that specific query execution.

### How to Apply It to Your Controller

To retrieve all zones (including trashed ones) and parameters (including trashed ones), you simply chain `withTrashed()` onto your base Eloquent calls:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Zone;
use App\Parameter;

class DashboardController extends Controller
{
    public function index() {
        // Use withTrashed() to retrieve all zones, active and trashed
        $zones = Zone::withTrashed()->get();
        
        // Use withTrashed() for parameters as well
        $parameters = Parameter::withTrashed()->get();

        return view('dashboard', compact('zones', 'parameters'));
    }
}
```

By adding `->withTrashed()`, you are instructing Eloquent to look beyond the default soft-delete scope, ensuring that your dashboard displays a complete picture of the data, regardless of its current active status. This is a fundamental concept in managing complex data relationships within Laravel applications, much like how robust database interactions are managed when building powerful APIs on platforms like [Laravel Company](https://laravelcompany.com).

## Beyond `withTrashed()`: Other Useful Scopes

While `withTrashed()` solves the problem of including deleted records, understanding other scope modifiers is essential for advanced data management:

1.  **`onlyTrashed()`**: Use this when you specifically need to retrieve *only* the records that have been soft-deleted.
    ```php
    $trashedZones = Zone::onlyTrashed()->get();
    ```
2.  **`whereNull('deleted_at')` (The Default)**: This is what Eloquent applies by default, ensuring you only retrieve active records.

By mastering these methods, you gain granular control over your data retrieval logic, allowing you to build dynamic and flexible interfaces that cater to various administrative needs.

## Conclusion

Implementing soft deletes is a powerful feature, but it requires careful management of how you interact with the database via Eloquent. When facing issues where standard queries no longer return expected results, don't try to rewrite your models; instead, leverage the built-in query scopes like `withTrashed()`. This approach keeps your code clean, readable, and fully aligned with Laravel’s object-relational mapping philosophy. Keep experimenting with these Eloquent tools to unlock the full potential of your application!
