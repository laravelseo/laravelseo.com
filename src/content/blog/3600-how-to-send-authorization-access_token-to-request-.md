---
title: "How to send Authorization access_token to request header in Laravel using Middleware"
description: "Sending Authorization Tokens in Laravel: Mastering Headers with Middleware Building a robust API authentication system is one of the most critical steps in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Building a robust API authentication system is one of the most critical steps in developing modern web applications. When dealing with token-based authentication, specifically using Bearer tokens for authorization, correctly managing HTTP headers—especially the `Authorization` header—is essential for secure communication between your server and the client (like Postman or a mobile app).

As a senior developer working with the Laravel ecosystem, you often need to inject or modify request/response headers dynamically. This guide will walk you through how to effectively use custom middleware in Laravel to attach your access tokens to HTTP responses, ensuring your API communicates securely and correctly.

## Understanding Authorization Headers in APIs

In RESTful APIs secured by OAuth2 (which Laravel Passport heavily utilizes), the standard way to transmit an access token is via the `Authorization` header, formatted as: `Authorization: Bearer <token>`.

When a client successfully authenticates, your server generates this token. When that token needs to be returned to the client upon a successful request, it must be placed in the response headers so the client can store and use it for future requests.

The challenge lies in dynamically injecting this token into the response stream using Laravel's middleware layer.

## Implementing Token Injection via Custom Middleware

While standard authentication guards handle *verifying* incoming tokens, customizing behavior like adding specific headers requires writing custom logic within middleware. This allows you to hook into the request-response cycle at precise moments.

Here is how we can modify a response to include an `Authorization` header using a custom middleware:

### Step 1: Create the Custom Middleware

We will create a middleware class responsible for fetching the token and attaching it to the response object before it is sent back to the client. For this example, we assume you have access to the token within your application context (e.g., retrieved from the authenticated user).

```php
// app/Http/Middleware/TokenInjectorMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Or wherever you retrieve your token data

class TokenInjectorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response)  $next
     * @return \Illuminate\Http\Response
     */
    public function handle($request, Closure $next)
    {
        // 1. Perform the actual request and get the response
        $response = $next($request);

        // 2. Determine the token (This logic depends entirely on your authentication setup)
        // For demonstration, let's assume we retrieve a token from the authenticated user if available.
        if (Auth::check()) {
            // In a real application, this token would come from Passport/Sanctum scope or database lookup.
            $accessToken = 'YOUR_DYNAMICALLY_GENERATED_ACCESS_TOKEN'; 

            // 3. Inject the Authorization header into the response
            $response->headers->set('Authorization', 'Bearer ' . $accessToken);
        }

        return $response;
    }
}
```

### Step 2: Register and Apply the Middleware

Next, you must register this middleware in your `app/Http/Kernel.php` file so Laravel knows how to use it. Then, apply it to your API routes.

In `app/Http/Kernel.php`, add your new middleware to the `$middlewareGroups` array:

```php
protected $middlewareGroups = [
    'api' => [
        \Illuminate\Routing\Middleware\ThrottleRequests::class,
        \App\Http\Middleware\TokenInjectorMiddleware::class, // <-- Add it here
    ],
];
```

Finally, apply this group to your routes in `routes/api.php`:

```php
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {
    Route::post('/details', 'API\PassportController@details');
    Route::get('/test', 'API\PassportController@test');
});
```

## Best Practices and Conclusion

The technique demonstrated above is powerful because it centralizes cross-cutting concerns—like adding security headers—into a single middleware layer. This keeps your controller logic clean and adheres to the principle of separation of concerns, which is a core tenet in good Laravel development. When building complex systems, leveraging these features helps ensure consistency across all endpoints.

Remember that while this method works for injecting response headers, the actual generation and validation of tokens should remain strictly within your Passport or Sanctum implementation. For more deep dives into securing your API routes and token management within the framework, exploring official documentation from [laravelcompany.com](https://laravelcompany.com) is highly recommended. By mastering middleware, you gain granular control over the request-response lifecycle, making your APIs more secure, scalable, and maintainable.
