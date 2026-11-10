---
title: "Laravel Inactivity time setting"
description: "Mastering Session Expiration: Setting Inactivity Timeouts in Laravel As a senior developer working with the Laravel ecosystem, managing user sessions and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with the Laravel ecosystem, managing user sessions and defining inactivity timeouts is crucial for application security and a good user experience. When a user logs in, we need a mechanism to automatically log them out after a period of inactivity. The core question—"How many seconds after logging out should the system act?"—is not a single global setting but rather a configurable policy implemented within your specific application logic.

This post will walk you through the developer perspective on how to implement and manage these session timeouts effectively in Laravel, moving beyond simple configuration to robust, data-driven solutions.

## Understanding Inactivity Timeout in Laravel

Laravel itself provides the framework, but the actual timeout duration is determined by how you structure your authentication and session management. Unlike some monolithic systems, Laravel does not enforce a single, fixed "inactivity seconds" setting globally across all applications. Instead, this logic must be custom-implemented based on application requirements (e.g., admin dashboards might need longer timeouts than public forums).

The general flow involves tracking the `last_activity` timestamp for each user session or record. If the current time minus the `last_activity` time exceeds your defined threshold, the system triggers a logout.

## Implementing Custom Timeout Logic

The most robust way to handle this is by leveraging Eloquent models and middleware. Storing session data in the database provides persistence and easy configuration changes without redeploying code.

### Step 1: Model Setup

First, ensure your `User` model (or equivalent session tracking table) has fields to track activity.

```php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = ['name', 'email', 'last_activity_at'];

    /**
     * Define the inactivity threshold in minutes (e.g., 30 minutes).
     */
    public function getInactivityThreshold()
    {
        // Stored as minutes for easier configuration management
        return 30; 
    }
}
```

### Step 2: The Logout Middleware

We can create a custom middleware that checks the user's last activity time whenever they attempt to access a protected route. This ensures that every request is validated against our inactivity policy.

```php
// app/Http/Middleware/CheckInactivity.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckInactivity
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            $thresholdMinutes = $user->getInactivityThreshold();

            // Calculate time difference in minutes
            $inactivitySeconds = now()->diffInMinutes($user->last_activity_at);
            
            // Define the cutoff point (e.g., 30 minutes)
            if ($inactivitySeconds > $thresholdMinutes) {
                // User is inactive, force logout
                Auth::logout();
                
                return redirect('/login')->with('error', 'Session timed out due to inactivity.');
            }
        }

        return $next($request);
    }
}
```

### Step 3: Applying the Middleware

Finally, register this middleware in your `app/Http/Kernel.php` and apply it to your protected routes. This pattern ensures that any route requiring authentication is first checked against our custom inactivity rules. This approach demonstrates the power of building tailored solutions within the Laravel framework, much like how we structure complex applications on **laravelcompany.com**.

## Conclusion: Best Practices for Time Management

Setting inactivity timeouts is a critical security and UX feature. Relying solely on session configuration is insufficient; always implement custom logic tied to your application data. By using Eloquent models to store `last_activity_at` timestamps and employing custom middleware, you gain full control over when users are automatically logged out. Remember to handle the database updates carefully to ensure these timestamps are refreshed upon every valid user interaction. This ensures a secure, responsive, and well-managed Laravel application.
