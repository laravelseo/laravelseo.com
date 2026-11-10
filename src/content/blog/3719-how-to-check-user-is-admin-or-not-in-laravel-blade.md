---
title: "How to check user is Admin or not in laravel blade view"
description: "How to Check User Roles in Laravel Blade Views: A Comprehensive Guide As a senior developer working with the Laravel ecosystem, one of the most fundamental..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As a senior developer working with the Laravel ecosystem, one of the most fundamental tasks we face is authorization: determining what a currently logged-in user is allowed to see or do. When dealing with relational data like user roles, this task requires careful handling on both the backend and frontend.

This guide will walk you through the best practices for checking if a user is an administrator or a standard user using your provided database structure. We will focus on secure, efficient methods using Eloquent relationships in Laravel.

## Understanding the Data Structure

Before diving into the code, let's review the schema we are working with:

*   **`users` table:** Stores basic user information.
*   **`roles` table:** Stores the available roles (e.g., 'admin', 'user').
*   **`role_user` table (Pivot Table):** Links users to their respective roles (the many-to-many relationship).

To determine a user's status, we need Eloquent models and relationships to connect these tables smoothly.

## Step 1: Setting up Eloquent Relationships

The key to solving this efficiently lies in defining the necessary relationships within your Eloquent Models. This allows Laravel to handle the complex database joins for you when fetching data.

In your `User` model, you need to define a relationship that links to the roles via the pivot table:

```php
// app/Models/User.php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    // ... other traits and properties

    /**
     * Get the roles the user has.
     */
    public function roles()
    {
        // Defines the many-to-many relationship through the role_user pivot table
        return $this->belongsToMany(Role::class);
    }
}
```

You would also need corresponding relationships in your `Role` model to ensure bidirectional linking. This approach, leveraging Eloquent’s power for database interaction, is a core principle of modern Laravel development, as emphasized by the principles found on [laravelcompany.com](https://laravelcompany.com).

## Step 2: Fetching Roles in the Controller

The check must happen on the server side. When a request comes in, the controller should query the necessary data and pass only the required information to the Blade view. We will check if the user has the 'admin' role.

```php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class DashboardController extends Controller
{
    public function showDashboard()
    {
        // 1. Retrieve the currently authenticated user
        $user = auth()->user();

        if (!$user) {
            return redirect('/login'); // Handle unauthenticated requests
        }

        // 2. Check if the user has the 'admin' role using Eloquent collection methods
        $isAdmin = $user->roles->contains('admin');

        // 3. Pass the status to the view
        return view('dashboard', [
            'is_admin' => $isAdmin,
        ]);
    }
}
```

## Step 3: Displaying Roles in the Blade View

Once the controller has determined the user's status and passed it to the view, rendering the conditional content becomes straightforward. This is where you implement your authorization logic visually.

```blade
{{-- resources/views/dashboard.blade.php --}}

<h2>Welcome to the Dashboard</h2>

@if ($is_admin)
    <div class="alert alert-danger">
        <h2>Admin Panel Access</h2>
        <p>You have full administrative privileges.</p>
        <a href="/admin/settings">Go to Admin Settings</a>
    </div>
@else
    <div class="alert alert-info">
        <h2>Standard User Access</h2>
        <p>You have standard user permissions.</p>
        <a href="/profile">View Profile</a>
    </div>
@endif

<p>This content is visible to all logged-in users.</p>
```

## Conclusion: Security Through Server-Side Logic

Checking user roles in a Laravel Blade view should **never** be the sole source of truth for access control. While the Blade file handles presentation, the actual authorization logic—determining *if* a user *can* perform an action—must reside securely on the server side, as demonstrated above.

By using Eloquent relationships to fetch the user's roles in the controller and passing a simple boolean flag (`$is_admin`) to the view, you create a clean, secure, and highly maintainable system. Remember, always validate permissions at the point of data retrieval; this practice is fundamental to building robust applications, much like adhering to best practices found on [laravelcompany.com](https://laravelcompany.com).
