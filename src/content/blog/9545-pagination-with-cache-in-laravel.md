---
title: "Pagination with cache in Laravel"
description: "Mastering Pagination Caching in Laravel: Avoiding Stale Data Pitfalls Can anyone help me? I use Redis cache. But I see the same results on every page when I..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

Can anyone help me? I use Redis cache. But I see the same results on every page when I use pagination. How can I fix it? Thanks.

As a senior developer working with Laravel and caching solutions like Redis, this is an extremely common and frustrating issue. When you implement pagination, you are dealing with dynamic data sets based on `LIMIT` and `OFFSET`. If you simply cache the entire result set without accounting for these parameters, your cache becomes static, serving the same slice of data to every user regardless of what they request.

This post will dive deep into why this happens and provide robust solutions using Laravel's features to ensure your cached pagination is always fresh and accurate.

---

## The Root Cause: Static Caching vs. Dynamic Pagination

The problem usually stems from how you define your cache key. If you simply cache the result of a query like `Cache::put('all_posts', $posts)`, every request for page 1, page 2, or page 3 will hit that single key and receive the same data, effectively bypassing the pagination logic on subsequent requests.

The core principle is: **A unique cache entry must be generated for every unique query.** Since pagination relies on variables (`page` number and `per_page` count), these variables *must* be part of your cache key.

## Solution 1: Dynamic Cache Key Generation

To fix this, you need to construct a unique cache key that incorporates the pagination parameters. This ensures that each page request results in a distinct cached item.

Instead of caching a generic identifier, construct a key based on the query context. For example, if you are fetching posts with 10 items per page on page 2, your cache key should reflect that specificity.

Here is a conceptual example showing how to structure this logic within a controller or service layer:

```php
use Illuminate\Support\Facades\Cache;
use App\Models\Post;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        // 1. Construct a unique key based on pagination parameters
        $cacheKey = 'posts_page_' . $page . '_per_' . $perPage;

        // 2. Attempt to retrieve from cache
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey); // Cache Hit!
        }

        // 3. If not found, perform the database query
        $posts = Post::paginate($perPage);

        // 4. Store the result in the cache with the unique key
        Cache::put($cacheKey, $posts, now()->addMinutes(5)); // Cache for 5 minutes

        return $posts;
    }
}
```

By dynamically building `$cacheKey`, you ensure that when a user requests page 2, the system looks for `posts_page_2_per_10` instead of just `all_posts`. This forces Redis to store and retrieve the correct, specific result set.

## Solution 2: Caching Data Pre-Pagination (Advanced)

For extremely high-traffic applications, caching the final paginated Eloquent object might be less efficient than caching the raw data. An alternative, more robust approach is to cache the *raw results* from the database and handle the pagination logic within your application layer whenever a cache miss occurs.

If you are using Laravel's powerful Eloquent features, ensure you are leveraging proper query scoping before hitting the cache. For complex operations involving Eloquent models, understanding how data retrieval flows is key; this aligns perfectly with best practices outlined by the team at [laravelcompany.com](https://laravelcompany.com).

## Conclusion: Consistency Through Context

The confusion surrounding repeated results in cached pagination is a classic caching error rooted in failing to distinguish between static content and dynamic, context-dependent data. By treating your pagination parameters (`page`, `per_page`) as essential components of your cache key, you transform a static caching problem into a dynamic one. Implementing this context-aware caching strategy ensures that every user receives the correct, up-to-date slice of information, leading to a more reliable and efficient application architecture.
