---
title: "How to check object of a model is empty in laravel?"
description: "How to Check if an Eloquent Model Collection is Empty in Laravel: The Developer's Guide As developers working with Laravel and Eloquent, retrieving data from..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel and Eloquent, retrieving data from the database often results in collections. When you use methods like `get()` on a query that returns no matching records, you don't get `null`; you get an empty **Collection** object. This is where many developers run into subtle logical traps when trying to determine if there are actual items present.

The scenario you described—where `$persons` is an Eloquent Collection but evaluating it in an `if` statement seems misleading—is a very common point of confusion rooted in how PHP and Laravel handle object truthiness versus collection emptiness.

This post will break down why your initial check didn't work as expected and provide the most robust, idiomatic ways to check if your Eloquent model collection is empty.

---

## Understanding the Eloquent Collection Behavior

When you execute a query like this:

```php
$persons = WysPerson::where('family_id', $id)->get();
```

Laravel executes the query and returns an instance of `Illuminate\Database\Eloquent\Collection`. Even if zero rows are found, the resulting object itself exists in memory. In PHP, any instantiated object is considered "truthy" when evaluated in a boolean context (like an `if` statement), regardless of its internal contents.

Your original check:
```php
if($persons){
    // This block runs because $persons is an object, even if it's empty.
}
```
This check only verifies that the variable `$persons` has been successfully populated with *some* object, not that it contains any actual records.

To correctly determine if there are zero results, we must specifically interrogate the collection itself.

## Method 1: The Idiomatic Laravel Solution – Using `isEmpty()`

The most readable and idiomatic way to check if an Eloquent Collection has no items is by using its built-in `isEmpty()` method. This method directly addresses the intent of your code—checking for emptiness—making your intent crystal clear to any future reader.

```php
$persons = WysPerson::where('family_id', $id)->get();

if ($persons->isEmpty()) {
    // The collection is empty, no records were found.
    echo "No persons found for this ID.";
} else {
    // The collection contains one or more records.
    foreach ($persons as $person) {
        echo $person->name . "\n";
    }
}
```

This approach is highly preferred because it leverages the framework's specific methods, promoting better code maintainability and readability. This aligns perfectly with the principles of clean architecture championed by modern Laravel development practices, similar to how we structure our data interactions on platforms like [laravelcompany.com](https://laravelcompany.com).

## Method 2: The Standard PHP Solution – Checking the Count

A universally reliable alternative is to check the count of the collection. If the count is zero, the collection is empty. This method works in any context and is extremely performant as it relies on a simple integer comparison.

```php
$persons = WysPerson::where('family_id', $id)->get();

if ($persons->count() === 0) {
    // The count is zero, meaning no results were returned.
    echo "No persons found for this ID.";
} else {
    // Records exist.
    echo "Found " . $persons->count() . " persons.";
}
```

While slightly more verbose than `isEmpty()`, checking the count is a solid backup strategy, especially when dealing with complex conditional logic or when you need to retrieve the actual number of results immediately after the check.

## Conclusion: Choosing the Right Tool

In summary, while your initial attempt failed because PHP treats objects as truthy containers, the correct solution lies in inspecting the collection's contents directly.

1.  **For readability and idiomatic Laravel code:** Use `$persons->isEmpty()`.
2.  **For maximum compatibility and explicit counting:** Use `$persons->count() === 0`.

Always favor methods that clearly convey your intention to other developers. By adopting these practices, you ensure your data layer is not only functional but also clear, robust, and maintainable. Keep building great applications with Laravel!
