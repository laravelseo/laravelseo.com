---
title: "Laravel Cors (Middleware NOT working)"
description: "Troubleshooting Laravel CORS: Why Your Middleware Isn't Working CORS (Cross Origin Resource Sharing) is a fundamental concept when building modern web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

CORS (Cross-Origin Resource Sharing) is a fundamental concept when building modern web applications that involve communication between different domains. While implementing CORS in a Laravel application seems straightforward—by adding middleware—it often runs into subtle issues related to request lifecycle, header order, or specific configuration nuances. As a senior developer, I can tell you that the error you are encountering, where the browser reports missing headers, usually points to an issue with how the server is handling preflight requests (`OPTIONS`) versus actual requests.

Let's dive into your specific setup and debug why your custom CORS middleware isn't effectively exposing the necessary headers.

## Analyzing the Error and Setup

You have correctly identified that you are attempting to apply CORS protection using a custom middleware:

```php
// Your Middleware implementation
public function handle($request, Closure $next)
{
    return $next($request)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With, Application');
}
```

And your route setup uses this middleware:

```php
Route::group(['domain' => 'api.domain.uk', 'namespace' => 'Api'], function() {
    Route::group(['middleware' => ['cors'], 'prefix' => 'call'], function() {
        // ... routes defined here
    });
});
```

The error message you received is critical: `No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://ice.domain.uk' is therefore not allowed access.` This confirms that the browser attempted to make a cross-origin request, and the server failed to respond with the required CORS headers for that specific request path.

## The Root Cause: Handling Preflight Requests (`OPTIONS`)

The most common reason custom CORS middleware fails is related to how browsers handle **preflight requests**. Before a complex request (like `POST`, `PUT`, or requests involving custom headers) is sent, the browser first sends an `OPTIONS` request to check if the server permits the actual request. Your middleware must explicitly handle this `OPTIONS` method correctly.

When you use `Route::any()`, Laravel handles different HTTP verbs, but when dealing with CORS, we need to ensure that any incoming request targeting the API is properly intercepted and responded to as a CORS handshake.

### Solution 1: Explicitly Handling OPTIONS Requests

Your current middleware attempts to add headers to the response stream after `$next($request)` has executed. For preflight requests, you often need to check if the method is `OPTIONS` and return a successful response immediately without executing the controller logic.

A more robust approach involves creating a dedicated CORS handler or ensuring your middleware specifically checks for the `OPTIONS` verb:

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Handle Preflight OPTIONS Request
        if ($request->isMethod('OPTIONS')) {
            $response = response()->json(['message' => 'OK'], 200);
            $response->header('Access-Control-Allow-Origin', '*'); // Or your specific domain
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
            return $response;
        }

        // 2. Handle Actual Requests (GET, POST, etc.)
        $response = $next($request);
        
        // Add CORS headers for actual requests
        $response->header('Access-Control-Allow-Origin', '*'); // Be more specific in production!
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With, Application');
        
        return $response;
    }
}
```

**Best Practice Note:** While writing custom middleware is a great learning exercise, for production applications, leveraging established packages often saves significant development time and reduces the chance of subtle bugs. For instance, packages that integrate seamlessly with Laravel's routing structure provide tested solutions for CORS management, aligning with good architectural principles seen in modern frameworks like those promoted by [laravelcompany.com](https://laravelcompany.com).

## Next Steps for Implementation

1.  **Refine the Origin:** Instead of using `'*'` (which allows any site), use your specific domain (`http://domain.uk`) or a list of allowed origins in production to enhance security.
2.  **Test Preflight:** Ensure you are testing both the actual request (e.g., `GET /rooms/1/...`) and the preflight request (the browser's `OPTIONS` call) to confirm the middleware handles both correctly.
3.  **Consider Alternatives:** If this proves too complex, investigate community packages designed specifically for Laravel CORS setup.

By explicitly managing the `OPTIONS` verb, you ensure that the browser receives the necessary handshake information before attempting the actual data transfer, resolving the header absence error you were facing.
