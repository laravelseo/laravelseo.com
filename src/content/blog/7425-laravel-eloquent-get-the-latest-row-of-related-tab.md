---
title: "Laravel eloquent get the latest row of related table"
description: "Laravel Eloquent: Getting the Latest Related Row Efficiently As senior developers working with Laravel and Eloquent, we constantly face scenarios where we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with Laravel and Eloquent, we constantly face scenarios where we need to fetch related data based on a specific constraint—in this case, retrieving only the *latest* related record. This often leads to complex eager loading questions, especially when dealing with `hasMany` relationships.

Today, we are diving into a common challenge: how to elegantly retrieve a list of books along with only their single, most recently updated chapter using a single query, avoiding unnecessary data fetching.

## The Challenge: Eager Loading the Latest Record

You have a standard one-to-many relationship between `Book` and `Chapter`. You want to load the book data and, for each book, only include the chapter that has the highest `updated_at` timestamp.

Your initial attempt using a constrained eager load looked like this:

```php
$books = Book::with(['chapters' => function($q) {
    $q->orderBy('updated_at', 'desc')->first();
}])->get();
```

As you discovered, while this pattern is powerful for constraining relationships, it often fails when dealing with `hasMany` relationships in the eager loading context. The issue stems from how Eloquent attempts to resolve the one-to-many relationship during the eager load: it expects a collection of related models, not a single constrained result, leading to empty collections or unexpected behavior.

The desire to use a simple `JOIN` structure is understandable, but as we will see, forcing this constraint purely through a standard `JOIN` often results in duplicate book rows and requires complex aggregation that isn't always cleaner than dedicated Eloquent methods.

## Solution 1: The Optimized Eloquent Approach (Using Subqueries)

While the direct constrained eager loading method failed, there are more robust ways to achieve this efficiency. Instead of trying to force a subquery onto a `hasMany` relationship load, we can use a technique that isolates the latest chapter IDs first and then fetch them.

A highly effective pattern involves finding the maximum related ID for each parent record and then fetching those specific records separately or using advanced aggregation. However, for this exact requirement (latest instance), a more direct approach often involves leveraging raw queries or dedicated query patterns.

If you absolutely must load it via eager loading, a slightly adjusted approach focusing on finding the latest chapter *per book* is necessary:

```php
$books = Book::with(['latest_chapter' => function ($query) {
    $query->select('chapters.*')
          ->orderBy('updated_at', 'desc')
          ->limit(1);
}])->get();
```
**Note:** This assumes you have a specific relationship named `latest_chapter` defined on the `Book` model, which points to a `belongsTo` relationship linking only to the latest chapter. If you need to load the actual `Chapter` model instance directly, see Solution 2.

## Solution 2: The Efficient SQL Approach (Using `JOIN` and Aggregation)

When the goal is purely data retrieval based on a maximum value across joined tables, a carefully constructed `JOIN` combined with aggregation (`GROUP BY`) is often the most performant method, especially for complex reporting. This avoids the overhead of loading full Eloquent models if you only need specific fields.

To get the book and its single latest chapter in one result set:

```php
$results = DB::table('books')
    ->join('chapters', 'books.id', '=', 'chapters.book_id')
    ->select('books.*', 'chapters.*')
    ->orderBy('books.id')
    // This part finds the latest chapter for each book group
    ->selectRaw("ROW_NUMBER() OVER(PARTITION BY books.id ORDER BY chapters.updated_at DESC) as rn")
    ->get();

// Post-processing to select only the latest:
$latestBooks = $results->filter(function ($row) {
    return $row->rn === 1;
});
```

This SQL approach, utilizing window functions like `ROW_NUMBER()`, is extremely powerful for finding rank-based data within groups. While this moves away from pure Eloquent model loading and into raw database interaction, it delivers the single query efficiency you were seeking by letting the database handle the complex sorting and filtering directly. This principle of optimizing data retrieval is central to building high-performance applications, much like the architecture promoted by platforms such as [Laravel Company](https://laravelcompany.com).

## Conclusion: Choosing the Right Tool for the Job

The dilemma between constrained eager loading and explicit joins highlights a core philosophy in software development: **Don't force a relationship structure if it complicates data retrieval.**

1.  **For simple relationships:** Stick to Eloquent's built-in `with()` methods. If the constraint is complex (like finding the "latest"), you might need to use dedicated scope methods or pre-calculate the necessary IDs before loading.
2.  **For complex reporting/maximum value retrieval:** When you need the absolute fastest way to find a single related record based on sorting criteria across tables, leveraging optimized SQL constructs like `JOIN` and window functions (as shown above) often provides superior performance and clarity over trying to force Eloquent's eager loading mechanisms into that specific mold.

By understanding when to rely on Eloquent's abstraction versus when to leverage the power of raw SQL, you can write cleaner, faster, and more maintainable Laravel applications.
