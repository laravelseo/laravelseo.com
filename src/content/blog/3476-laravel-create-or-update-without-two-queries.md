---
title: "Laravel create or update without two queries"
description: "Mastering Eloquent: Creating or Updating Models Without Redundant Queries As senior developers working with Laravel and Eloquent, we constantly strive for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

As senior developers working with Laravel and Eloquent, we constantly strive for efficiency. One of the most common performance pitfalls in application development is performing unnecessary database queries. The scenario presented—using a single form submission to handle both creation (INSERT) and updating (UPDATE)—is a classic example where clever Eloquent usage can save precious milliseconds and reduce database load.

The provided code snippet attempts to solve this using `firstOrNew()`:

```php
Feature::firstOrNew(['id' => Input::get('id')])->update($data);
```

While `firstOrNew` is convenient, as you correctly pointed out, it still performs an initial database lookup (`SELECT`) before executing the update. If your primary goal is simply to ensure a record exists *and* then save the new data, we can often bypass this intermediate step entirely, leading to cleaner and more performant code.

This post will dive into why the original approach is suboptimal and demonstrate superior methods for handling conditional creation and updating in Laravel.

## The Inefficiency of `firstOrNew()->update()`

The method `firstOrNew()` works by executing a query: it tries to find a record matching the provided criteria (`id`). If found, it returns that model; if not found, it creates a new one based on the attributes provided. Then, you chain the `update()` call onto the result.

This sequence inherently requires at least two database operations in many scenarios:
1. A `SELECT` query (to check existence).
2. An `UPDATE` or `INSERT` query.

If your requirement is purely conditional—"If ID exists, update it; otherwise, insert it"—we can structure the logic to execute only a single, precise operation, eliminating the needless initial fetch.

## Best Practices for Conditional Operations

There are several robust ways to achieve atomic create-or-update operations without relying on an unnecessary `SELECT` query within your controller logic. The best approach depends on whether you want to rely on Eloquent's built-in magic or explicit conditional checks.

### Method 1: Leveraging `updateOrCreate()` (The Eloquent Way)

For the most straightforward solution, Laravel provides a specialized method designed exactly for this purpose: `updateOrCreate()`. This method internally handles the check and execution logic in a single database command, making it highly efficient.

Instead of fetching first and then updating, you tell Eloquent what to do based on whether a record matching the criteria exists.

```php
$attributes = Input::all();
$attributes['company_id'] = Auth::user()->company_id;

// This executes a single, optimized query (often using an INSERT or UPDATE)
Feature::updateOrCreate(
    ['id' => Input::get('id')], // Criteria to look for
    $attributes              // Data to use if found, or data to create if not found
);

return Redirect::route('features.index');
```

This is a powerful tool endorsed by the Laravel community because it encapsulates complex logic into a single method, adhering to the principle of keeping controllers lean and focused on business logic rather than query management. For deep dives into Eloquent features, always refer back to official documentation like the [Laravel documentation](https://laravelcompany.com).

### Method 2: Explicit Conditional Logic (The Manual Approach)

If you need finer control or want to avoid methods that might hide underlying database behavior, you can use explicit conditional checks. This gives you explicit control over which query is executed.

```php
$id = Input::get('id');
$data = Input::all();
$data['company_id'] = Auth::user()->company_id;

if ($id) {
    // If ID exists, perform an UPDATE
    $feature = Feature::where('id', $id)->update($data);
} else {
    // If ID does not exist, perform an INSERT (Create)
    Feature::create($data);
}

return Redirect::route('features.index');
```

While this method explicitly avoids the initial `firstOrNew` fetch, it requires two separate conditional branches based on a database check (`where`). However, for complex scenarios where you might need to handle errors or specific transactional requirements, explicit logic offers greater transparency.

## Conclusion

When optimizing database interactions in Laravel, always ask: "What is the most efficient way to achieve this goal?" For simple create-or-update operations based on an existing ID, `updateOrCreate()` is your go-to solution, as it abstracts away the complexity and ensures optimal query execution. By choosing these methods over chaining `firstOrNew()` followed by `update()`, you ensure that your application remains fast, scalable, and adheres to Laravel's best practices.
