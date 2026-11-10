---
title: "How to Add Roles and Permission to Laravel Fortify + Inertia + vue?"
description: "How to Add Roles and Permissions to Laravel Fortify + Inertia + Vue: A Comprehensive Guide As a senior developer, I frequently encounter scenarios where we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As a senior developer, I frequently encounter scenarios where we need robust Role-Based Access Control (RBAC) in modern full-stack applications built with Laravel. When combining Laravel Fortify for authentication, Inertia for the frontend experience, and Vue for interactivity, managing permissions efficiently becomes crucial. You are right to look toward packages like `spatie/laravel-permission`, as it provides a solid foundation.

This guide will walk you through the most effective way to implement roles and permissions, bridging the gap between your backend logic (Spatie) and your frontend presentation layer (Inertia/Vue).

## The Foundation: Choosing Your RBAC Strategy

Before diving into implementation, we must decide where the authorization logic lives. In Laravel, there are three primary ways to handle access control: Gates, Policies, and direct permission checks. For complex applications, relying solely on raw database permissions can become cumbersome in the view layer.

The `spatie/laravel-permission` package is an excellent choice because it cleanly separates roles and permissions into a relational structure, which maps perfectly to your proposed table structure (`roles`, `permissions`, `role_has_permissions`).

While Laravel Fortify handles user registration and login beautifully, it doesn't natively provide the RBAC scaffolding. Therefore, integrating Spatie is the standard approach. We will use this package to define *what* a user can do, and then use Inertia to pass that information to Vue so the frontend knows *how* to render UI elements.

## Step-by-Step Implementation with Inertia

The key to making permissions available in your Vue components is exposing them through Inertia’s shared data payload. This avoids complex API calls for simple authorization checks and keeps the data synchronized on page load.

### 1. Model Preparation: Exposing Permissions

First, you need a clean way to fetch the user's permissions. Instead of manually querying the database in every request, let your Eloquent model handle this.

In your `User` model, we can define a method to retrieve an array of permission names:

```php
// app/Models/User.php

use Spatie\Permission\Traits\HasRoles; // Ensure you have traits loaded

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles;

    /**
     * Get all permission names for the user, useful for frontend checks.
     */
    public function getPermissionArray(): array
    {
        // Use the Spatie relationship to fetch permissions and map them to names
        return $this->permissions->pluck('name')->toArray();
    }
}
```

### 2. Sharing Data via Inertia Middleware

Next, we need to ensure these permissions are attached to every page request. This is best handled within your Inertia middleware, which runs before the controller logic executes and prepares data for the frontend.

In your `HandleInertiaRequests` middleware:

```php
// app/Http/Middleware/HandleInertiaRequests.php

use Illuminate\Http\Request;

public function share(Request $request)
{
    $user = $request->user();
    $permissions = [];

    if ($user) {
        // Fetch the permission array we defined in the model
        $permissions = $user->getPermissionArray();
    }

    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $user ? $user->only(['id', 'name', 'email']) : null,
            // Pass the permissions directly to the frontend
            'can' => $user ? $permissions : [],
        ],
    ]);
}
```

### 3. Frontend Integration with Vue and Inertia

Now, the data is available globally on your page object (e.g., `$page.props.auth.can`). You can use this in your Vue components to conditionally render elements. This is where you replace manual `@can` checks with dynamic rendering logic.

For example, checking if a user can create a new resource:

```html
<!-- Example Vue Component Logic -->
<template>
    <div>
        <!-- Conditional rendering based on passed permissions -->
        <div v-if="auth.can['user_create']">
            <inertia-link 
                class="btn btn-primary"
                :href="route('admin.user.create')"
            >
                Create New User
            </inertia-link>
        </div>

        <!-- Other content -->
    </div>
</template>
```

## Conclusion: The Power of Shared State

By following this pattern—using a dedicated package for backend data management (Spatie), leveraging Inertia middleware to share necessary data, and using that data within your Vue components—you create a clean, scalable, and maintainable RBAC system. This approach separates concerns effectively: the database manages the rules, Laravel handles the authorization logic, and Inertia/Vue handles the presentation based on those rules.

For further deep dives into structuring complex relationships in Laravel applications, always refer to the official documentation provided by the [Laravel Company](https://laravelcompany.com). Happy coding!
