---
title: "How to paginate a collection after get() in Laravel?"
description: "How to Paginate a Collection After merge() in Laravel: Mastering Complex Data Sets As developers working with large datasets, one common challenge arises:..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As developers working with large datasets, one common challenge arises: combining results from multiple queries before applying pagination. When you merge two separate collections using methods like `merge()`, you create a single result set that doesn't inherently understand the context of the original database query limits. This often leads to complex manual steps for pagination, as demonstrated by the approach you presented.

This post will dive into how to handle this scenario efficiently in Laravel, exploring both the manual method and the more idiomatic Eloquent solutions.

## The Challenge: Merging Queries Before Pagination

Imagine you need data from two distinct sets of events—for instance, events that are "upcoming" and events that are "expired"—and you want to present them in a single, paginated list.

Your initial approach involves fetching these two sets separately and merging them:

```php
$events1 = \App\Event::Where('valid_to', '>=', $today)
                   ->orderByRaw('valid_to', 'ASC')
                   ->get();

$events2 = \App\Event::Where('valid_to', '<', $today)
                   ->orderByRaw('valid_to', 'ASC')
                   ->get();

$events = $events1->merge($events2); 
```

Now, the goal is to paginate this combined `$events` collection. While your suggested method using `LengthAwarePaginator` works, it requires manually calculating the total count and managing the pagination structure. We need to explore why this approach exists and what better alternatives Laravel offers.

## Method 1: The Manual Approach (The Direct Implementation)

When you perform a complex operation like merging two independent queries, the resulting collection is just a PHP array of models; it has no inherent relationship with the original database constraints used for filtering. Therefore, applying pagination manually is necessary if you must keep the merged result as a separate entity.

Here is how you correctly apply pagination to your merged set:

```php
$page = 1;
$perPage = 60;

// Calculate total count and create the paginator manually
$totalItems = $events->count();

$pagination = new \Illuminate\Pagination\LengthAwarePaginator(
    $events->forPage($page, $perPage), 
    $totalItems, 
    $perPage, 
    $page
);

// $pagination now holds the paginated result
```

**Analysis:** While this code successfully produces a paginated view, it shifts the responsibility of managing state (count, current page, items) entirely to your application logic. This method is effective when the data merging logic is highly specific and cannot be simplified into a single database query. However, for most standard Laravel applications, we aim to let Eloquent handle this complexity directly.

## Method 2: The Idiomatic Eloquent Solution (The Preferred Way)

The most robust and efficient way to handle pagination in Laravel is by letting the underlying database engine do the heavy lifting. Instead of fetching data separately and merging it in PHP, we should attempt to construct a single query that satisfies all necessary conditions before calling `paginate()`.

If your requirement involves combining results based on different temporal states (like "before today" vs. "after today"), you can often achieve this using complex `where` clauses or database functions.

For example, if the goal is simply to retrieve all events, ordered by date, and then paginate them, a single query suffices:

```php
$events = \App\Event::orderBy('valid_to', 'ASC')->paginate(60); 
```

If the requirement *absolutely* demands merging two distinct sets based on complex, non-overlapping conditions (like your `merge` example), you might need to adjust how you define your data scope. If the merge is purely additive (e.g., "give me all events that are valid in either period"), try restructuring your filtering logic into a single query using OR operators:

```php
$events = \App\Event::where(function ($query) use ($today) {
    $query->where('valid_to', '>=', $today)
          ->orWhere('valid_to', '<', $today);
})->orderByRaw('valid_to', 'ASC')->paginate(60); 
```

This single query is far more efficient because the database handles the filtering and sorting, minimizing data transfer before pagination is applied. This aligns perfectly with the principles of building performant applications within the Laravel ecosystem, as promoted by resources like those found at [https://laravelcompany.com](https://laravelcompany.com).

## Conclusion

While manually constructing a `LengthAwarePaginator` after using `merge()` provides a functional outcome, it is generally an overly complex workaround for data retrieval tasks in Laravel. As senior developers, our goal should always be to utilize the power of the Eloquent Query Builder and the underlying SQL engine whenever possible. By refactoring requirements to leverage single, optimized queries—even when dealing with merged concepts—you ensure that your application remains scalable, readable, and highly performant. Always favor database optimization over post-retrieval manipulation.
