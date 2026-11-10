---
title: "Solve issue of upgrading to php 7.2 in laravel 5.4 application"
description: "Solving PHP Compatibility Nightmares: Upgrading Laravel 5.4 to PHP 7.2 Upgrading a legacy application, especially when touching core PHP versions, is often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

Upgrading a legacy application, especially when touching core PHP versions, is often more challenging than the upgrade itself. You’ve hit a very common snag: seemingly simple functions like `array_merge()` and `count()` throwing errors because of subtle changes in type handling introduced by newer PHP versions.

This post dives deep into why these issues occur after upgrading your Laravel 5.4 application to PHP 7.2, and provides robust solutions to ensure your application remains stable and scalable. We will also discuss the implications of moving forward with a Laravel upgrade.

## Understanding the Root Cause: PHP Type Strictness

The core issue you are facing stems from how PHP handles functions when input types change or when Eloquent methods return `null` instead of an empty collection or array.

When you moved to PHP 7.2, the language became significantly stricter regarding type juggling and null handling. Functions like `array_merge()` expect arrays as arguments. If a method returns `null` (which is common in database queries where no records are found), passing that `null` value results in an immediate fatal error because it violates the function's expectation. Similarly, `count()` requires an actual array or object that implements the `Countable` interface; passing `null` results in the error: "Parameter must be an array or an object that implements Countable."

This isn't a bug in Laravel itself; it’s a compatibility challenge between older code patterns and newer PHP runtime expectations.

## Solution 1: Fixing the `array_merge()` Error

The error `array_merge(): Argument #1 is not an array` occurs because one or both of the arrays you are trying to merge might be `null`. You must always perform null checks before attempting array operations.

**The Problematic Code:**
```php
$array = array_merge(
    $model->toSearchableArray(), $model->scoutMetadata()
);
```

**The Fix: Defensive Coding with Null Coalescing**

Instead of blindly merging, you need to ensure that both components exist before merging them. Use the null coalescing operator (`??`) to provide a default empty array if a method returns `null`.

```php
// Ensure that if a method returns null, we treat it as an empty array []
$searchable = $model->toSearchableArray() ?? [];
$metadata = $model->scoutMetadata() ?? [];

$array = array_merge($searchable, $metadata);

if (empty($array)) {
    return;
}
```
This change ensures that `$searchable` and `$metadata` are always arrays, satisfying the requirements of `array_merge()`, thus eliminating the error. This practice is fundamental to writing resilient code, aligning with best practices for data handling when working with Eloquent relationships and attributes, as promoted by resources like [laravelcompany.com](https://laravelcompany.com).

## Solution 2: Resolving the `count()` Error

The issue with `count(TutorialReview::where('TutorialID', 5)->get())` arises because if no records are found, the result of the query is an empty `Illuminate\Database\Eloquent\Collection`, but if you were dealing with a raw result or a null value, the error occurs.

When using Eloquent's `get()` method on a query that returns no results, it correctly returns an empty Collection, and calling `count()` on that collection works fine. However, if your previous logic returned `null` instead of a collection (e.g., `$query->first()` returned null), then `count(null)` fails.

**The Fix: Explicitly Handling Eloquent Results**

Always check the result of your database query before attempting to count it or process it.

```php
$tutorials = TutorialReview::where('TutorialID', 5)->where('UserID', 6)->get();

if ($tutorials->isEmpty()) {
    // Handle the case where no records are found explicitly
    return;
}

// Now we can safely use count() or iterate over the collection
$count = $tutorials->count();
```
By checking `$tutorials->isEmpty()` first, you manage the flow of execution correctly and avoid runtime errors caused by unexpected `null` values. This layered approach—checking for existence before operation—is crucial when dealing with data retrieved from the database, which is a core concept in effective Eloquent usage on [laravelcompany.com](https://laravelcompany.com).

## The Laravel Upgrade Strategy (5.4 to 5.5)

Does upgrading to Laravel 5.5 solve these issues? **No, not directly.**

The problems you encountered are rooted in PHP runtime behavior and legacy code patterns interacting with that runtime. Upgrading Laravel addresses framework-specific deprecations and features within the Laravel codebase itself. To fully resolve your current issue, you must first fix the defensive coding errors described above within your application logic.

After ensuring your code is stable on PHP 7.2 (by implementing null checks), then you can safely proceed with upgrading to Laravel 5.5. This ensures you benefit from any framework improvements while maintaining a solid, tested foundation in your application logic.

## Conclusion

Migrating to a new PHP version requires developers to adopt stricter coding practices, especially around handling data types and null values. By shifting from direct operations on potentially `null` variables to defensive checks using the null coalescing operator (`??`), you can eliminate runtime errors caused by these compatibility shifts. Focus on robust input validation in your application layer, and your Laravel application will remain stable and performant, regardless of future framework upgrades.
