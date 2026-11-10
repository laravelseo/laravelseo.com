---
title: "php error Call to an undefined static method with PHPStan"
description: "Decoding the Static: Solving PHPStan Errors with Laravel Scopes As developers working with modern frameworks like Laravel and strict static analysis tools..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with modern frameworks like Laravel and strict static analysis tools like PHPStan, we often encounter frustrating mismatches between dynamic runtime behavior and static analysis expectations. One common stumbling block involves Eloquent Scopes—a powerful feature of Laravel that simplifies complex query logic.

I recently encountered a scenario where my code, which uses custom scope methods, caused PHPStan to flag an error: `Call to an undefined static method` when calling an Eloquent scope. This post will walk you through why this happens and provide robust solutions to ensure your static analysis remains accurate while leveraging the power of Laravel’s Query Builder.

## The Anatomy of the Problem: Scopes vs. Static Analysis

The issue stems from how PHPStan analyzes method calls versus how Laravel scopes are implemented. An Eloquent scope, such as `scopeFiltrarConLiquidacionesOrdenadosPorNombre`, is defined as a method on the Model class (e.g., `Empresa`). When you call it on the model (`Empresa::filtrar...`), it behaves like a static call, but PHPStan’s internal type mapping sometimes struggles to resolve the return type correctly when complex query builder methods are involved, leading it to assume the method must be strictly static if no explicit instance context is provided.

The core conflict lies here:
1. **Runtime (Laravel):** The scope method operates on the Query Builder instance and returns a modified query object. It behaves dynamically.
2. **Static Analysis (PHPStan):** PHPStan demands strict type contracts. If it cannot definitively prove that the method call is valid based purely on the class definition, it throws an error.

## Solution 1: Explicit Return Types and Annotations

The most reliable way to satisfy static analyzers is by providing crystal-clear type information using PHPDoc annotations. While you tried adding return types, we need to ensure they are maximally informative for PHPStan.

When defining your scope method in the `Empresa` model, make sure the return type accurately reflects what the scope returns—in this case, an instance of the Query Builder.

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Empresa extends Model
{
    /**
     * Scope a query to filter companies based on liquidations and name sorting.
     *
     * @param Builder $query The base query builder instance.
     * @param array $args Arguments for filtering/ordering.
     * @return Builder The modified query builder instance.
     */
    public function scopeFiltrarConLiquidacionesOrdenadosPorNombre(Builder $query, array $args): Builder
    {
        // ... your complex query logic involving joins and get() calls
        $query->join(...)
             ->where(...)
             ->orderBy(...);

        return $query; // Return the modified builder
    }
}
```

By explicitly defining the input (`Builder $query`) and the output (`: Builder`), we give PHPStan the necessary context to understand that this method is a valid operation within the Eloquent framework, even when called statically. This practice aligns perfectly with best practices for building robust applications on platforms like Laravel.

## Solution 2: Ensuring Correct Instantiation Context

If the error persists, it often means PHPStan is confused about whether you are calling an instance method or a static method. Since scopes *must* be called via the Model class (which behaves statically), ensure your calling code adheres strictly to this pattern.

Your original call structure was correct:
```php
$empresas_informe_gts = Empresa::filtrarConLiquidacionesOrdenadosPorNombre($argsScope);
```
If PHPStan is still flagging it, review the configuration of your PHPStan level or extensions. Often, ensuring you are using modern Laravel features correctly, as promoted by resources like those found on the official [Laravel documentation](https://laravelcompany.com), helps resolve these subtle type conflicts during static analysis.

## Conclusion: Trusting the Annotations

Dealing with static analysis tools while working in a dynamic environment like Laravel requires bridging the gap between runtime behavior and compile-time expectations. By meticulously documenting your methods using precise PHPDoc annotations—especially defining the input and output types for your Eloquent scopes—you empower PHPStan to understand your code's intent. This approach moves you from fighting errors to collaborating with the analysis tool, resulting in cleaner, more maintainable, and ultimately, more reliable Laravel applications.
