---
title: "Laravel Eloquent disable automatic lazy loading"
description: "Laravel Eloquent: Understanding and Managing Automatic Lazy Loading Laravel’s Eloquent ORM is a masterpiece of expressive power, allowing developers to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

Laravel’s Eloquent ORM is a masterpiece of expressive power, allowing developers to interact with the database using intuitive PHP objects. A core feature that enables this flexibility is **lazy loading**, where relationships are only loaded from the database when they are explicitly accessed. While this approach offers convenience for simple queries, it can lead to significant performance bottlenecks if not managed correctly, particularly in complex applications.

This post dives into the automatic lazy loading behavior in Eloquent, explores why it can cause issues like the infamous N+1 query problem, and demonstrates the proper, performant way to manage relationships in Laravel.

## The Performance Pitfall: The N+1 Query Problem

Laravel’s default behavior of lazy loading is designed for convenience. When you define a relationship (e.g., `Post` has an `Author`), Eloquent doesn't immediately fetch the author data when you retrieve the posts. Instead, it waits until you try to access `$post->author`, at which point it executes a separate query to fetch that specific author.

Consider the following scenario:

```php
// Scenario demonstrating the N+1 issue
$posts = Post::published()->get(); // Query 1: Fetches all posts

foreach ($posts as $post) {
    // Inside the loop, accessing the relationship triggers a new query for *each* post.
    echo $post->author->name; // Queries 2, 3, 4, ... N
}
```

As you can see, if you load 100 posts, Eloquent will execute 1 initial query for the posts, plus 100 subsequent queries to fetch the author for each post. This pattern—one initial query plus $N$ related queries—is known as the N+1 problem. In high-traffic applications, this results in excessive database load and severely degrades performance.

## Disabling Lazy Loading: A Misguided Approach

The question arises: Is there a simple flag or method to disable this automatic lazy loading entirely? Unfortunately, **disabling the underlying mechanism of Eloquent's relationship handling is not a practical or recommended solution.**

Eloquent’s design philosophy is to defer data retrieval until it is explicitly requested. Trying to force a global switch to disable this behavior would undermine the flexibility that makes Eloquent so powerful. Instead of fighting the system, the correct approach is to master *when* and *how* you load the data to ensure efficiency.

## The Solution: Mastering Eager Loading

The proper developer solution for avoiding the N+1 problem is **Eager Loading**. Eager loading tells Eloquent to fetch all necessary related models in advance using optimized queries (usually `JOIN`s or two separate, highly efficient `WHERE IN` clauses). This transforms $N+1$ slow queries into just 1 or 2 fast queries.

You achieve this by using the `with()` method:

```php
// The Efficient Solution using Eager Loading
$posts = Post::published()
    ->with('author') // Instruct Eloquent to load the 'author' relationship in advance
    ->get();

foreach ($posts as $post) {
    // Now, accessing the author is instantaneous because the data was already loaded.
    echo $post->author->name; 
}
```

By using `with('author')`, Eloquent executes a single query to fetch all relevant posts and then a single additional optimized query to fetch *all* associated authors, eliminating the performance hit of repeated lookups. This practice is fundamental to writing scalable Laravel applications, adhering to the architectural principles championed by the **Laravel company**.

## Conclusion

While Eloquent’s lazy loading mechanism is convenient for small scripts, treating it as a default setting in production code is a recipe for slow performance. As senior developers, our focus must shift from disabling features to optimizing their usage. By consistently adopting eager loading techniques like `with()`, we ensure that our database interactions are efficient, scalable, and maintain the high performance expected of a robust Laravel application.
