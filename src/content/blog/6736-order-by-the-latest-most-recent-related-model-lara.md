---
title: "Order by the latest (most recent) related model [Laravel]"
description: "Order by the Latest (Most Recent) Related Model in Laravel: Mastering Nested Ordering As developers working with relational data in frameworks like Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

As developers working with relational data in frameworks like Laravel, one of the most common and challenging tasks is ordering parent models based on the latest creation time of their related child models. This scenario frequently arises when displaying lists, such as forum threads, where you want the list sorted not by the thread's creation date, but by the activity within that thread—specifically, the date of the most recent reply or post.

In this comprehensive guide, we will dissect your specific problem involving Laravel Eloquent relationships and demonstrate the most efficient way to order your `threads` based on their latest associated `posts`.

## Understanding the Challenge in Eloquent

You have a classic one-to-many relationship structure: `Thread` has many `Post`s. You want to sort the threads based on the timestamp of the *latest* post within that thread.

Your existing setup involves eager loading and custom scoping, which is a great start. The difficulty lies in applying an ordering constraint derived from the related model back onto the parent query. Simply sorting by `$thread->created_at` will not achieve the desired result; you need access to the `posts` table's data during the main sort operation.

We are aiming for this outcome: Sort the threads based on the maximum `created_at` value found in their related `posts`.

## The Solution: Using Subqueries and Eloquent Ordering

To achieve this complex ordering, we need to leverage Eloquent's ability to handle nested queries or subqueries within the main `orderBy` clause. This technique allows us to find the maximum post date for each thread and use that value for sorting the results.

### Step 1: Refined Eager Loading (Preparation)

First, ensure your eager loading is correctly set up to retrieve the necessary data alongside the ordering mechanism. As you have already done with the `latest()` constraint within the closure, we keep this structure, as it efficiently fetches only the most relevant posts for display later.

### Step 2: Implementing the Latest Post Ordering

Instead of sorting directly on `$threads`, we will use a technique that orders the main query by a calculated value derived from the related posts. This is often accomplished using `whereHas` or a more direct approach if available, but for complex ordering based on nested maximums, a subquery approach within the `orderBy` clause is most robust.

Since you want to sort by the latest post date, we will order the threads by the maximum `created_at` of their associated posts in descending order (latest first).

Here is how you can modify your controller logic in `ThreadsController@index`:

```php
public function index()
{
    $threads = $this->forum->threads()
        ->approved()
        ->withCount(['posts AS approved_replies' => function ($query) {
            $query->where('posts.approved', true)->where('posts.is_starting_thread', false);
        }])
        // Eager load the necessary posts, ensuring we get the latest one for display later
        ->with(['posts' => function ($query) { 
            $query->where('approved', true) // Ensure only approved posts are considered
                  ->with('user')
                  ->latest(); // Get the latest post first within this relationship
        }])
        ->with('user') // Author of thread
        // *** THE CRITICAL STEP: Ordering by the latest post's creation date ***
        ->orderByDesc(DB::raw('MAX(posts.created_at)')) 
        ->paginate(20); 

    return view('forums.threads.index')->with([
        'forum' => $this->forum, 
        'threads' => $threads
    ]);
}
```

### Explanation of the Key Change

The magic happens with this line: `->orderByDesc(DB::raw('MAX(posts.created_at)'))`.

1.  **`DB::raw(...)`**: This tells Eloquent that we are not sorting by a standard column but by the result of a raw SQL expression.
2.  **`MAX(posts.created_at)`**: This SQL function calculates the single latest timestamp from the `posts` table for the current thread being evaluated.
3.  **Grouping Implication**: Because this is used in the main query's ordering, the database implicitly groups the results by the thread ID and sorts based on the maximum post date found within that group.

This approach effectively sorts your threads based on when the most recent activity occurred within them, giving you exactly the "order by the latest related model" functionality you require. This level of complex querying is a core strength of Laravel's Eloquent when combined with raw SQL capabilities. For more advanced relationship management and query building, exploring resources like [laravelcompany.com](https://laravelcompany.com) will keep you updated on the best practices for database interaction in PHP.

## Conclusion

By combining thoughtful eager loading (using `latest()`) with advanced ordering techniques utilizing `DB::raw('MAX(...)')`, you can solve complex relational sorting problems efficiently within Laravel. This method ensures that your displayed list of threads is always ordered by their most recent activity, providing a much more dynamic and context-aware user experience. Remember to always aim for readable, maintainable code, and feel free to dive deeper into the vast ecosystem offered by [laravelcompany.com](https://laravelcompany.com) as you continue your development journey.
