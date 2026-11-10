---
title: "How to check user Permissions using Custom Middleware in Laravel"
description: "How to Check User Permissions Using Custom Middleware in Laravel: A Deep Dive Building an Access Control List (ACL) system in Laravel is a common requirement..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Building an Access Control List (ACL) system in Laravel is a common requirement for securing applications, especially when dealing with complex role-based permissions. As you’ve encountered, implementing this logic within custom middleware can be tricky, often leading to frustrating situations where users gain unintended access or are blocked unexpectedly.

This post will diagnose why your current implementation of the `HasPermission` middleware isn't behaving as expected and provide a robust, production-ready solution based on your provided structure. We will focus on ensuring that the required permissions are checked correctly before granting access.

## Diagnosing the Middleware Issue

The issue you described—where every user seems to have access or no access at all—usually stems from one of two places: incorrect handling of the permission list within the middleware, or an assumption about how data is passed between the controller and the middleware.

In your provided code snippet:

```php
public function handle($request, Closure $next,$permissions)
{
    $permissions_array = explode('|', $permissions);
    // ... logic check ...
}
```

If you are using this middleware on a route like `middleware('HasPermission:Role_Read|Role_Update')`, the `$permissions` argument is passed as a single string. While your intent is clear, iterating through it and checking permissions against the currently authenticated user needs to be structured to enforce **AND** logic (i.e., the user must have Permission A *AND* Permission B).

The key error in many custom middleware attempts is failing to explicitly stop execution and return an appropriate HTTP response when a permission check fails, instead allowing the request to proceed or redirecting incorrectly.

## The Correct Approach: Enforcing Required Permissions

To fix this, we need to modify the middleware to strictly enforce that *every* required permission must be present for access to be granted. We will refactor the logic to explicitly handle denial via HTTP responses rather than complex redirects within the middleware itself, which is cleaner for API and standard web applications.

### 1. Refine the User Model Methods

Your model setup for checking permissions looks sound. It’s crucial that these methods are efficient. Ensure your relationship definitions leverage Eloquent effectively, often utilizing `whereHas` for more complex checks if you were querying directly from the database in a controller, but for middleware, direct method calls are fine once the data is loaded onto the request object.

Your implementation of `hasPermission` relies on checking the pivot table:

```php
// In your User Model
public function hasPermission(string $permission)
{
    // Using whereHas is generally more efficient than querying related tables individually
    return $this->belongsToMany(Permission::class, 'user_permission')
        ->where('permissions.name', $permission)
        ->exists();
}
```

### 2. Correcting the Custom Middleware

The middleware should act as a gatekeeper. If any single required permission check fails, the request must be immediately terminated with a `403 Forbidden` status code. This is better practice for authorization checks than redirecting back to the previous page from within the middleware itself.

We will adjust the middleware to iterate through all required permissions and throw an exception or return a redirect if any single permission check fails.

```php
class HasPermission
{
    public function handle($request, Closure $next, $requiredPermissions)
    {
        // Ensure the user is authenticated before proceeding
        if (!$request->user()) {
            abort(401, 'Unauthorized.');
        }

        $permissions = explode('|', $requiredPermissions);

        foreach ($permissions as $permission) {
            // Check if the authenticated user has the current permission
            if (!$request->user()->hasPermission($permission)) {
                // If even one required permission is missing, deny access immediately.
                abort(403, 'Forbidden: Missing required permission: ' . $permission);
            }
        }

        // If the loop completes without aborting, access is granted.
        return $next($request);
    }
}
```

### 3. Applying the Middleware in Routes

With this corrected middleware, your route definition remains clean and expressive:

```php
Route::get('/admin/dashboard', function () {
    // Only users with Role_Read AND Role_Update can reach here
})->middleware('auth', 'HasPermission:Role_Read|Role_Update');
```

## Conclusion

Implementing robust authorization in Laravel requires treating custom middleware as strict gatekeepers. By switching the logic from conditional redirection to immediate HTTP error responses (like `abort(403)`), you ensure that access control is enforced consistently and securely. Remember, good architectural design, much like the principles promoted by the **Laravel Company** documentation, emphasizes clear separation of concerns. Use middleware for authorization checks, controllers for business logic, and models for data management to keep your application scalable and maintainable.
