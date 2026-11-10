---
title: "laravel access model properties"
description: "Mastering Eloquent Access: How to Retrieve Model Properties from Queries As a senior developer working with Laravel and Eloquent, you frequently encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel and Eloquent, you frequently encounter scenarios where accessing data via the Query Builder or collection methods seems straightforward, but you run into unexpected issues when trying to access properties on the resulting objects. This often stems from a misunderstanding of what Eloquent returns—specifically, the difference between a single Model instance and an Eloquent Collection.

This post addresses a very common pain point: how to correctly access model properties when querying by custom fields like `alias`, especially when dealing with collections.

---

## The Eloquent Access Dilemma: Model vs. Collection

The issue you are facing arises because the object returned by different Eloquent methods behaves differently regarding property access.

When you use methods like `find($id)` or `findOrFail($id)`, Eloquent returns a single **Eloquent Model** instance. Models, being instances of your defined classes (e.g., `Category`), naturally expose properties like `$title` directly.

```php
// This works perfectly because it returns a single Model instance
$cat = Category::find(1);
return $cat->title; // Success!
```

However, when you use methods that retrieve multiple results—such as `where()->get()`, `paginate()`, or `all()`—Eloquent returns an **`Illuminate\Database\Eloquent\Collection`**. A Collection is a container for multiple Eloquent Models. Collections themselves do not have properties like `title`; they contain the models, and you must access the individual items within them.

When you attempt to access `$cat->title` on a collection object (e.g., `$cat = Category::where('alias', 'vodosnab')->get();`), PHP throws an error because the Collection class does not define a `title` property.

```php
// This throws an exception because $cat is a Collection, not a Model
$cat = Category::where('alias', 'vodosnab')->get();
return $cat->title; // Throws: Undefined property: Illuminate\Database\Eloquent\Collection::$title
```

## Solution 1: Accessing Single Records Correctly

If your intent is to retrieve only one record based on a specific condition, stick to methods designed for single retrieval. `first()` or `firstOrFail()` are the correct tools here.

```php
// Best practice for retrieving a single model by criteria
$cat = Category::where('alias', 'vodosnab')->first();

if ($cat) {
    return $cat->title; // Accessing property directly on the Model instance
} else {
    return null;
}
```

## Solution 2: Iterating Over Collections to Access Data

If your query is expected to return multiple results (a collection), you cannot access a single property directly from the collection. You must iterate over the collection to access the properties of each model within it. This approach ensures you are working with valid Eloquent models at every step, which aligns perfectly with best practices for data retrieval in Laravel.

```php
// Retrieve all matching categories
$categories = Category::where('alias', 'vodosnab')->get();

// Iterate to access the properties of each model
foreach ($categories as $category) {
    echo "Found category title: " . $category->title . "\n";
}

// Or, if you need an array of just the titles:
$titles = $categories->pluck('title');
```

## Best Practices for Efficient Queries

When building custom queries using fields like `alias`, always focus on efficiency. If you only need specific columns, use the `select()` method to prevent loading unnecessary data from the database into memory. This practice is crucial when dealing with large datasets and keeps your application lean, which is a core principle in building robust applications on Laravel. For more advanced Eloquent features and patterns, exploring resources like those found at [https://laravelcompany.com](https://laravelcompany.com) is highly recommended.

## Conclusion

The confusion between accessing properties on a single Model instance versus an Eloquent Collection is a classic hurdle for many developers. The key takeaway is that **Collections are containers; Models are the actual data objects.** Always check what method you used (`find`/`first` vs. `get`) to determine what object you are working with before attempting property access. By iterating over your results, you ensure type safety and maintain clean, predictable code, making your application more stable and easier to debug.
