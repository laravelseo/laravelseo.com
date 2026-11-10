---
title: "Set Laravel Eloquent model's to eager load by default"
description: "Set Laravel Eloquent Models to Eager Load by Default: Mastering Query Optimization Laravel’s Eloquent ORM is a powerful tool, but like any ORM, its default..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

Laravel’s Eloquent ORM is a powerful tool, but like any ORM, its default behavior—lazy loading—can lead to significant performance bottlenecks, especially as applications scale and experience high traffic. This post dives into why this happens and explores practical strategies for ensuring efficient database interactions in your Laravel application.

## The Performance Pitfall of Lazy Loading

By default, Eloquent models use lazy loading. This means that when you access a relationship on a model (e.g., `$user->posts`), the necessary query to fetch those posts is executed *at that moment*. If you iterate over many models, this results in the infamous N+1 query problem: one initial query for the main models, and then $N$ additional queries inside the loop to fetch related data.

As you observed, this behavior can drastically increase database load during high-traffic periods. While systems like older frameworks might handle this more gracefully under stress, modern, high-throughput applications demand proactive query optimization. As we explore best practices for building robust applications, understanding these performance nuances is crucial, aligning with the principles of efficient software design promoted by platforms like [laravelcompany.com](https://laravelcompany.com).

## Eager Loading: The Essential Solution

Eager loading solves the N+1 problem by instructing Eloquent to fetch all necessary related data in as few queries as possible—typically just two or three highly efficient queries, regardless of the number of relationships being loaded. This is achieved using the `with()` method.

Here is a simple comparison:

**Lazy Loading (Inefficient):**
```php
$user = User::find(1); // Query 1
foreach ($user->posts as $post) {
    // Inside the loop, this triggers a new query for every post!
    echo $post->title; 
}
```

**Eager Loading (Efficient):**
```php
$user = User::with('posts')->find(1); // Fetches user and all posts in two queries.
foreach ($user->posts as $post) {
    // Data is already loaded in memory, no extra database hit!
    echo $post->title; 
}
```

## Enforcing Eager Loading for Development Environments

The core challenge you identified is how to ensure that developers *always* use eager loading, especially during development and debugging, rather than accidentally introducing N+1 issues. While Eloquent does not have a global setting to force eager loading on every query, we can implement architectural patterns to make it the default expectation.

### Strategy 1: Custom Repository or Service Layer

The most robust approach is to abstract data fetching away from the controller and into dedicated service classes or repositories. These layers become the single source of truth for how data is retrieved.

In these layers, you mandate that all methods return data using eager loading by default.

```php
// Example in a Repository
public function findUserWithPosts(int $userId)
{
    return User::with('posts')->find($userId);
}
```
By forcing developers to use this method, you ensure that complex data relationships are handled correctly from the start, preventing accidental lazy loading errors across the application.

### Strategy 2: Global Scopes for Conditional Loading

For scenarios where you want to conditionally apply eager loading based on context (e.g., only load relationships when viewing a specific dashboard), Laravel's Global Scopes are immensely helpful. You can define scopes that automatically attach `with()` clauses to queries, keeping your data retrieval standardized across the application. This practice promotes cleaner code and better adherence to performance standards, which is vital for maintaining high-performance applications on the [laravelcompany.com](https://laravelcompany.com) ecosystem.

## Conclusion

Moving from lazy loading to intentional eager loading is a fundamental shift in how we approach database interaction in Laravel. While you cannot globally force Eloquent to *only* use eager loading, by implementing architectural patterns—such as dedicated service layers or global scopes—you can effectively enforce this best practice. This proactive approach minimizes unnecessary database calls, drastically improves application response times, and ensures your Laravel application remains fast and stable, even under heavy load.
