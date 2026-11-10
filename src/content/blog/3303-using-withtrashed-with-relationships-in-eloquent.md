---
title: "Using withTrashed with relationships in Eloquent"
description: "Using withTrashed() with Relationships in Eloquent: Navigating Soft Deletes As developers working with relational databases, especially those utilizing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers working with relational databases, especially those utilizing soft deletion strategies, managing relationships can introduce subtle but frustrating errors. One common roadblock arises when trying to access related models after a parent model has been soft-deleted. This post dives into the specific challenge of using Eloquent's `withTrashed()` functionality across relationships and provides the robust solutions you need to navigate this complexity cleanly.

## The Soft Deletion Dilemma in Eloquent Relationships

You've encountered a classic scenario: you have a `Mark` model that belongs to a `User` model. Both models use soft deletion (e.g., via the `SoftDeletes` trait). When you attempt to retrieve a soft-deleted `Mark`, accessing its relationship, like `$mark->user`, often fails or returns an unexpected result if the relationship itself is not explicitly configured to handle deleted parents gracefully.

The error you described—`Trying to get property of non-object` when trying to access `$mark->user`—occurs because Eloquent attempts to load the related `User` object, but if the retrieval mechanism isn't aware that it should fetch soft-deleted records, the resulting accessor might encounter an issue, especially in complex query scenarios involving nested relationships.

The proposed solution of chaining `$mark->withTrashed()->user` is intuitive, but it misunderstands where the `withTrashed()` scope needs to be applied. It’s crucial to understand that `withTrashed()` is primarily a **query modifier** used when fetching records from the database, not an intrinsic method on the relationship itself.

## The Correct Approach: Eager Loading with `with()` and `withTrashed()`

The key to successfully retrieving soft-deleted parent models along with their related children lies in correctly applying the `withTrashed()` scope during the initial eager loading process. You don't modify the relationship definition; you modify *how* Eloquent queries for that data.

To fetch a soft-deleted `Mark` and ensure its associated (potentially soft-deleted) `User` is also accessible, you must apply the scope to the relationship call within your primary query.

### Example Implementation

Let's assume the following model structure:

```php
// app/Models/User.php
use Illuminate\Database\Eloquent\SoftDeletes;
class User extends Model
{
    use SoftDeletes;
}

// app/Models/Mark.php
use Illuminate\Database\Eloquent\SoftDeletes;
class Mark extends Model
{
    use SoftDeletes;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

If you are querying for a specific `Mark` model:

**The Problematic Way (Direct Access):**
```php
$mark = Mark::withTrashed()->find(1); 
// If the relationship is complex or involves nested constraints, direct access can fail.
// $mark->user // Might throw an error if Eloquent context isn't fully aware of the scope.
```

**The Solution: Eager Loading with `with()`:**
To ensure you load the related user even if that user is soft-deleted, use `with()` combined with `withTrashed()` on the relationship definition within your query:

```php
$mark = Mark::with(['user' => function ($query) {
    // Apply withTrashed() directly to the relationship query context
    $query->withTrashed(); 
}])->find(1);

if ($mark) {
    // Now accessing the relationship is safe, regardless of the User's deleted status
    echo $mark->user->name; 
}
```

By wrapping the relationship call within a closure passed to `with()`, you are instructing Eloquent to construct a custom query for that specific relationship. Applying `withTrashed()` inside this scope ensures that when Eloquent fetches the related `User` record, it ignores the default soft-delete constraint and retrieves the record regardless of its deleted status. This pattern is powerful for managing complex data retrieval in Laravel.

## Best Practices for Soft Deletes Management

While the method above solves the immediate problem, consider these best practices:

1.  **Global Scopes:** For applications where soft deletion is pervasive, defining global scopes on your models (like `->withTrashed()`) can simplify queries across the entire application. This ensures that every query automatically handles deleted records unless explicitly told otherwise.
2.  **Relationship Logic:** If you find yourself frequently needing to retrieve soft-deleted parents alongside their children, review whether a different data structure or querying strategy might be more efficient than relying solely on relationship chaining.

Eloquent provides powerful tools for managing database interactions, and mastering how scopes interact with relationships is fundamental to writing clean, resilient Laravel code. For further deep dives into Eloquent functionalities, always refer back to the official documentation at [https://laravelcompany.com](https://laravelcompany.com).
