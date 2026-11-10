---
title: "mb_strpos() expects parameter 1 to be string, object given when querying 2 tables in Laravel"
description: "Solving Cross Table Filtering in Laravel: Why mb strpos() Errors Happen and How to Join Data Efficiently As a senior developer working with Eloquent and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As a senior developer working with Eloquent and the Laravel framework, you frequently encounter scenarios where you need to combine filtering logic across multiple related database tables. The attempt to merge conditions from two separate models often leads to subtle errors, as demonstrated by the `mb_strpos() expects parameter 1 to be string, object given` error you encountered. This error usually signals that a method expecting a string value (like a database column or a specific type of comparison) is instead receiving an Eloquent Model object where it expects a scalar value.

This post will dissect why your initial attempt failed and provide the most robust, idiomatic Laravel solutions for querying related data across multiple tables efficiently.

## The Pitfall: Object vs. String in Query Building

When you try to chain complex constraints using methods like `with()` combined with standard `where()`, the Eloquent query builder sometimes misinterprets how to apply the conditions across relationships, especially when dealing with nested closures for eager loading. In your case, trying to combine a direct filter on `Products` (`category_id`) with a constraint on the related `Company` model (`visible = 0`) within a single chain caused internal inconsistencies in how the query was constructed before hitting the final execution layer.

The core issue isn't necessarily the relationship itself, but how you are attempting to apply scalar filtering across the joined data set without explicitly defining the necessary joins or constraints for the main query result.

## Solution 1: Eager Loading Constraints (Refining Your Initial Approach)

Your first attempt using `with()` is excellent for eager loading related data. The error occurred because applying a filter on the parent model (`Products`) while simultaneously trying to constrain a relationship within the same chain often requires separate, explicit steps or dedicated methods.

If your primary goal is simply to retrieve products that belong to companies where `visible` is 0, you can use constraints carefully:

```php
$allCompanies = Products::where('category_id', $id->id)
    ->whereHas('company', function ($query) {
        $query->where('visible', 0);
    })
    ->groupBy('company_id')
    ->get();
```

### Explanation of the Fix:

Instead of trying to embed the relationship constraint directly into the `with()` clause in a way that confuses the main query builder, we use the `whereHas()` method. `whereHas()` is specifically designed to filter the primary model based on whether related models exist and satisfy specified conditions. This forces Laravel to execute the necessary `JOIN` internally, ensuring the resulting SQL is structured correctly, which avoids the object/string mismatch error.

## Solution 2: Using Explicit Joins for Complex Filtering

For scenarios where you need to select columns directly from both tables and apply complex filtering logic, explicit joins are often the most performant and clearest approach. This method gives you maximum control over the resulting SQL structure.

If you want a flat result set of products that meet all criteria, joining the tables explicitly is highly effective:

```php
$filteredProducts = DB::table('products')
    ->join('companies', 'products.company_id', '=', 'companies.id')
    ->where('products.category_id', $id->id)
    ->where('companies.visible', 0)
    ->groupBy('products.company_id')
    ->select('products.*'); // Select the desired columns from products

// If you need Eloquent models back:
$filteredProductsEloquent = Product::join('companies', 'products.company_id', '=', 'companies.id')
    ->where('products.category_id', $id->id)
    ->where('companies.visible', 0)
    ->groupBy('products.company_id')
    ->select('products.*')
    ->get();
```

This explicit approach bypasses the ambiguity that causes errors in complex nested Eloquent calls and directly constructs the required SQL, which is crucial when dealing with performance-sensitive operations, especially when managing data relationships as you do when building sophisticated queries on platforms like [Laravel Company](https://laravelcompany.com).

## Conclusion

When combining filtering across multiple Eloquent models, always prioritize clarity and correctness over trying to cram complex logic into single method calls. If you need to filter the main model based on conditions in a related model (e.g., "find products belonging to visible companies"), use `whereHas()`. If you need to select data from both tables directly and perform intricate filtering, explicit `JOIN`s via the Query Builder offer superior control and avoid common runtime errors like the one you encountered. By adopting these patterns, you ensure your Laravel applications remain robust, efficient, and easy to maintain.
