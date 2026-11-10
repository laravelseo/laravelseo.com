---
title: "Use Laravel touches without global scopes"
description: "Mastering Eloquent Touches: Bypassing Global Scopes for Clean Mass Updates As developers working with Laravel and Eloquent, we often seek ways to leverage..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

As developers working with Laravel and Eloquent, we often seek ways to leverage powerful features like mass updates efficiently. The `touches` attribute is a neat feature designed to automatically update timestamps on related models when a parent model is saved. However, as you have discovered, this convenience can sometimes clash with more complex architectural patterns, specifically the use of Global Scopes.

This post dives into a common conceptual hurdle: how to ensure that Eloquent's automated operations, like `touches`, execute correctly without being unintentionally filtered or modified by active Global Scopes.

## The Concept Problem: Touches vs. Global Scopes

The core issue lies in the execution context of the update operation. When you trigger an update via relationships (such as using `$model->touches`), Eloquent initiates queries against related models. If those related models have Global Scopes applied (like our `LocaleScope` which filters results based on a specific locale), these scopes are automatically invoked during the update process.

In your example, when updating an `Ingredient`, the system tries to touch the related `Recipe` models. Because the `Recipe` model has a `globalScope` applied via the `LocaleScope`, every automatic action is subject to that scope. This is fine for standard querying, but it breaks the intended mass update logic if the scope is meant purely for retrieval and not transactional modification.

## Why Global Scopes Interfere with Mass Updates

Global Scopes are designed to enforce baseline rules across an entire model's lifecycle. When a scope applies a `WHERE` clause (e.g., `where('locale', '=', $locale->getLocale())`), it filters the data returned by any query, including mass update operations initiated through relationships. This means that when Eloquent attempts to touch or save the related models, it inadvertently tries to apply the locale restriction onto those records, potentially leading to unexpected results or errors if the scope logic isn't designed to handle mutating operations correctly.

## The Solution: Manual Control and Bypassing Scopes

Since `touches` operates internally within Eloquent's relationship management, there isn't a direct, built-in flag like `touchWithoutGlobalScopes()`. Therefore, the most robust developer approach is to bypass the automatic mass update mechanism and implement the synchronization logic manually. This gives you explicit control over when and how the related models are updated, ensuring that Global Scopes are respected only during explicit retrieval operations.

Instead of relying on `$model->touches`, we should handle the relationship updates explicitly within a transaction or service layer.

### Concrete Example: Manual Synchronization

Let's refactor the process to manually manage the synchronization, respecting our data scoping rules.

**Ingredient Model (No change needed here):**
```php
class Ingredient extends Model
{
    protected $touches = ['recipes'];

    public function recipes() {
        return $this->belongsToMany(Recipe::class);
    }
}
```

**Recipe Model (Keep the Global Scope for retrieval):**
```php
class Recipe extends Model
{
    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new LocaleScope); // Scope remains active for standard queries
    }

    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }
}

// LocaleScope (Remains the same)
class LocaleScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $locale = app(Locale::class);
        return $builder->where('locale', '=', $locale->getLocale());
    }
}
```

**The Synchronization Logic (The Fix):**
Instead of relying on
