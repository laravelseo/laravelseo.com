---
title: "Adminlte in Laravel sidebar based on permission"
description: "Dynamic Navigation: Implementing Role Based Sidebars in Laravel AdminLTE As a senior developer working with Laravel, we frequently encounter scenarios where..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel, we frequently encounter scenarios where the static structure of a front-end template needs to be dynamically adjusted based on user roles and permissions. A very common requirement is customizing the navigation menu, such as the sidebar in an AdminLTE layout, so that different users only see the links relevant to their access level.

The challenge you’ve presented—loading the `adminlte.php` menu based on user permissions stored in the database—is a classic example of where pure front-end logic falls short and robust back-end architecture is required. While simple PHP scripting can achieve this, we aim for a native, scalable Laravel solution that leverages Eloquent and Blade to keep our business logic separated from the presentation layer.

## The Pitfall of Static Menu Loading

You are correct that finding a quick, one-off script (like the external link mentioned) solves the immediate problem. However, relying on embedding complex PHP logic directly into a template file like `adminlte.php` breaks the core principles of a well-structured application. It tightly couples your presentation layer with your database logic, making maintenance, scaling, and security significantly harder.

In a modern framework like Laravel, we should use the Model-View-Controller (MVC) pattern to handle data orchestration. The goal is not just to display data, but to ensure that *only* authorized data is ever presented to the user. This approach aligns perfectly with the philosophy of building maintainable applications, much like how you structure Eloquent relationships when working with complex data structures on **https://laravelcompany.com**.

## The Native Laravel Solution: Eloquent and Blade Integration

The correct way to handle this dynamic menu generation is by fetching the necessary permissions from the database within your controller and then passing that filtered list to the view.

Here is a step-by-step guide on how to achieve this using standard Laravel practices:

### Step 1: Define Your Permissions Structure

First, ensure you have a clear way to define what each menu item requires. You can use simple boolean flags or, for more complex scenarios, leverage packages like Spatie's Permission system. For simplicity here, we will assume permissions are stored directly on the `User` model or linked via a relationship.

Let’s assume your `User` model has an attribute indicating their role (e.g., `role`).

### Step 2: Fetch Permissions in the Controller

In your controller (e.g., `DashboardController`), you need to retrieve the current user and filter the menu array before passing it to the view.

```php
// app/Http/Controllers/DashboardController.php

use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Get the currently authenticated user
        $user = auth()->user();

        if (!$user) {
            return redirect('/login');
        }

        // 2. Define the full, unfiltered menu structure
        $fullMenu = [
            ['text' => 'Dashboard', 'url' => '/dashboard', 'icon' => 'dashboard'],
            ['text' => 'Users Management', 'url' => '/users', 'icon' => 'users'],
            ['text' => 'Settings', 'url' => '/settings', 'icon' => 'cog'],
        ];

        // 3. Filter the menu based on user role
        $menu = [];
        if ($user->role === 'admin') {
            // Admins see everything
            $menu = $fullMenu;
        } else {
            // Standard users only see their allowed links
            $menu = [
                ['text' => 'Dashboard', 'url' => '/dashboard', 'icon' => 'dashboard'],
                ['text' => 'My Profile', 'url' => '/profile', 'icon' => 'user'],
            ];
        }

        // 4. Pass the filtered menu to the view
        return view('adminlte.layout', compact('menu'));
    }
}
```

### Step 3: Inject Data into the View (Blade)

Now, instead of hardcoding the menu in `adminlte.php`, you inject the variable we prepared in the controller.

In your main layout file where the sidebar is rendered:

```html
<!-- In your adminlte.php structure -->
<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- ... other sidebar elements ... -->
    <nav class="sidebar-menu">
        <ul>
            @foreach ($menu as $item)
                <li>
                    <a href="{{ $item['url'] }}">
                        <i class="nav-icon fas fa-{{ $item['icon'] }}"></i>
                        {{ $item['text'] }}
                    </a>
                </li>
            @endforeach
        </ul>
    </nav>
</aside>
```

## Conclusion: Embracing Laravel's Power

By adopting this controller-based approach, we have successfully moved the menu logic out of the presentation layer and into the business logic layer. This makes our application significantly more robust and adheres to best practices for large-scale development. Whenever you are building complex applications on Laravel, remember that focusing on clean Eloquent queries and thoughtful controller design will always yield a superior result compared to scattering conditional PHP logic across your view files. Keep learning how to leverage the power of the framework; it truly simplifies sophisticated tasks like managing dynamic user permissions.
