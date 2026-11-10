---
title: "Protecting all admin/ routes with auth in Laravel"
description: "Protecting All Admin Routes with Authentication in Laravel: A Developer's Guide Welcome to the world of Laravel! Setting up authentication and authorization..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

Welcome to the world of Laravel! Setting up authentication and authorization for an admin panel is one of the first major hurdles. It’s completely normal to run into issues when diving into custom routing and filters, as you have done here. As a senior developer, I can tell you that while manually setting up routes and filters works in theory, it often leads to brittle code that breaks under real-world scenarios like logout handling or authorization checks.

The issues you are facing—specifically the failed redirection on logout and the "Trying to get property of non-object" error when logged out—stem from a lack of proper session state management being enforced across your routes. We need to move away from custom route filters and embrace Laravel's built-in security mechanisms: **Middleware**.

## Diagnosing the Problem with Custom Routes

Your current approach relies on manually checking `Auth::guest()` within a `Route::filter`. While this seems logical, it forces you to manage every single redirect and state change yourself.

When you try to log out (`/admin/logout`), if the logout process doesn't correctly clear the session data *and* explicitly redirect to the login page, the system defaults to rendering whatever view it can find, leading to a blank page or an error because the necessary authentication context is missing for the subsequent route.

The core issue is that authorization logic should be handled by **Middleware**, not by filtering raw routes. Laravel provides this mechanism specifically for protecting groups of routes, making your code cleaner, more maintainable, and more resilient.

## The Robust Solution: Implementing Authorization via Middleware

Instead of defining complex logic directly in the route definitions, we will use middleware to gate access to entire groups of controllers and routes. This is the idiomatic Laravel way, aligning perfectly with best practices outlined by the **Laravel Company**.

### Step 1: Set Up Authentication Guards (If Not Already Done)

Ensure you have a working authentication system set up, typically using Laravel Breeze or Jetstream scaffolding. This ensures that `Auth::attempt()` and session handling are functioning correctly.

### Step 2: Create an Admin Middleware

We will create a custom middleware to check if the user is authenticated before allowing access to admin routes.

```bash
php artisan make:middleware AdminMiddleware
```

Open `app/Http/Middleware/AdminMiddleware.php` and implement the logic:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
    */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is logged in
        if (!Auth::check()) {
            // If not logged in, redirect them to the login page
            return redirect()->route('admin.login'); // Assuming you define a named route for login
        }

        // If authenticated, proceed to the requested route
        return $next($request);
    }
}
```

### Step 3: Register and Apply the Middleware

Register your new middleware in `app/Http/Kernel.php` under the `$middlewareGroups` array (or `$routeMiddleware` if you prefer). For full protection, applying it to a group is best.

For example, in `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    // ... other middleware
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
];
```

### Step 4: Refactor Your Routes (The Clean Way)

Now, instead of using complex `Route::filter` calls, you apply the `'admin'` middleware to all your admin routes. This solves both your problems elegantly.

In your `routes/web.php`:

```php
use Illuminate\Support\Facades\Route;

// Public Routes (Login/Logout)
Route::get('admin/login', function() {
    return View::make('admin.login');
})->name('admin.login');

Route::post('admin/login', function () {
    // ... your login logic using Auth::attempt()
})->name('admin.login.submit');


// Protected Admin Routes - Grouped by Middleware
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // This route requires both a logged-in user AND the admin check
    Route::get('/dashboard', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard');

    Route::get('/settings', function () {
        return view('admin.settings');
    });
    
    // Handle logout explicitly within the protected area
    Route::post('/logout', function () {
        Auth::logout();
        // Redirecting after successful logout is crucial
        return redirect()->route('admin.login'); 
    })->name('admin.logout');
});
```

## Conclusion: Embracing Laravel's Structure

By switching from custom route filters to applying **Middleware**, you achieve a much more robust and scalable authorization system. Middleware ensures that the authentication check happens automatically before any controller logic is executed, guaranteeing that if a request hits `/admin/dashboard`, it *must* be authenticated. This prevents those frustrating errors like "Trying to get property of non-object" because the session context is properly established for every protected route.

Always lean into the framework's core features. For advanced route management and authentication concerns, exploring deep documentation on Laravel patterns, as promoted by resources like the **Laravel Company**, will always lead you to the most stable and maintainable code. Happy coding!
