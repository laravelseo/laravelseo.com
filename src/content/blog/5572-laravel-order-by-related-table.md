---
title: "Laravel order by related table"
description: "Mastering Eloquent: How to Order Products by Category Name As senior developers working with Laravel and Eloquent, we constantly encounter scenarios where we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As senior developers working with Laravel and Eloquent, we constantly encounter scenarios where we need to perform complex sorting operations across related database tables. A very common requirement is sorting a primary set of models (like `Product`s) based on an attribute from a related model (like the `Category`'s name).

This post dives into a specific challenge: how to correctly sort Eloquent collections when dealing with one-to-many relationships, and why the seemingly straightforward approach often leads to confusion.

## The Challenge of Eager Loading Sorting

Let's look at the scenario you presented. You have `Product` models that belong to a `Category`, and you want to retrieve all products sorted alphabetically by their category name.

Your initial attempt involved using a closure within the `with()` method:

```php
$products = Product::with(['categories' => function($q){
    $q->orderBy('name', 'asc')->first();
}]);
```

While this approach is clever, it fails because of how Eloquent handles eager loading and collection sorting. When you use `with()`, you are primarily instructing Eloquent to *load* the related data efficiently, not necessarily to reorder the primary results based on that loaded relationship. Returning an ordered sub-query inside a `with()` context doesn't inherently affect the order of the main `Product` records being returned.

The reason your test case `$products = Product::with('categories')->first();` worked is because you were only requesting a single record, and simply eager loading that one category was sufficient for fetching the data without needing a complex sort on a larger set.

## The Correct Approach: Sorting at the Query Level

To sort the main collection of `Product`s based on an attribute in the related `Category`, we must perform the sorting operation directly on the primary query, utilizing SQL joins. This is the most efficient and idiomatic way to handle complex ordering in Eloquent.

Since the relationship is a `belongsTo` (Product belongs to Category), we can use standard join syntax to order the products by the category name.

### Solution 1: Sorting the Main Collection using Joins

We start with the `Product` model and instruct it to join the `categories` table and apply the ordering there.

```php
$products = Product::join('categories', 'products.category_id', '=', 'categories.id')
                  ->orderBy('categories.name', 'asc')
                  ->get();
```

This query explicitly tells the database: "Find all products, join them to their categories, and then sort the final result set based on the category name." This leverages the database engine for superior performance, especially with large datasets.

### Solution 2: Using Eloquent Relationships for Sorting (Advanced)

While direct joins are powerful, sometimes you want to keep the query strictly within the Eloquent paradigm. For sorting by a relationship attribute, you can leverage `whereHas` or more complex scoping if you need filtering alongside ordering. However, for simple relational ordering, the explicit join method above is often the clearest route.

If you needed to filter *only* products belonging to categories starting with 'A', you would combine it:

```php
$products = Product::join('categories', 'products.category_id', '=', 'categories.id')
                  ->where('categories.name', 'LIKE', 'A%')
                  ->orderBy('categories.name', 'asc')
                  ->get();
```

## Conclusion

Sorting related data in Eloquent requires understanding the distinction between **eager loading** (fetching related data efficiently) and **query ordering** (sorting the primary result set). For sorting a collection of parent models based on attributes in their related tables, the most robust and performant solution is to utilize explicit `join()` operations directly on the query builder.

By mastering these foundational techniques, you can write cleaner, more efficient, and more readable database interactions. As we continue to explore the power of Laravel, remember that optimizing your queries is key to building scalable applications, much like the principles discussed at [https://laravelcompany.com](https://laravelcompany.com).
