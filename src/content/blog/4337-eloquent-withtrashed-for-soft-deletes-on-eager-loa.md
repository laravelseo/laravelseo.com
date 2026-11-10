---
title: "Eloquent withtrashed() for soft deletes on eager loading query - Laravel 5.1"
description: "Eloquent with withTrashed() for Soft Deletes on Eager Loading Queries: Solving the Eager Loading Puzzle Debugging eager loading scenarios, especially when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

Debugging eager loading scenarios, especially when dealing with soft deletes, can often lead to confusing results like empty or `NULL` relationships. As a senior developer working with Laravel and Eloquent, you frequently encounter situations where modifying relationships doesn't behave as expected during mass retrieval. This post dives into the specific issue you encountered—using custom methods with `withTrashed()` in an eager load—and provides the robust solution.

## The Challenge: Why `withTrashed()` Fails on Eager Loading

You are attempting to use a custom relationship method, `client_withtrashed()`, which incorporates the `withTrashed()` scope, within an eager loading query (`Order::with('client_withtrashed')`). While this seems logically sound—you want to load the client *including* soft-deleted ones—it often fails during the eager loading phase.

The core issue lies in how Eloquent resolves relationships during the initial eager loading process. When you use `with()`, Laravel attempts to fetch the related data efficiently, often using separate queries based on the foreign keys. If the relationship definition itself is complex or involves cascading constraints (like soft deletes), applying scopes directly within a custom relationship method sometimes interferes with the overall query structure when fetching multiple parent records.

In your scenario, defining the scope inside the `belongsTo` call within a relationship might not be correctly interpreted by the eager loading mechanism across the entire set of results, leading to `NULL` values for those specific relationships, as seen in your output: `"client_withtrashed" => null`.

## The Solution: Applying Scopes at the Query Level

The most reliable and idiomatic way to handle conditional loading based on soft deletes is to apply the necessary scope directly to the main query *before* eager loading. This ensures that the constraints are applied globally to the data retrieval process, rather than relying solely on the relationship definition during the load phase.

Instead of modifying the relationship itself, let's modify how you retrieve the `Order` records.

### Step 1: Define Standard Relationships (Keep them Clean)

First, ensure your standard relationships are clean. The relationship method should define *what* the relationship is, not *how* it is filtered for a specific query context.

```php
// Order Model Example
public function client()
{
    return $this->belongsTo(Client::class);
}
```

### Step 2: Use Constrained Eager Loading

If you need to retrieve orders that belong to clients, including soft-deleted ones, apply the `withTrashed()` scope directly to the main query when eager loading.

```php
use App\Models\Order;

// Retrieve orders and eagerly load their clients, including soft-deleted ones.
$orders = Order::with('client') // Load the standard client relationship
               ->with('client') // Re-load or refine the loading if necessary (often redundant but safe)
               ->withTrashed()      // Apply the scope to the main query set
               ->where('id', $id)
               ->firstOrFail();

dd($orders); 
// This will now correctly load related clients, including soft-deleted ones, 
// provided the relationship itself is configured to handle nulls gracefully.
```

If you specifically need a modified relationship name for clarity (like your original `client_withtrashed`), you can still achieve this by defining a scope on the model and applying it during eager loading:

```php
// In App\Client Model:
public function scopeWithTrashed($query)
{
    return $query->withTrashed();
}

// In Order Controller/Service:
$order = Order::with(['client' => function ($query) {
    $query->withTrashed(); // Apply the scope here during eager loading
}])->where('id', $id)->firstOrFail();
```

## Best Practices for Eloquent Query Building

When dealing with complex data retrieval, remember that your focus should be on building clear, readable queries. Laravel's query builder is incredibly powerful; understanding how scopes and constraints interact is key to mastering Eloquent interactions. For deeper dives into optimizing these operations, exploring resources like the official [Laravel documentation](https://laravelcompany.com) is highly recommended.

The principle remains: apply global constraints where possible. Avoid embedding complex scope logic directly inside relationship methods when dealing with mass eager loading; instead, let the main query builder handle the filtering before the relationships are resolved. This approach results in more predictable and maintainable code, ensuring that your data retrieval logic remains sound regardless of whether records have been soft-deleted or not.

## Conclusion

The failure you observed was a classic case of scope interaction during eager loading. By shifting the application of `withTrashed()` from within the relationship definition to the main query builder, we ensure that Eloquent correctly fetches the necessary related data across all parent models efficiently. Embrace the power of query scoping at the query level for robust and predictable results in your Laravel applications.
