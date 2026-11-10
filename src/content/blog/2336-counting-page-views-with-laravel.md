---
title: "Counting page views with Laravel"
description: "Moving Beyond Sessions: Robust Page View Counting in Laravel Implementing tracking mechanisms, like page view counters, is a common requirement for any..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

Implementing tracking mechanisms, like page view counters, is a common requirement for any application. The method you’ve implemented using Laravel sessions is functional for simple, single-user tracking, but as an application scales, relying on session storage introduces significant architectural and performance bottlenecks. As a senior developer, my goal is to show you how to evolve this pattern into a robust, scalable, and efficient solution using the power of the Laravel framework and its underlying database.

## The Pitfalls of Session-Based Counting

Your current approach relies on storing view counts in the session:

```php
// Current Method Snippet
$viewed = Session::get('viewed_post', []);
if (!in_array($post->id, $viewed)) {
    $post->increment('views'); // This increments a property on the Post model, but relies on external state management.
    Session::push('viewed_post', $post->id);
}
```

While this works for small applications, it has several drawbacks:

1.  **Scalability Issues:** Session data is tied to the specific user session and can become cumbersome if you need to track views across multiple devices or if the application requires persistence outside of a single user's active session.
2.  **Data Integrity:** If sessions expire or are cleared, your view counts are lost or become inconsistent.
3.  **Inefficient Aggregation:** Retrieving "popular posts" requires querying the entire `posts` table and then performing complex logic based on potentially scattered session data, which is slow for large datasets.

## The Recommended Approach: Database-Centric Tracking

For any quantifiable metric like page views, the definitive source of truth should reside in your database. Moving the counting mechanism to the database ensures atomicity, persistence, and efficient querying. This aligns perfectly with Laravel's Eloquent capabilities.

The best practice here is to introduce a separate pivot or statistics table to record view events.

### Step 1: Create a View Log Table

We will create a dedicated `post_views` table to log every view event.

```php
Schema::create('post_views', function (Blueprint $table) {
    $table->id();
    $table->foreignId('post_id')->constrained()->onDelete('cascade');
    $table->timestamps(); // Record when the view occurred
});
```

### Step 2: Implement the View Logging Logic

Instead of updating a session, you simply record the event in the database. This operation is atomic and highly efficient.

```php
use App\Models\Post;
use App\Models\PostView; // Assuming you create a model for this table

public function showpost($titleslug) {
    $post = Post::where('titleslug', $titleslug)->firstOrFail();

    // Log the view event in the database
    PostView::create(['post_id' => $post->id]);

    return view('posts/show', compact('post'));
}
```

## Finding Popular Posts: Efficient Aggregation

With this structure, retrieving popular posts becomes trivial and extremely fast. You can now query the `post_views` table directly to get accurate counts.

To find the most viewed posts overall:

```php
$popularPosts = Post::withCount('postViews')
                   ->orderBy('post_views_count', 'desc')
                   ->take(10)
                   ->get();
```

The `withCount('postViews')` method is a powerful Eloquent feature that efficiently performs a `LEFT JOIN` and aggregation in a single database query, which is far superior to iterating through session data. This pattern of leveraging Eloquent relationships for aggregation is central to effective Laravel development, as seen in many advanced examples on the official documentation provided by [laravelcompany.com](https://laravelcompany.com).

## Tracking Views in the Last 24 Hours

To address your specific requirement—finding posts viewed in the last 24 hours—we
