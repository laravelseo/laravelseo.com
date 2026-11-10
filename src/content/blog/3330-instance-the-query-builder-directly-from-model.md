---
title: "Instance the query builder directly from model"
description: "Instance the Query Builder Directly from Model: Mastering Mutable Eloquent Queries When working with Eloquent and the Laravel Query Builder, developers..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

When working with Eloquent and the Laravel Query Builder, developers frequently encounter a desire to manipulate queries dynamically. Specifically, you often want an object that represents the base query—the `QueryBuilder`—so you can conditionally add `where` clauses, `orderBy` constraints, or handle eager loading (`with`) in a flexible manner.

The core question we address today is: How do we obtain this mutable Query Builder instance directly from a model without immediately executing a specific Eloquent method like `with()`?

## The Misconception About Instantiation

As you correctly observed, attempting to instantiate the model class directly, such as `$someBuilder = new SomeModel()`, returns an actual model *instance*, not a query builder. This is because the model instance represents a hydrated record (or a fresh model object), not the underlying database query structure that hasn't been executed yet.

Similarly, trying to access static methods like `SomeModel::getQuery()` often fails or returns an unrelated context. The magic of Eloquent lies in how its methods operate on the relationship between the model and the database; we need a way to access that mechanism directly.

## The Solution: Leveraging Model Scopes and Base Methods

The key to achieving your goal—a mutable, conditional query object—is understanding that all query building starts from the model's base capabilities. While there isn't a single public method named `getQueryBuilder()` available on every standard Eloquent model by default for arbitrary queries, we can achieve this functionality effectively by leveraging how Eloquent structures its querying and by defining custom methods where necessary.

For most common use cases involving conditional building, you should start with the basic static query methods provided by the model itself, which return the builder instance immediately upon calling them.

Consider the standard approach for starting a base query:

```php
use App\Models\SomeModel;

// Start building the query directly from the model class
$builder = SomeModel::query();

if (condition_is_met()) {
    $builder->where('status', 'active');
}

if (another_condition()) {
    $builder->where('created_at', '>', now()->subMonth());
}

// Execute the final query
$someResults = $builder->get();
```

In this pattern, we bypass any specific relation loading (`with()`) and instead start with the fundamental `query()` method. This returns the raw `Illuminate\Database\Eloquent\Builder` instance, which is exactly what you need for conditional manipulation before executing the final `$builder->get()`.

## Advanced Technique: Creating Custom Query Builders

If your requirement is specific to a particular model or complex set of constraints that should always start from a known state (e.g., always include certain default scopes), the most robust solution is to define custom static methods on your model to encapsulate this logic. This keeps your domain logic clean and adheres to good object-oriented principles, which aligns perfectly with the philosophy behind frameworks like Laravel.

For instance, you could add a static method to your model that encapsulates the base query setup:

```php
// In SomeModel.php
public static function getBaseQuery()
{
    // This ensures every time we call this, we start from a clean builder state.
    return self::query(); 
}
```

Then, in your controller or service layer, you use this custom method:

```php
$someBuilder = SomeModel::getBaseQuery(); // Get the starting point

if (condition()) {
    $someBuilder->where('price', '>', 100);
}

$someResults = $someBuilder->get();
```

This approach provides a clear, reusable interface. It allows you to abstract away the mechanics of the query builder, making your code much more readable and maintainable. When structuring complex data interactions within Laravel, understanding how to manipulate the underlying `QueryBuilder` is fundamental to writing efficient code across the entire application. Remember, mastering these core concepts will make leveraging Eloquent significantly more powerful.

## Conclusion

To summarize, you don't need a magical static method like `getQueryBuilder()` to achieve dynamic query building in Laravel. Instead, embrace the power of the foundation: start with the base model methods, specifically `::query()`, to obtain the mutable `QueryBuilder` instance. For larger applications requiring consistent starting points, encapsulate this logic within custom static methods on your models. This practice ensures that your data layer remains flexible, conditional, and highly efficient, aligning perfectly with Laravel's design philosophy.
