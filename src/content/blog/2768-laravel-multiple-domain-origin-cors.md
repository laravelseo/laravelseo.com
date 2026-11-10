---
title: "Laravel multiple domain origin CORS"
description: "Mastering CORS in Laravel: Allowing Multiple Domains Without Exposing Your API As developers building modern APIs with Laravel, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As developers building modern APIs with Laravel, one of the most common stumbling blocks is managing Cross-Origin Resource Sharing (CORS). When you need your backend API to be accessible simultaneously by a local development frontend (like running on `http://localhost:4200`) and a deployed production frontend (like `https://app.example.com`), setting the correct CORS headers becomes non-trivial.

The core challenge, as you experienced, is that simply setting the `Access-Control-Allow-Origin` header in a controller method often fails because CORS is not just about sending one header; it involves complex negotiation, especially concerning preflight `OPTIONS` requests and dynamic origin handling.

This post will walk you through why your attempts to set multiple origins failed and provide a robust, scalable solution for managing CORS across different environments in your Laravel application.

## The Pitfalls of Static CORS Headers

When you attempt to use commented-out strings or arrays for the `Access-Control-Allow-Origin` header within a standard controller method:

```php
public function handle($request, Closure $next)
{
    return $next($request)
        ->header('Access-Control-Allow-Origin', 'http://localhost:4200') // Fails for production
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        ->header('Access-Control-Allow-Headers', 'Content-Type');
}
```

This approach is problematic for several reasons:

1.  **Preflight Requests:** CORS interactions often start with an `OPTIONS` request (the preflight check). If you don't handle the `OPTIONS` method explicitly, the browser will block the actual request before it even reaches your application logic.
2.  **Dynamic Origins:** Hardcoding multiple domains directly into a single header string is inflexible. As soon as you deploy, you need to switch from `localhost` to your production domain, which requires runtime configuration, not hardcoded strings.
3.  **Framework Best Practices:** While Laravel provides powerful tools for routing and request handling, relying solely on direct header manipulation can lead to inconsistent security policies across complex applications.

## The Robust Solution: Using CORS Middleware

The most professional and maintainable way to manage CORS in a Laravel application is by utilizing dedicated middleware or packages. This allows you to define the CORS policy once and apply it consistently across your entire API, adhering to better architectural principles.

For managing CORS effectively, we move beyond simple header setting and implement logic that dynamically checks the incoming request against an allowed list of origins.

### Implementing Dynamic Origin Control

Instead of manually setting headers in every route, you should register a middleware that inspects the `Origin` header sent by the client and determines if the request is permitted. This pattern ensures that your API remains secure while accommodating multiple frontend sources.

Here is a conceptual example showing how you might structure this logic using custom middleware:

```php
// app/Http/Middleware/CheckCors.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckCors
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Define the list of allowed origins dynamically
        $allowedOrigins = [
            'http://localhost:4200', // Local development origin
            'https://app.example.com', // Production origin
            // Add other necessary domains here
        ];

        $origin = $request->header('Origin');

        if (!$origin) {
            // Allow requests without an Origin header if appropriate (e.g., same-origin requests)
            return $next($request);
        }

        // Check if the incoming origin is in our allowed list
        if (!in_array($origin, $allowedOrigins)) {
            return response()->json([
                'error' => 'CORS error',
                'message' => 'Origin not allowed.'
            ], 403); // Forbidden
        }

        // If the origin is allowed, proceed with the request
        return $next($request);
    }
}
```

To make this system work seamlessly
