---
title: "The difference between 'find' and 'get' in Eloquent"
description: "The Eloquent Dilemma: Understanding the Difference Between find() and where() for Relationships As senior developers working with Laravel and Eloquent,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As senior developers working with Laravel and Eloquent, understanding how data retrieval methods interact with model relationships is crucial. A common point of confusion arises when we try to fetch related data—specifically Eloquent relationships like `belongsToMany`—using methods designed for fetching single records versus collections.

This post will dissect the difference between using `find()` and `where()`, explain why you encounter errors when trying to access relations on a collection, and show you the proper, efficient way to load relationships in your Laravel applications.

## The Core Distinction: Model vs. Collection

The fundamental difference lies in what each method returns from the database query:

1. **`find($id)`:** This method is designed to retrieve a single Eloquent model instance based on its primary key. It returns a single object (or `null` if not found). When you call `$user->roles`, you are accessing the relationship property directly on that loaded model instance, which works because you have a singular object context.

2. **`where(...)` followed by `get()`:** This combination is designed to retrieve *multiple* Eloquent models. It returns an `Illuminate\Database\Eloquent\Collection` containing all the matching results. When you try to access a relationship property on this collection directly (e.g., `$collection->roles`), the error occurs because a Collection itself does not inherently possess that specific relationship property in the way a single model instance does. The connection mechanism for loading relationships is context-dependent; it works seamlessly on a single model but requires explicit instruction when dealing with a set of models.

## Why the Error Occurs: Context Matters

The error `Undefined property: Illuminate\Database\Eloquent\Collection::$roles` happens because the Collection object, while containing User models, doesn't automatically know how to resolve the Many-to-Many relationship context for all those users simultaneously unless explicitly told to load it. You are asking the collection, "What is my relation?", and it responds that it doesn't have a property named `roles` directly on itself; it needs to perform an additional operation (loading) first.

Consider your setup:
```php
// This works because it loads one model instance:
$user = User::find(1);
$roles = $user->roles; // Success! $user is a Model.

// This fails because it loads a Collection of models:
$users = User::where('name', 'Test')->get();
// $roles = $users->roles; // Error! $users is a Collection, not a Model.
```

## The Solution: Eager Loading with `with()`

If you want to fetch multiple users *and* their associated roles efficiently, the best practice in Eloquent is **Eager Loading**. This tells Eloquent to load the relationships in a separate, optimized query (or queries), preventing the dreaded N+1 query problem.

To correctly load the relationship when using `where()` and `get()`, you must use the `with()` method:

```php
$users = User::where('name', 'Test')
            ->with('roles') // <-- Explicitly tell Eloquent to load the 'roles' relationship
            ->get();

// Now, accessing the relation works perfectly on each model in the collection:
foreach ($users as $user) {
    echo $user->name . " has roles: ";
    foreach ($user->roles as $role) {
        echo $role->name . ", ";
    }
    echo "\n";
}
```

This approach ensures that when you fetch a collection, each model within that collection is fully hydrated with its related data, making subsequent access to `$user->roles` reliable. This principle of efficient data retrieval is central to robust Laravel development, as emphasized by best practices found on platforms like [laravelcompany.com](https://laravelcompany.com).

## Conclusion

In summary, the choice between `find()` and `where()->get()` dictates whether you are working with a single model or a collection. While `find()` provides an immediate, single-model context where relationships are easily accessed, fetching multiple records requires the use of **Eager Loading** (`with()`) to properly load Eloquent relationships into your resulting collection. Always prioritize efficient data loading by using `with()` when dealing with relationships across multiple models.
