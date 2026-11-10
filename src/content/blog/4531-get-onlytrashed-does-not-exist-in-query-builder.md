---
title: "Get onlyTrashed() does not exist in query builder"
description: "Decoding Soft Deletes: Why onlyTrashed() Fails and How to Properly Query Deleted Records in Laravel Eloquent As senior developers working with Eloquent and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with Eloquent and database interactions, we frequently run into subtle issues when dealing with soft-deleting models. The desire to easily retrieve only the records that have been logically deleted—the "trashed" items—is very common. However, as you’ve discovered, attempting to use methods like `onlyTrashed()` directly on the Query Builder or within a custom method can lead to frustrating errors like `Method ... does not exist`.

This post will diagnose why this happens and show you the correct, idiomatic ways to query soft-deleted models in Laravel, ensuring your code is clean, efficient, and follows best practices.

---

## The Mystery of `onlyTrashed()`: Model Methods vs. Query Builder

The error you are encountering stems from a misunderstanding of where Eloquent methods reside. When you use the `SoftDeletes` trait on an Eloquent model (as shown in your `Messages` example), Laravel automatically injects specific query scopes into that model. These scopes, such as `trashed()`, `forceDeleting()`, and `onlyTrashed()`, are designed to be called directly on the **Model instance** or used within the Query Builder context established by the model.

The reason you see the error: `Method Illuminate\Database\Query\Builder::onlyTrashed does not exist` is because the `onlyTrashed()` method is an Eloquent scope defined on the *Model*, not a native method available on the raw `Builder` object itself in that specific way.

### Understanding Soft Deletes Implementation

The magic behind soft deleting lies in the traits and model configuration:

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Messages extends Model
{
    use SoftDeletes; // This trait grants access to soft-delete methods

    // ... other properties
}
```

When you use `SoftDeletes`, Eloquent automatically hooks into the model lifecycle. The `onlyTrashed()` method is a convenience scope that tells the query builder to automatically add `where deleted_at IS NOT NULL` to any query initiated on that model.

## Correct Approaches to Retrieving Trashed Messages

Instead of trying to manually recreate or call non-existent methods, we should leverage the built-in Eloquent functionality. There are three primary, robust ways to fetch your trashed messages:

### 1. Using the Built-in `onlyTrashed()` Scope (The Best Way)

The most straightforward and Laravel-idiomatic way is to call the scope directly on the model or use it within a query. This method relies entirely on the structure provided by the `SoftDeletes` trait, making your code highly readable and maintainable.

If you want all trashed messages for a specific user:

```php
use App\Models\Messages;

// Fetch only the soft-deleted messages where user_id matches $userId
$trashedMessages = Messages::onlyTrashed()
    ->where('user_id', $userId)
    ->orderBy('deleted_at', 'desc')
    ->get();
```

This approach is clean, requires no custom methods on the model, and stays fully aligned with how Laravel manages Eloquent relationships (`https://laravelcompany.com`).

### 2. Creating a Custom Static Helper (For Reusability)

If you find yourself repeating this exact logic across many controllers or services, creating a static helper method on the model is an excellent practice for code reuse. This is what you were attempting, but we need to ensure it interacts correctly with the underlying query mechanism.

You can define a static method that simply calls the built-in scope:

```php
// In app/Models/Messages.php

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Messages extends Model
{
    use SoftDeletes;

    /**
     * Retrieves all soft-deleted messages.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getTrashed()
    {
        // We call the built-in scope directly on the model's query builder context.
        return self::onlyTrashed();
    }

    // You can also define a more specific helper if needed:
    public static function trashedByUser(int $userId)
    {
        return self::onlyTrashed()
            ->where('user_id', $userId)
            ->orderBy('deleted_at', 'desc')
            ->get();
    }
}
```

By implementing `trashedByUser()`, you encapsulate the complex logic into a single, reusable method. This pattern is superior to trying to override or redefine fundamental methods directly on the Builder class.

### 3. Manual Filtering (Avoid If Possible)

While it is technically possible to manually filter by checking `deleted_at IS NOT NULL`, this bypasses Eloquent's elegant soft-delete handling and forces you to handle database logic yourself, which increases the chance of error and reduces code clarity. Always prefer using the provided Eloquent scopes when working with soft deletes.

## Conclusion

The key takeaway is that Eloquent provides the necessary functionality through traits like `SoftDeletes`. Resist the urge to redefine core query methods; instead, embrace the built-in scope system. By utilizing methods like `onlyTrashed()` directly on your model or creating static helper methods that invoke these scopes, you write code that is robust, readable, and perfectly aligned with modern Laravel development practices. For more deep dives into Eloquent patterns and database interactions, always refer to the official documentation at https://laravelcompany.com.
