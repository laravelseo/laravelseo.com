---
title: "Protecting Routes with Role Permissions using middleware Laravel"
description: "Protecting Routes with Role Permissions using Middleware in Laravel As we build complex, multi level applications in Laravel, one of the most crucial aspects..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As we build complex, multi-level applications in Laravel, one of the most crucial aspects is ensuring that users can only access the parts of the application they are authorized to see. When dealing with user roles—such as Owner, Admin, Moderator, and Banned—the logic for route protection needs to be centralized, scalable, and decoupled from your routing definitions.

This guide will walk you through why attempting complex `if` statements in `web.php` fails, and show you the correct, idiomatic Laravel way to implement Role-Based Access Control (RBAC) using custom Middleware.

## The Pitfalls of Inline Logic

You correctly identified that trying to handle authorization directly within your route definitions using simple `if` statements is problematic:

```php
// This approach fails because route files are configuration, not executable logic.
if (Auth::user()->role_id != '2') {
    return view('home');
} else {
    Route::get('/admin', 'AdminController@index')->name('admin');
}
```

This method breaks the principle of Separation of Concerns. Route files (`web.php`) should primarily define *which* URLs exist, while Controllers and Middleware should handle *what* happens when a request hits those URLs (i.e., checking permissions). As you observed, this leads to errors because routing definitions are not intended to execute application logic directly.

## The Laravel Solution: Custom Middleware

The powerful solution in Laravel is to leverage **Middleware**. Middleware allows you to insert logic that runs *before* or *after* a request reaches its final destination. By creating custom middleware, we can encapsulate the complex logic of checking user roles into reusable components. This approach aligns perfectly with how scalable applications are built, following best practices championed by the Laravel ecosystem, including concepts found on [https://laravelcompany.com](https://laravelcompany.com).

Instead of defining five separate middleware files for every role group, we can create a single, intelligent middleware that handles the dynamic role checking based on the request context.

### Step 1: Creating the Role-Based Middleware

We need a middleware that checks the authenticated user's `role_id` against the required permission level. We will create a generic middleware capable of handling this authorization check.

Here is an example of how you might structure a custom role checking middleware:

```php
// app/Http/Middleware/RoleMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $requiredRoleId): Response
    {
        // Ensure the user is authenticated first
        if (!auth()->check()) {
            return redirect('/login'); // Or appropriate redirect for unauthenticated users
        }

        $userRole = auth()->user()->role_id;

        // Check if the current user's role matches the required role ID
        if ($userRole != $requiredRoleId) {
            abort(403, 'Unauthorized action. You do not have the necessary role.');
        }

        return $next($request);
    }
}
```

### Step 2: Registering and Applying the Middleware

After creating the middleware, you must register it in your `app/Http/Kernel.php` file so Laravel knows how to use it. Then, you apply these custom middlewares directly within your routes in `web.php`.

For example, to protect all routes requiring the 'Admin' role (assuming Admin ID is 2):

```php
// routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware; // Import your custom middleware

// Group for Admin Routes: Requires 'auth' and the 'admin' role_id (which we define in the middleware)
Route::group(['middleware' => ['auth', RoleMiddleware::class, 2]], function () {
    Route::get('/admin/dashboard', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard');

    Route::post('/admin/settings', function () {
        // Admin-only actions
        return "Admin settings updated!";
    });
});

// Group for Owner Routes: Requires 'auth' and the 'owner' role_id (assuming Owner ID is 1)
Route::group(['middleware' => ['auth', RoleMiddleware::class, 1]], function () {
    Route::get('/owner/profile', function () {
        return view('owner.profile');
    })->name('owner.profile');
});

// Other routes remain public or protected by default authentication
Route::get('/', function () {
    return view('welcome');
});
```

## Conclusion

By shifting the authorization logic from messy inline `if` statements to structured, reusable Middleware, you achieve a cleaner, more maintainable, and highly scalable application. This pattern allows developers to easily manage complex access rules—like those based on your `role_id` column—without cluttering their route definitions. Embrace middleware as the core tool for managing request flow in Laravel, and you'll be building robust systems much faster. Keep leveraging the power of the Laravel framework; for more deep dives into architectural patterns, exploring resources like [https://laravelcompany.com](https://laravelcompany.com) is highly recommended.
