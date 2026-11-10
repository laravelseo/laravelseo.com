---
title: "Laravel - artisan down / Maintenance Mode except own IP"
description: "Laravel Maintenance Mode: Restricting Access to Your Own IP Address As a senior developer working with Laravel applications, managing site access during..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

As a senior developer working with Laravel applications, managing site access during maintenance is crucial. The built-in functionality provided by `php artisan down` is excellent for temporarily taking a site offline for everyone, but it doesn't offer the necessary granular control required when you need exclusive access—for instance, ensuring only your own IP address can still view the site while the rest of the world sees a maintenance notice.

This post will dive into how you can extend Laravel’s maintenance mode functionality to create an IP-restricted access gate, providing you with greater control over your application's uptime and security.

## Understanding the Default Maintenance Mode

When you execute `php artisan down`, Laravel typically sets up system checks that redirect all incoming requests to a designated maintenance view. This is a simple, effective way to signal downtime. However, this default state applies universally; anyone browsing the site sees the maintenance message, which is exactly what we want to avoid if we need internal access.

The challenge, therefore, isn't just activating the mode, but *conditionalizing* that activation based on the source of the request. We need a mechanism that checks the client’s IP address before deciding whether to display the downtime notice or serve the actual application content.

## The Solution: Implementing IP-Based Middleware

The most robust and idiomatic way to handle conditional access logic in Laravel is by utilizing **Middleware**. Middleware sits in the request lifecycle, allowing you to inspect the incoming request (headers, session data, or IP address) and halt or modify the process accordingly.

To achieve your goal—allowing access only from specific IPs—we will create a custom middleware that checks `request()->ip()` against a list of allowed addresses.

### Step 1: Create the Custom Middleware

First, generate a new middleware class using the Artisan command:

```bash
php artisan make:middleware IpRestrictionMiddleware
```

Next, open the newly created file (`app/Http/Middleware/IpRestrictionMiddleware.php`) and implement the logic to check the IP address against your allowed list. For demonstration purposes, we will assume you only want to allow access from your specific IP.

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class IpRestrictionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Define the IP addresses that are allowed access (e.g., your home or office IP)
        $allowedIps = [
            '192.168.1.100', // Replace with your actual IP address
            '127.0.0.1',     // Allows local host access
        ];

        $clientIp = $request->ip();

        // Check if the client IP is in the allowed list
        if (!in_array($clientIp, $allowedIps)) {
            // If the IP is NOT allowed, redirect them to the maintenance page.
            return redirect()->route('maintenance')
                ->with('error', 'Application is currently under maintenance. Access restricted.');
        }

        // If the IP IS allowed, proceed to the next step (the application).
        return $next($request);
    }
}
```

### Step 2: Register and Apply the Middleware

You must register this new middleware in your `app/Http/Kernel.php` file under the `$middlewareGroups` or `$routeMiddleware` arrays, depending on where you wish to apply it. For global access restriction, applying it as a route middleware is ideal.

Then, define a route that will act as your maintenance page (e.g., `/maintenance`).

```php
// In routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\IpRestrictionMiddleware;

// Define the maintenance route
Route::get('/maintenance', function () {
    return view('maintenance'); // Ensure you have a simple maintenance view template
})->name('maintenance');


// Apply the middleware to protect all routes (or specific ones)
Route::middleware([IpRestrictionMiddleware::class])->group(function () {
    // Place all your application routes here
    Route::get('/', function () {
        return view('welcome');
    });
    // ... other application routes
});
```

## Conclusion: Security and Control

By implementing custom middleware, you move beyond the simple toggle provided by `php artisan down` and gain sophisticated control over your application's access. This approach ensures that while the maintenance mode is active for the general public, you retain secure, private access to your system via your specified IP. This level of fine-grained control is a hallmark of mature Laravel development, emphasizing security and tailored user experience, much like the principles behind building robust systems on platforms like [laravelcompany.com](https://laravelcompany.com).

This method provides a clean separation of concerns: your core application logic remains untouched, and access control is handled cleanly within the request pipeline.
