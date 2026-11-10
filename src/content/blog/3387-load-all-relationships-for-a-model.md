---
title: "Load all relationships for a model"
description: "The Quest for Automatic Eager Loading: Can You Use Model::with(' ') in Laravel? As developers working with Eloquent and large data sets, one of the common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "Errors"]
featured: false
---

As developers working with Eloquent and large data sets, one of the common desires is the ability to simplify data fetching. When you need to load a model along with *all* its defined relationships in a single query, manually listing them—like `Model::with('relation1', 'relation2')`—can become tedious, especially when models have dozens of interconnected relationships.

This leads to a natural question: Is there a way to achieve this magic using a wildcard, something like `Model::with('*')`?

The short answer is no, not directly within the standard Eloquent syntax. However, as senior developers, we don't stop at the limitations of the framework; we look for powerful solutions that extend its capabilities. Today, I’ll explore why this limitation exists and how we can implement a dynamic solution using Laravel's reflection capabilities to achieve exactly what you are looking for.

## Why `Model::with('*')` Doesn't Work Out-of-the-Box

Eloquent is designed to be explicit. The `with()` method expects specific, known relationship names as arguments. This explicitness is a core tenet of good Object-Oriented Programming (OOP) and database interaction, ensuring that the query being built is precise and avoids accidental loading of unrelated data.

If Laravel allowed `Model::with('*')`, it would introduce ambiguity. The framework wouldn't know *which* relationships to load, potentially leading to performance issues or incorrect data retrieval if a relationship name was misspelled or if the model structure changed unexpectedly. This focus on explicit relationships is why frameworks like Laravel prioritize clear, intentional coding patterns—a principle that aligns with the robust architecture found at [laravelcompany.com](https://laravelcompany.com).

## The Developer Solution: Leveraging Reflection for Dynamic Loading

Since we cannot rely on simple wildcards, the solution lies in inspecting the model itself at runtime to discover what relationships exist. This is where PHP's reflection capabilities become indispensable. We can write a helper method or a custom query builder that introspects the model's `$ संबंधों` (relationships) and dynamically constructs the necessary `with()` calls.

Here is a conceptual example of how you might implement a trait or a scope to achieve dynamic eager loading:

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class DynamicEagerLoader
{
    public static function withAllRelationships(Builder $query, $model)
    {
        $relationships = $model->getRelations(); // Assuming a method exists or we use reflection directly

        if (empty($relationships)) {
            return $query;
        }

        // Dynamically build the array of relations to load
        $relationsToLoad = array_values($relationships);

        if (!empty($relationsToLoad)) {
            $query->with($relationsToLoad);
        }

        return $query;
    }
}

// Usage Example:
$user = App\Models\User::withAllRelationships();
```

In this approach, instead of guessing the relationship names, we instruct our code to look inside the model definition and automatically gather all defined relationships. This method is far more resilient because if you add a new relationship to your `User` model, your eager loading mechanism will automatically pick it up without needing manual updates.

## Best Practices and Conclusion

While reflection provides the power to achieve dynamic loading, it requires an initial investment in setting up the discovery mechanism. For standard applications where models are relatively static, manually listing relationships might still be acceptable for simplicity. However, for complex systems with numerous, evolving relationships, dynamic loading via reflection is the superior, scalable approach.

By embracing reflection, we move from writing brittle, hardcoded queries to building flexible, self-aware data access layers. This mirrors the philosophy behind modern, clean architectures, emphasizing maintainability and adaptability—principles that are central to effective Laravel development. Always aim for solutions that provide explicit control while maximizing developer efficiency when working with Eloquent.
