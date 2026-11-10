---
title: "Laravel: performing some task on every insert/update when using Query Builder or Eloquent ORM"
description: "Laravel: Automating Meta Data Insertion Across Eloquent and Query Builder As senior developers working within the Laravel ecosystem, we constantly seek ways..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "HTML"]
featured: false
---

As senior developers working within the Laravel ecosystem, we constantly seek ways to enforce consistency and manage metadata automatically. One common requirement is ensuring that every record inserted or updated carries essential context, such as who created it (`created_by`) and when it was modified (`modified_by`). The challenge lies in making this behavior consistent whether you are interacting with Eloquent Models or the raw Query Builder.

This post dives into why simple model overrides fall short and presents a robust, scalable solution for performing these tasks consistently across all database interactions in Laravel.

## The Problem: Inconsistent Meta Data Handling

The initial goal is straightforward: automatically populate `created_by` and `modified_by` fields upon any save operation.

We attempted to solve this by extending the Eloquent `Model` class and overriding the `save()` method. While this works flawlessly when using standard Eloquent methods, it fails when interacting directly with the Query Builder. This highlights a crucial architectural point: Eloquent abstracts much of the underlying database work, but raw queries bypass these abstractions, requiring a different—and often more complex—approach to achieve the same result.

## Why Overriding `save()` Isn't Enough

The reason overriding methods like `save()` is insufficient for a universal solution is due to how Laravel structures its data layers. Eloquent uses internal mechanisms and event listeners to manage timestamps automatically when configured correctly. When you use the Query Builder, you are interacting directly with the database layer without triggering these specific Eloquent lifecycle events.

If we only rely on model methods, we create a dependency that breaks down when non-Eloquent interactions occur, which is common in complex service layers or raw migration scripts. We need a solution that hooks into the persistence layer itself, not just the object representation.

## The Robust Solution: Leveraging Model Events and Mutators

The idiomatic Laravel approach to managing timestamps is by leveraging Eloquent's built-in features, specifically model events. This keeps our models clean and adheres to the principles of the framework. For adding `created_by` and `modified_by`, we need a mechanism that can inject this data *before* the database write occurs, regardless of the entry point (Eloquent or Query Builder).

Since you require tracking specific user IDs (`created_by`/`modified_by`), this task moves beyond simple timestamp management and requires external context injected into the persistence layer.

### Step 1: Customizing Eloquent Saves with Events

For Eloquent operations, we can use Mutators to ensure that when an attribute is assigned, it is populated correctly before saving. We’ll utilize the `creating` and `updating` events within the model lifecycle.

```php
use Illuminate\Support\Facades\Auth;

class Post extends Model
{
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
            $model->modified_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->modified_by = Auth::id();
        });
    }
}
```

This pattern works perfectly within the Eloquent context, ensuring that whenever a model is persisted through an Eloquent call (like `Post::create(...)`), these fields are populated. This approach aligns perfectly with best practices for data integrity in Laravel applications, as promoted by resources like those found on [laravelcompany.com](https://laravelcompany.com).

### Step 2: Handling the Query Builder Challenge

The difficulty remains when using the Query Builder. Since the Query Builder doesn't inherently listen to Eloquent events, we must introduce an abstraction layer or a custom method that wraps the raw query execution. A sensible way forward is to create a dedicated service class or extend the base Query Builder functionality if you are making these operations frequently across your application.

For true universality, instead of relying on model magic for every single operation, consider using **Global Scopes** or a custom Repository pattern. If you must perform raw insertions, ensure that your insertion logic explicitly handles the context acquisition before executing the query:

```php
// Example Query Builder Insertion (Manual Context Injection)
$userId = Auth::id();
DB::table('posts')->insert([
    'title' => 'New Post',
    'content' => 'Some content',
    'created_by' => $userId, // Manual injection needed here
    'modified_by' => $userId,
    'created_at' => now(),
    'updated_at' => now(),
]);
```

While this requires manual intervention in the raw Query Builder example, it forces you to be explicit about where the context comes from. This is often safer and more maintainable than trying to patch deep internals of the Query Builder itself.

## Conclusion

Attempting to force a single mechanism across Eloquent and the Query Builder reveals the fundamental difference between ORM-driven persistence and raw database interaction in Laravel. The most sensible approach is to use Eloquent's powerful event system for object-oriented operations, as demonstrated above. For non-Eloquent interactions like the Query Builder, explicit context injection during the insertion phase provides reliability and clarity. By adhering to these patterns, you ensure that your data remains consistent, readable, and fully compliant with Laravel’s design philosophy.
