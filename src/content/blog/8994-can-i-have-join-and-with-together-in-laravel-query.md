---
title: "Can I have `join` and `with` together in laravel query builder?"
description: "Can I have join and with together in the Laravel Query Builder? A Deep Dive into Eloquent Relations As a senior developer working with the Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we constantly seek ways to write efficient, expressive, and readable database queries. One common point of confusion arises when mixing Eloquent's powerful eager loading mechanism (`with()`) with raw query builder methods like `join()` or `leftJoin()`.

The scenario you presented—wanting to eagerly load one relationship (`skills` via `with()`) while simultaneously performing custom joins for other related tables (`companies`, `colors`) without defining all those relationships in the Eloquent models—is a very common requirement. Let's break down whether this is possible and, more importantly, what the best practice solution is from a Laravel perspective.

## The Difference Between Eager Loading and Joining

To understand the conflict, we must first distinguish between these two core concepts:

**1. Eloquent `with()` (Eager Loading):**
The `with('relation')` method tells Eloquent to load related data efficiently. By default, this often results in separate queries being run (N+1 problem solved) or a single optimized `LEFT JOIN` if you specify constraints. This mechanism is designed to hydrate the result into fully functional Eloquent model objects.

**2. Query Builder `join()` (Raw SQL):**
`join()` is a raw method used to define explicit SQL joins directly on the query builder. It manipulates the underlying SQL structure but does not inherently understand Eloquent relationship hydration rules unless specifically instructed.

When you attempt to mix them, as in your example:

```php
$user = User::with('Skill')
            ->leftJoin('companies', function ($join) use ($id) { /* ... */ })
            ->leftJoin('colors', function ($join) use ($id) { /* ... */ })
            ->first();
```

The issue you encountered—receiving empty profiles or missing data—stems from how Eloquent attempts to hydrate the results. Eager loading expects its relationships to be defined within the model structure. When raw joins are introduced, they alter the context of the query in a way that can confuse the hydration process, especially when trying to pull related models back into the primary `User` object simultaneously.

## The Correct Approach: Choosing the Right Tool

While you *can* technically chain these methods, it often leads to complex debugging and fragile code. For performance and maintainability, we should choose the method best suited for the goal.

### Option 1: Stick to Eloquent Relationships (Recommended)

If `Skill`, `Company`, and `Color` are truly related entities to the `User`, the most robust Laravel solution is to define these relationships in your models. This allows Eloquent to handle all the complex joining internally, ensuring data integrity and correct hydration.

**In `User.php`:**
```php
public function skills()
{
    return $this->belongsToMany(Skill::class);
}

public function companies()
{
    return $this->belongsTo(Company::class);
}

public function colors()
{
    return $this->belongsTo(Color::class);
}
```

**The Query:**
With these relationships defined, you can perform clean eager loading:

```php
$user = User::with(['skills', 'companies', 'colors'])
            ->where('id', 1)
            ->first();

// Accessing data is seamless:
echo $user->skills->pluck('name')->implode(', ');
echo $user->companies->first()->name;
```

This approach leverages the core strength of Laravel, making your code highly readable and maintainable. This philosophy aligns perfectly with building robust applications in Laravel, as promoted by the principles found on sites like https://laravelcompany.com.

### Option 2: Using Raw Joins for Data Aggregation

If your primary goal is *not* to hydrate full Eloquent models but simply to aggregate raw data from other tables alongside the `User` data (e.g., fetching a list of users with their associated company names), then using explicit joins is appropriate. In this case, you abandon the strict "eager loading" paradigm and focus purely on the query builder:

```php
$users = DB::table('users')
    ->leftJoin('companies', 'companies.user_id', '=', 'users.id')
    ->leftJoin('colors', 'colors.user_id', '=', 'users.id')
    ->select('users.*', 'companies.name as company_name', 'colors.color as user_color')
    ->where('users.id', 1)
    ->first();

// $users will contain an array/object with the joined data, not necessarily a hydrated User model.
```

## Conclusion

In summary, you should **not** try to force `with()` and raw `join()` operations together if your ultimate goal is to retrieve fully hydrated Eloquent models. The conflict arises because they serve different purposes: one manages object relationships (Eloquent), and the other manipulates SQL structure (Query Builder).

For relational data management in Laravel, always prioritize defining Eloquent relationships. Use `with()` for eager loading related models and rely on those defined relationships to handle the complex joining behind the scenes. If you need specific raw data aggregation, use `join()`, but be prepared to manage the resulting flat data structure yourself. This careful separation ensures your code remains predictable, efficient, and adheres to best practices in Laravel development.
