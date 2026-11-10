---
title: "Laravel Eloquent join vs with"
description: "Eloquent Joins vs. Eager Loading: Choosing the Right Path for API Performance As senior developers working with Laravel and Eloquent, we frequently encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

As senior developers working with Laravel and Eloquent, we frequently encounter a fundamental architectural decision: when dealing with related data, should we use a direct `join` or leverage eager loading via `with()`? The performance difference, especially when fetching data for a REST API that requires pagination, is often subtle but critical. Understanding the mechanics behind these two methods is key to writing efficient, scalable database queries.

This post dives deep into the nuances of `join` versus `with`, analyzing how they affect query execution, result structure, and best practices when building high-performance APIs.

---

## The Mechanics: `JOIN` vs. `WITH`

The core difference between `join` and `with` lies in *how* the data is retrieved from the database and *how* Eloquent hydrates that data into PHP objects.

### 1. Using `JOIN`: The Flat Result Set

When you use the `join` method, you instruct the database to combine the rows from two or more tables into a single, wide result set (a Cartesian product).

```php
$users = User::join('profiles', 'users.id', '=', 'profiles.user_id')
             ->where('users.first_name', 'LIKE', '%a%')
             ->select('users.*'); // Note: We still select only user columns for simplicity here
```

**The Query Structure:** The database performs a single, complex operation to fetch all necessary columns from both tables simultaneously.

```sql
SELECT * FROM `users` INNER JOIN `profiles` ON `users`.`id` = `profiles`.`user_id` WHERE `users`.`first_name` LIKE '%a%';
```

**The Trade-off:** While this is often concise (fewer lines of code), the result set returned by the database includes redundant data from the joined table. For large tables, fetching and processing this wider result set can consume more memory and CPU resources compared to retrieving separate, focused records.

### 2. Using `WITH`: Eager Loading

Eager loading, implemented via `with()`, does not change the initial query structure. Instead, it executes separate queries (or a few highly optimized queries) to fetch the main models and their related data. This prevents the database from creating an unnecessary wide join at the initial stage.

```php
$users = User::with('profile')
             ->whereHas('profile', function ($query) {
                 $query->where('first_name', 'like', '%a%');
             })
             ->get();
```

**The Query Structure:** As you noted, this often results in a query structure involving subqueries or separate `SELECT` statements executed after the initial user selection. For example, when filtering with `whereHas`, Laravel generates an existence check:

```sql
SELECT * FROM `users` WHERE EXISTS (SELECT 1 FROM `profiles` WHERE `users`.`id` = `profiles`.`user_id` AND `profiles`.`first_name` LIKE '%a%')
```

**The Benefit:** Eager loading avoids the performance pitfall of a massive initial join. Crucially, when building RESTful APIs, this approach is superior because it keeps the primary query lean and allows for efficient pagination management, as we can apply filtering *before* or *during* the loading process without bloating the main result set unnecessarily.

---

## Practical Application: API Pagination and Filtering

For building robust REST APIs that handle pagination, **eager loading (`with`) is generally the recommended approach.** It aligns better with how Eloquent manages relationships and avoids potential performance bottlenecks associated with broad joins on large datasets.

When you are dealing with filtering on related models (like searching for users based on profile data), using `whereHas` alongside eager loading gives you granular control:

```php
// Fetching users who have a profile matching the criteria, eagerly loaded
$users = User::with('profile')
             ->whereHas('profile', function ($query) use ($request) {
                 $query->where('first_name', 'like', '%' . $request->first_name . '%');
             })
             ->paginate(15);
```

This method ensures that you retrieve only the necessary users while correctly applying complex filtering through the relationship, which is a core strength of the Laravel framework. As demonstrated in official documentation, understanding these relationships is central to mastering data retrieval with Eloquent on the [Laravel Company website](https://laravelcompany.com).

## Conclusion: The Senior Developer's Verdict

While `join` provides a single SQL statement and can be marginally faster for simple data dumps, **eager loading (`with()`) offers superior flexibility, cleaner object hydration, and better performance predictability** when dealing with complex API requirements involving relationships and pagination.

For modern Laravel applications prioritizing clean code and scalable API design, favor the expressive power of `with()` and related query builders like `whereHas()`. It allows you to build queries that are readable, maintainable, and performant across various data scales.
