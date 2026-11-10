---
title: "Sorting data with Eloquent"
description: "Sorting Data with Eloquent: Mastering Nested Relationships I'm new to Laravel (switched from CI) and Eloquent ORM is still a bit of a mystery at some point!..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

I'm new to Laravel (switched from CI) and Eloquent ORM is still a bit of a mystery at some point!

When you start working with Object-Relational Mappers like Eloquent, the real power often lies not just in fetching data, but in how you use the relationships to construct complex queries. Today, we're going to tackle a very common scenario: sorting parent records based on data within their related child records. This is where Eloquent truly shines, allowing us to write expressive, readable code instead of dropping into raw SQL every time.

## The Scenario: Sorting Posts by Comment Activity

Let's set up the context you described. We have `posts` and `comments`. A user wants to retrieve all posts they have created, but they want these posts to be ordered based on when the comments on those posts were created.

**Goal:** Retrieve all `posts` belonging to a specific `$user`, ordered by the `created_at` of their associated `comments`.

## Setting Up Eloquent Relationships

Before diving into the query, we must ensure our models are correctly set up with the necessary relationships. This is the foundation of using Eloquent effectively.

In your `Post` model:
```php
// app/Models/Post.php

public function comments()
{
    return $this->hasMany(Comment::class);
}
```

And in your `Comment` model:
```php
// app/Models/Comment.php

public function post()
{
    return $this->belongsTo(Post::class);
}
```

## The Eloquent Solution: Ordering Through Relationships

Since we need to sort the parent `posts` based on a property of the related `comments`, we will use a combination of `whereHas` (to filter posts that actually have comments) and `orderBy` combined with the relationship.

The key is to tell Eloquent exactly which relationship branch to use for sorting. We want to order the posts by the *earliest* or *latest* comment time associated with them.

Here is how you structure the query:

```php
use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $posts = Post::whereHas('comments', function (Builder $query) use ($userId) {
            // Filter comments to only those belonging to the current user
            $query->where('user_id', $userId);
        })
        // Now, order the resulting posts based on the related comment's created_at
        ->with('comments') // Eager load the comments for convenience
        ->orderBy('comments.created_at', 'asc') // Order by the comment time
        ->whereHas('comments', function (Builder $query) use ($userId) {
            // Ensure we only consider posts that have at least one relevant comment
            $query->where('user_id', $userId);
        })
        ->with('comments') // Eager load the comments again if needed, or just rely on the initial load
        ->get();

        return view('posts.index', compact('posts'));
    }
}
```

### Explanation of the Fluent Approach

1.  **`whereHas('comments', function (Builder $query) use ($userId) { ... })`**: This is crucial. It filters the `posts` table to only include posts that have at least one related record in the `comments` table matching our criteria (i.e., a comment made by `$userId`).
2.  **`orderBy('comments.created_at', 'asc')`**: Once filtered, we apply the ordering. Because we are using a relationship (`comments`) within the scope of the query builder, Eloquent knows exactly which table to reference for sorting. We explicitly tell it to sort by the `created_at
