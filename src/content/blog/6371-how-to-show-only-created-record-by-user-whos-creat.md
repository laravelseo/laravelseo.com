---
title: "How to show only created record by user who's created it in laravel filament"
description: "How to Show Only Created Records by the User Who Created It in Laravel Filament As developers building complex applications with Laravel, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As developers building complex applications with Laravel, one of the most fundamental requirements is ensuring data security and proper access control. When using powerful tools like Laravel Filament to build administrative interfaces, enforcing ownership rules—showing a user only what they are authorized to see—becomes crucial.

This post addresses a very common requirement: how to restrict the records displayed within a Filament Resource so that each user can only view the records they personally created. We will walk through the exact steps and best practices for achieving this robust filtering.

## The Scenario: Enforcing Ownership in Filament

Let's establish the context. Imagine we have a `Product` model that belongs to a `User`.

**Model Setup:**
```php
// app/Models/Product.php
class Product extends Model
{
    protected $fillable = ['name', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

We have two products: Product A (created by User 1) and Product B (created by User 2). When User 1 logs in, they should only see Product A.

**The Goal:** Filter the list of products displayed in the Filament Table for the logged-in user (`Auth::id()`).

## The Solution: Filtering within the Filament Resource

The most effective place to implement this filtering is directly within the Filament Resource class itself. By intercepting the query before it hits the table, we ensure that only authorized data is loaded into memory, which improves performance and security significantly.

We will leverage Eloquent's powerful querying capabilities, which are foundational to the entire Laravel ecosystem, including how Filament interacts with your database.

### Step 1: Accessing the Authenticated User ID

Inside your Filament Resource class (e.g., `ProductResource.php`), you need access to the currently logged-in user’s ID. This is easily done using the `Auth` facade.

### Step 2: Modifying the Query

We will modify the base query that Filament uses to fetch records by adding a `where` clause that matches the `user_id` column on the model.

Here is how you implement this filtering in your Resource class:

```php
// app/Filament/Resources/ProductResource.php

use Illuminate\Support\Facades\Auth;
use Filament\Resources\Resource;
use Illuminate\Database\Eloquent\Builder;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    public static function getEloquentQuery(): Builder
    {
        // Get the ID of the currently authenticated user
        $userId = Auth::id();

        // Apply the filter: only show products where user_id matches the current user's ID
        return parent::getEloquentQuery()
            ->where('user_id', $userId);
    }

    // ... rest of your resource methods (form, table, etc.)
}
```

### Explanation of the Approach

By overriding the `getEloquentQuery()` method in your Resource, you are effectively controlling *every* database query initiated for this resource. Instead of letting Filament fetch all records and then filtering them on the front end (which is inefficient), we push the filtering logic directly into the Eloquent query upfront. This adheres to the principle of keeping data operations as close to the database as possible, which is a core tenet of good Laravel development.

## Advanced Consideration: Security and Scopes

While the method above is perfectly functional for simple ownership checks, for larger, more complex applications, relying solely on filtering inside the Resource might become repetitive. A more scalable, object-oriented approach involves using **Local Scopes** or **Policies**.

If you frequently need to check permissions across your application, defining a scope on your Eloquent model is a cleaner solution:

```php
// app/Models/Product.php

class Product extends Model
{
    // ... existing code

    /**
     * Scope a query to only include records owned by the current user.
     */
    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
```

With this scope defined, your Filament Resource logic becomes even cleaner and more reusable:

```php
// Inside ProductResource.php's getEloquentQuery()
public static function getEloquentQuery(): Builder
{
    $userId = Auth::id();
    return parent::getEloquentQuery()
        ->whereByUser($userId); // Using the defined scope
}
```

This pattern keeps your business logic cleanly separated from the presentation layer, making your code more maintainable—a key principle when building scalable Laravel applications.

## Conclusion

Showing only created records by the respective user is a non-negotiable requirement for any secure application. By leveraging Eloquent's query building capabilities within your Filament Resource, you can efficiently restrict data access right at the source. Whether you use direct filtering in `getEloquentQuery()` or abstract it into reusable Local Scopes, implementing this ownership check ensures that your Laravel Filament application is both functional and highly secure. Keep pushing those boundaries with powerful tools like Laravel!
