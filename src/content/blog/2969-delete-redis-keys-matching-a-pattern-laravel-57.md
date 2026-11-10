---
title: "Delete Redis Keys matching a pattern Laravel 5.7"
description: "Deleting Redis Keys Matching a Pattern in Laravel: A Developer's Guide Dealing with bulk operations on data stores like Redis often presents tricky syntax..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

Dealing with bulk operations on data stores like Redis often presents tricky syntax hurdles. You are running into a common issue where the standard Redis `DEL` command expects exact key names, and it doesn't natively support shell-style wildcard matching (like `*`) for deletion across multiple keys in a single atomic operation.

As a senior developer working with Laravel and Redis, understanding how to handle pattern-based deletions efficiently is crucial. This guide will walk you through why your initial attempts failed and provide the robust, production-ready methods for deleting all keys matching a specific pattern.

## Why Simple `DEL` Fails with Wildcards

You attempted commands like `Redis::del('products:*')`. The reason this doesn't work is that the Redis `DEL` command operates on explicit key strings. It does not interpret shell globbing (`*`) directly within its arguments to search for multiple keys simultaneously. When you pass `'products:*'`, Redis treats that entire string as a single, literal key name it cannot find in the set of keys, resulting in zero deletions.

To delete a pattern, we must adopt an iterative approach: first, retrieve all keys matching the pattern, and then iterate through that list to perform the deletion.

## Method 1: The Risky Approach – Using `KEYS`

The simplest way to find keys is using the `KEYS` command. While this works quickly for small datasets during development, **it is highly discouraged in production environments** because `KEYS *` can block the entire Redis instance if you have millions of keys, leading to severe performance degradation.

For demonstration purposes only (and strictly for non-production testing), here is how you would implement it:

```php
use Illuminate\Support\Facades\Redis;

class KeyCleaner
{
    public function deleteKeysByPattern(string $pattern): int
    {
        // 1. Find all keys matching the pattern (DANGEROUS IN PRODUCTION)
        $keys = Redis::keys($pattern);
        
        if (empty($keys)) {
            return 0;
        }

        $deletedCount = 0;
        
        // 2. Iterate and delete each key individually
        foreach ($keys as $key) {
            if (Redis::del($key)) {
                $deletedCount++;
            }
        }
        
        return $deletedCount;
    }
}

// Example usage:
$cleaner = new KeyCleaner();
$count = $cleaner->deleteKeysByPattern('products:*');
echo "Successfully deleted {$count} keys matching the pattern.\n";
```

## Method 2: The Robust Approach – Using `SCAN` for Production Safety

For any application deployed in a live environment, you must use the `SCAN` command instead of `KEYS`. `SCAN` allows you to iterate over keys in batches without blocking the server. This is the professional standard when dealing with large Redis instances.

The process involves looping until `SCAN` returns no more keys. Below is a conceptual example demonstrating the safer iteration pattern:

```php
use Illuminate\Support\Facades\Redis;

class SafeKeyCleaner
{
    public function deleteKeysByPatternSafely(string $pattern): int
    {
        $deletedCount = 0;
        $cursor = '0'; // Start cursor for SCAN
        
        do {
            // Use SCAN to get the next batch of keys matching the pattern
            $result = Redis::scan($cursor, ['match' => $pattern], 'count' => 100);
            
            // Update the cursor for the next iteration
            $cursor = $result['cursor'];
            $keys = $result['keys'];

            if (!empty($keys)) {
                // Delete keys in the current batch
                foreach ($keys as $key) {
                    if (Redis::del($key)) {
                        $deletedCount++;
                    }
                }
            }
        } while ($cursor !== '0'); // Continue until the cursor returns to 0

        return $deletedCount;
    }
}

// Example
