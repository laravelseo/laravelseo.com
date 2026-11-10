---
title: "Laravel query builder returns object or array?"
description: "Laravel Query Builder: Object vs. Array – Understanding get() vs. first() As developers working with the Laravel framework, we frequently interact with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with the Laravel framework, we frequently interact with the Eloquent ORM and the underlying Query Builder. One area that often causes confusion is understanding the difference between methods like `get()`, `first()`, and `find()`, especially when dealing with retrieving single records versus collections of data. This distinction directly impacts the type of PHP object or array you receive back, which can lead to subtle bugs if not understood correctly.

I’ve seen scenarios, much like the one described in your example involving separate controllers fetching related data from the same database table, where developers encounter this exact ambiguity. Let's break down why `get()` and `first()` behave differently and establish best practices for retrieving data efficiently in Laravel.

## The Mechanics of Query Results

The core difference between these methods lies in what they are designed to return: a collection versus a single item. When you use the Query Builder (or Eloquent), the result set is processed based on the method called:

1.  **`get()`:** This method always returns a **Collection** (which behaves like an array in PHP). Even if your query is guaranteed to return only one row, `get()` will wrap that single result inside an array structure.
2.  **`first()`:** This method specifically requests the *first* record found. If a record exists, it returns that record as a standard **Object**. If no record is found, it returns `null`.

This difference dictates how you access the data in your application logic:

*   If you use `$result = $query->get()`, then `$result` will be an array (or Collection), and you access elements using array notation (e.g., `$result[0]->name`).
*   If you use `$result = $query->first()`, then `$result` will be a single object, and you access properties directly (e.g., `$result->name`).

## Applying the Concepts to Your Scenario

In your specific case, where you need a single related `workout` object in both controllers:

**Scenario 1: ProfileController (Fetching a single workout based on user ID)**
You are looking for one specific record. Using `first()` is semantically clearer and more efficient because it stops querying the database as soon as it finds the first match, minimizing overhead compared to fetching an entire collection.

```php
// Preferred way for fetching a single related item:
$workout = DB::table('workouts')
            ->where('user_id', '=', $user->id)
            ->first(); // Returns a single object or null
```

**Scenario 2: WorkoutController (Fetching a specific workout by name)**
Similarly, if you are searching for one unique item by a criteria (
