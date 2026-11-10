---
title: "Show/hide menus in sidebars depending on the user roles (Laravel/Spatie)"
description: "Show/Hide Menus in Sidebars Based on User Roles: The Laravel & Spatie Approach As senior developers working with Laravel, one of the most common challenges..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO"]
featured: false
---

As senior developers working with Laravel, one of the most common challenges we face is managing access control not just for routes, but also for the presentation layer—specifically, controlling what navigation links are visible to different user roles. When dealing with multiple roles like `admin` and `former`, simply checking if a user is logged in isn't enough; we need fine-grained authorization logic.

This post dives into how you can effectively hide or show side menu items based on these roles, exploring the merits of using Middleware versus direct View logic, especially when leveraging powerful packages like Spatie for permissions.

## The Authorization Dilemma: Controller vs. Middleware

You are wrestling with a classic architectural decision: where should the authorization check live? Should it happen before the request hits the controller (Middleware) or within the presentation layer (Controller/View)?

### 1. Middleware: The Gatekeeper

Middleware is designed to act as a gatekeeper, intercepting HTTP requests and performing checks that determine if the request should proceed. It's excellent for security—blocking access to entire controllers or routes based on broad permissions.

**When to use Middleware:**
*   Blocking access to an entire route (e.g., only admins can access `/admin/*`).
*   Ensuring a user has a specific global permission before they can even attempt to view a section of the application.

While you *could* write middleware to check for roles and potentially redirect users or modify session data, using it solely to manage menu visibility can become cumbersome, as you end up duplicating logic across many controllers if you want to hide links in the navigation bar itself.

### 2. View Logic: The Presentation Layer (The Recommended Path)

For controlling the visibility of specific UI elements like sidebar links, the most practical and maintainable approach is to delegate this decision to the view layer. The view only needs to know *what* roles exist and check the current user's role to render the appropriate HTML structure.

**When to use View Logic:**
*   Controlling the rendering of navigation links, sidebars, or conditional UI components.
*   This keeps your business logic clean in your controllers and middleware, adhering to the principle of separation of concerns.

Since you need to conditionally display a link based on `Auth::user()->role`, placing this logic directly within the Blade file is the most straightforward way to manage presentation state.

## Implementation Strategy with Spatie/Laravel

Assuming you are using Laravel and leveraging Spatie for role management, your user model will contain the necessary roles. The key is accessing that information reliably in your Blade files.

### Step 1: Ensure Roles Are Accessible

First, make sure your authenticated user object has easy access to their roles (often done via Eloquent relationships or methods defined on the User model).

### Step 2: Conditional Rendering in Blade

Instead of relying on a generic check like `@if (!Auth::guest())`, you should explicitly check for the role required by that specific link. This makes your intent crystal clear and prevents accidental exposure of sensitive links.

Let's look at how you can modify your structure to hide the `/admin` link from `former` users:

```html
{{-- Example modification in your layout file (blade.php) --}}

<li class="px-nav-item">
    {{-- Only show the Admin link if the user has the 'admin' role --}}
    @can('view_admin') 
        <a href="/admin">
            <i class="px-nav-icon ion-grid"></i>
            <span class="px-nav-label">Listing admin</span>
        </a>
    @endcan
</li>

<li class="px-nav-item">
    {{-- Show the Former link only if the user has the 'former' role --}}
    @can('view_former') 
        <a href="/formers">
            <i class="px-nav-icon ion-grid"></i>
            <span class="px-nav-label">Listing formers</span>
        </a>
    @endcan
</li>
```

**Note on Spatie Integration:** The `@can` directive, provided by packages like Spatie's permission system integrated into Laravel (or custom checks based on roles), handles the complex authorization logic for you. This is significantly cleaner than manually checking `Auth::user()->roles->contains('admin')` repetitively throughout your views.

## Conclusion

For managing dynamic menu visibility in a Laravel application, the best practice is to keep security and authorization decisions separate from presentation logic. While Middleware is crucial for route-level access control, using **View Logic** with robust role checks (like those provided by Spatie) allows you to create a clean, maintainable, and highly secure user interface. By focusing your conditional rendering within Blade files, you ensure that only authorized users see the appropriate navigation elements, making your application architecture more scalable and adhering to good Laravel design principles. Remember, building robust systems often involves deciding where *presentation* logic belongs—and for menus, the view is the right place!
