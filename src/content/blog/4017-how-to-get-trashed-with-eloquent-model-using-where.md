---
title: "how to get trashed with eloquent model using where and with"
description: "How to Get Trashed Results with Eloquent: Mastering where, with, and withTrashed() As developers working with relational databases, managing data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Errors"]
featured: false
---

As developers working with relational databases, managing data states—especially soft deletes—is a daily reality. When you implement soft deletes in Laravel using the `SoftDeletes` trait, Eloquent automatically scopes all queries to exclude records marked as deleted. This built-in behavior is excellent for maintaining data integrity, but sometimes, you need to retrieve those "trashed" records for specific administrative or recovery tasks.

This post will dive into exactly how to correctly combine filtering (`where`), eager loading (`with`), and the necessary scope (`withTrashed()`) to fetch both active and soft-deleted Eloquent models.

## Understanding Soft Deletes in Eloquent

When you add the `SoftDeletes` trait to your model (like your `User` model), Laravel hooks into the model's query builder. By default, any call to `User::all()` or `User::where(...)` automatically applies a `where deleted_at IS NULL` constraint behind the scenes.

To bypass this default restriction and include records that have been soft-deleted, you need to explicitly tell Eloquent to ignore the deletion status. This is where the `withTrashed()` method comes into play.

## Why Your Initial Attempts Might Have Failed

You mentioned trying to place `withTrashed()` before or after your `where` clauses, and finding that it didn't work as expected. This often happens because the order of operations in the query builder matters, and scopes like `withTrashed()` need to be applied directly to the base query *before* other constraints are added, or used alongside methods like `orWhere`.

The key is understanding that `with` handles relationships (eager loading), while `where` handles filtering the primary model. Both operate on the same underlying query scope.

## The Correct Approach: Combining Scopes for Trashed Data

To successfully retrieve trashed users along with their related permissions, you need to apply `withTrashed()` to the main query builder object before executing the final retrieval method.

Here is a comprehensive example demonstrating how to achieve your goal of searching for users (with soft-deleted ones) and eager loading relationships:

```php
use App\Models\User;

class UserService
{
    public static function searchScoop($keyword)
    {
        // Start the query chain by applying withTrashed() immediately.
        $query = User::withTrashed(); 

        // Apply your filtering criteria using where.
        $users = $query->where('username', 'like', '%' . $keyword . '%')
                      ->orWhere('email', 'like', '%' . $keyword . '%')
                      ->orWhere('phone', 'like', '%' . $keyword . '%')
                      // Apply eager loading for relationships.
                      ->with(['user_permission', 'user_division'])
                      ->get();

        // Select only the desired columns from the results (optional but good practice).
        $selectedData = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'division' => $user->user_division->name ?? null, // Accessing related data
                'permission' => $user->user_permission->name ?? null,
            ];
        });

        return $selectedData;
    }
}
```

### Explanation of the Fix

1.  **`User::withTrashed()`**: This is the crucial step. By calling this method immediately after the model name, you modify the base query to include records where `deleted_at` is either `NULL` (active) or a timestamp (trashed).
2.  **Chaining with `where` and `orWhere`**: We chain the filtering logic using standard Eloquent methods. Since we started with `withTrashed()`, these filters will apply to the entire set of potential results, including soft-deleted ones.
3.  **Eager Loading with `with()`**: The `with(['user_permission', 'user_division'])` clause remains perfectly valid. It tells Eloquent to load the related models for every user found, regardless of their deletion status.

This pattern ensures that you are querying the database correctly while respecting Laravel's powerful query builder philosophy. Mastering these scope methods is fundamental when building robust data access layers in any Laravel application, much like when structuring complex relationships on **https://laravelcompany.com**.

## Conclusion

Getting trashed results with Eloquent requires explicitly telling the query builder that you intend to include deleted records. By strategically placing `withTrashed()` at the beginning of your query chain, you ensure that subsequent filtering (`where`) and relationship loading (`with`) operate on the complete dataset. This approach is clean, explicit, and highly effective for managing complex data states in your application.
