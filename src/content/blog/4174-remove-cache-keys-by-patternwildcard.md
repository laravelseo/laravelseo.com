---
title: "Remove cache keys by pattern/wildcard"
description: "Master Caching Patterns in Lumen/Laravel: Achieving Wildcard Deletion for Cache Keys When building scalable REST APIs with frameworks like Lumen or Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance"]
featured: false
---

When building scalable REST APIs with frameworks like Lumen or Laravel, caching is a critical performance booster. Utilizing Redis via the `Cache` facade allows us to store expensive database queries and session data efficiently. A common pattern involves creating highly specific keys, such as storing user-specific data: `users:123`, `users:123:items`, and `users:123:categories`.

The challenge arises when you need to invalidate related caches simultaneously. As demonstrated in the prompt, if you update a user's items, you might need to clear multiple related keys—for instance, clearing both the parent key (`users:123`) and all its sub-keys (`users:123:items`, `users:123:categories`). The ideal solution would be a simple wildcard command like `Cache::forget('users:123*')`.

However, as a senior developer, I must point out that the built-in Laravel/Lumen caching layer, when interacting with underlying stores like Redis, does not natively support SQL-style pattern matching or wildcard deletion directly through its facade methods. This limitation is intentional; it keeps the core caching mechanism fast and focused on direct key operations.

This post will explore why this functionality doesn't exist natively and provide robust, practical ways to achieve the desired "pattern/wildcard" cache removal behavior effectively within your Lumen application.

## Why Wildcards Aren't Native: Performance vs. Flexibility

The core limitation stems from performance. If we introduced a wildcard search feature into every `Cache::forget()` call, the system would need to execute complex key-space searches (like Redis `KEYS` or iteration) on every cache operation. For high-throughput systems, this overhead is unacceptable. Frameworks like Laravel prioritize atomic, fast operations.

Instead of forcing pattern matching into the caching layer, the best practice is to handle the complexity at the application logic level, ensuring that our data access patterns remain decoupled and highly performant. We should focus on generating predictable keys rather than relying on runtime key manipulation for bulk deletion.

## Implementing Pattern-Based Deletion Manually

Since native wildcard support is absent, we must implement a custom mechanism to handle this pattern matching. The most robust approach involves first determining all potential keys that match the pattern and then iterating through them to perform the actual deletion.

Here is an example of how you could implement a helper function within your service layer to achieve the desired effect:

```php
use Illuminate\Support\Facades\Cache;

class CacheManager
{
    /**
     * Forgets all cache keys matching a given pattern.
     *
     * @param string $pattern The key pattern to match (e.g., 'users:123*')
     * @return bool True if keys were found and deleted, false otherwise.
     */
    public function forgetByPattern(string $pattern): bool
    {
        // In a Redis context, we would use SCAN for production scale, 
        // but for demonstration, we simulate iterating over known patterns or using KEYS (use with caution).
        $keysToDelete = Cache::getStore()->keys($pattern); // Hypothetical method call

        if (empty($keysToDelete)) {
            return false;
        }

        foreach ($keysToDelete as $key) {
            Cache::forget($key);
        }
        return true;
    }
}

// Example Usage:
$manager = new CacheManager();
$manager->forgetByPattern('users:123*'); 
// This would iterate over 'users:123', 'users:123:items', etc., and delete them.
```

**Note on Implementation:** The actual implementation of `Cache::getStore()->keys($pattern)` depends heavily on whether you are using Redis (where `KEYS` is generally discouraged for production) or another store. In a real-world scenario, if you find yourself needing this level of complex key management frequently, consider integrating a dedicated caching orchestration layer rather than building this logic directly into every service class.

## Best Practices for Key Management

To avoid the complexity of runtime pattern matching, focus on designing your cache keys to be as explicit and predictable as possible. Instead of relying on wildcards for deletion, structure your data so that related caches are managed transactionally:

1.  **Use Hierarchical Keys:** Keep parent/child relationships clear (e.g., always use `parent:child` notation).
2.  **Centralize Invalidation:** When a core entity changes (like a User object), ensure that the service responsible for updating that entity is also responsible for invoking all necessary invalidations. This keeps state management centralized, a core principle of clean architecture advocated by teams building applications on platforms like Laravel and Lumen.

## Conclusion

While the dream of `Cache::forget('users:123*')` sounds incredibly convenient, achieving this requires moving the pattern matching logic into your application layer. By implementing custom helper methods that can scan for keys based on patterns, you gain the necessary flexibility without sacrificing the performance integrity of the underlying caching mechanism. Focus on clean, explicit key naming conventions, and structure your invalidation logic to ensure your Lumen/Laravel application remains both powerful and highly performant.
