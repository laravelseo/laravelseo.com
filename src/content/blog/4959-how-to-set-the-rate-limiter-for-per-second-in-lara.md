---
title: "How to set the rate limiter for per second in Laravel version 8"
description: "Mastering Granular Control: How to Set Per Second Rate Limiting in Laravel 8 As developers working with high traffic APIs, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance"]
featured: false
---

As developers working with high-traffic APIs, one of the most common requirements is establishing very granular rate limits—specifically limiting requests based on a per-second basis rather than minutes or hours. While Laravel's built-in rate limiting system provides excellent tools for time-based restrictions using methods like `perMinute` or `perHour`, achieving a true "per second" limit requires stepping outside the default configuration and implementing a more custom, real-time counting mechanism.

This post will explore why the standard approach falls short and provide a practical, robust solution for implementing precise per-second rate limiting in Laravel 8, focusing on efficiency and correctness.

## The Limitation of Default Rate Limiting Methods

Laravel's rate limiter relies on caching mechanisms to store counters associated with specific time windows. When you use methods like `Limit::perMinute()`, the underlying logic is designed around these pre-defined, larger time intervals. This structure is efficient for common scenarios (e.g., limiting API usage per hour) but does not inherently support sub-minute granularity.

Attempting to modify internal functions within `Illuminate\Cache\RateLimiting\Limit` to handle second-level logic is generally discouraged, as it risks breaking future updates and introduces tight coupling. Instead, for highly granular requirements like 25 requests per second, we must implement the rate limiting logic ourselves, leveraging Laravel's powerful caching system (often backed by Redis) directly.

## Implementing a Custom Per-Second Rate Limiter

To achieve a true per-second limit, we need a mechanism that tracks request counts within a rolling one-second window. The most effective way to do this is by using the `Illuminate\Cache` facade to manage these counters in real-time.

We will implement a service class that checks and updates the counter for a specific user or IP address every time a request hits the endpoint.

### Step 1: Setting up the Rate Limiter Service

We can create a dedicated service or trait to encapsulate this logic. This example demonstrates how to check if the current count exceeds the allowed limit within the last second.

```php
<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter; // We still use this for context, but custom logic handles the enforcement

class SecondRequestLimiter
{
    protected string $key;
    protected int $limit = 25; // Target: 25 requests per second
    protected int $window = 1; // Time window in seconds

    public function __construct(string $identifier)
    {
        // Create a unique key based on the identifier (e.g., IP or API Key)
        $this->key = 'rate_limit:' . $identifier;
    }

    public function attempt(): bool
    {
        // Use Cache to store and increment the request count for the current second
        $currentCount = Cache::increment($this->key, 1);

        // Set the expiration time for this key to be exactly one second from now.
        // This ensures the counter resets every second.
        Cache::put($this->key, $currentCount, 1); // Set TTL to 1 second

        if ($currentCount > $this->limit) {
            // Rate limit exceeded
            return false;
        }

        return true;
    }

    public function isExceeded(): bool
    {
        // For a simple check, we just need to ensure the count hasn't immediately spiked.
        // A more complex implementation would involve fetching and clearing historical data.
        return Cache::get($this->key, 0) > $this->limit;
    }
}
```

### Step 2: Applying the Limiter in a Controller

Now, you integrate this logic into your request handling. For IP-based limiting, you would typically retrieve the IP address from the request.

```php
use Illuminate\Http\Request;
use App\Services\SecondRequestLimiter;

class ApiController extends Controller
{
    public function handleRequest(Request $request)
    {
        $ipAddress = $request->ip();
        $limiter = new SecondRequestLimiter($ipAddress);

        if (!$limiter->attempt()) {
            return response()->json([
                'message' => 'Too many requests. Please slow down.',
                'limit' => '25 requests per second'
            ], 429); // HTTP 429 Too Many Requests
        }

        // Proceed with the request logic
        return response()->json(['status' => 'success', 'data' => 'Your requested data']);
    }
}
```

## Conclusion and Best Practices

Achieving per-second rate limiting requires shifting from Laravel’s abstracted time limits to direct manipulation of the underlying cache store. By implementing a custom service that uses `Cache::increment()` and sets an explicit, short Time-To-Live (TTL) of one second for each counter key, we effectively create a sliding window mechanism tailored precisely to your needs.

Remember, when dealing with high throughput, ensure your caching driver is optimized, ideally using **Redis** as the cache backend. This ensures that the atomic operations performed by `Cache::increment()` are executed extremely fast, which is crucial for maintaining accurate rate limits under heavy load. As you build scalable applications on the Laravel platform, focusing on custom service layers like this provides the flexibility needed to handle complex business logic efficiently, much like the architectural principles promoted by the **Laravel Company**.
