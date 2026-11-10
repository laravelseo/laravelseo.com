---
title: "Role based permission to Laravel"
description: "Implementing Granular Role Based Permission Control in Laravel: Gates, Policies, and Middleware Implementing robust Role Based Access Control (RBAC) is a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Implementing robust Role-Based Access Control (RBAC) is a cornerstone of any secure application. When dealing with highly granular permissions—like checking if a user can perform a specific action on a specific resource (e.g., `mysystem.users.create`)—you need a systematic approach in Laravel. Many developers initially look to Gates and Policies, but understanding where each tool fits is crucial for scalability.

This post will guide you through using Laravel's authorization features to manage complex permissions based on your database structure, and show how to integrate this logic with route protection via middleware.

## Understanding Laravel Gates vs. Policies

Laravel provides two primary tools for authorization: Gates and Policies. While both deal with permissions, they serve different scopes:

**Gates:** Gates are simple, boolean checks. They are excellent for checking if a user has a general permission to execute a specific action (e.g., "Can the user edit anything?"). They are typically checked within controllers or route definitions.

**Policies:** Policies are object-oriented authorization classes attached to Eloquent Models. They encapsulate all the business logic required to determine if a specific model instance can perform an action (e.g., "Can the owner of *this* `User` record delete it?"). Since your permission structure is tied directly to resources and actions defined in your database, **Policies are the most architecturally sound choice** for handling resource-level permissions.

For complex RBAC involving custom dot notation paths and external permissions, you will likely use Policies as the core engine, backed by a service layer or Gate checks during route validation. This aligns perfectly with the principles outlined in the official Laravel documentation on authorization.

## Implementing Granular Permissions via Policies

Given your detailed structure—where permissions are stored based on resource IDs and dot-notation actions in a separate table—you need a mechanism to translate that relational data into executable logic.

### Step 1: Define the Authorization Logic (The Policy)

You should create a Policy for the model you are protecting (e.g., `UserPolicy`). This policy will contain the methods that check the permissions stored in your database.

For demonstration, assume you have a service or repository layer that retrieves the user's actual permissions from your custom permission table based on their role.

```php
// app/Policies/UserPolicy.php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can create a new user.
     */
    public function create(User $user): bool
    {
        // In a real application, this logic would query your custom permission table
        // to see if the user's role grants the 'mysystem.users.create' permission.
        return $this->checkPermission($user, 'mysystem.users.create');
    }

    /**
     * Determine whether the user can view images for a specific user.
     */
    public function viewImages(User $user): bool
    {
        // Logic to check if the permission exists for this resource context
        return $this->checkPermission($user, 'mysystem.users.images.view');
    }

    /**
     * Helper method to abstract the database lookup logic.
     */
    protected function checkPermission(User $user, string $permissionKey): bool
    {
        // *** This is where you query your permission table based on $user->role ***
        // Example placeholder:
        return true; // Replace with actual DB query logic
    }
}
```

### Step 2: Registering and Using Policies

Ensure your `AuthServiceProvider` registers the policy:

```php
// app/Providers/AuthServiceProvider.php

protected $policies = [
    \App\Models\User::class => \App\Policies\UserPolicy::class,
];
```

Now, you can use these policies directly on your routes or within controllers to enforce authorization:

```php
// Example route protection using the Policy
Route::middleware('can:create,mysystem.users.create')->post('/users', [UserController::class, 'store']);
```

## Protecting Routes with Custom Middleware

While Policies handle *object-level* authorization, you still need a mechanism to protect entire routes or controllers from unauthorized access—this is where **Middleware** shines.

If the permission check is too complex for simple route definitions (like `can:create`), you can create custom middleware that intercepts the request and performs the necessary checks before letting it reach the controller. This is particularly useful when dealing with external permissions derived from your relational database structure.

```php
// app/Http/Middleware/PermissionMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, $permission): Response
    {
        // 1. Authenticate the user (assuming this is done by preceding middleware)
        $user = $request->user();

        // 2. Perform the complex permission check against your database logic
        if (!$this->checkIfUserHasPermission($user, $permission)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }

    protected function checkIfUserHasPermission($user, $permission): bool
    {
        // Implement the logic to query your permission tables here.
        // This links the route protection directly to your custom RBAC system.
        return true; 
    }
}
```

Finally, register this middleware in `app/Http/Kernel.php` and apply it to your routes. By combining the object-oriented clarity of Policies with the routing control of Middleware, you achieve a powerful, scalable, and maintainable role-based permission system for any complex Laravel application. Remember, leveraging tools like those found on https://laravelcompany.com will always lead to more robust code.
