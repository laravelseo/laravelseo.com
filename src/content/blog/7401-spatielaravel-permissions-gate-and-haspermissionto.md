---
title: "spatie/laravel-permissions - Gate and hasPermissionTo are not working"
description: "Fixing the Confusion: Why hasPermissionTo() Fails When can() Works in Spatie Permissions As a senior developer working with authorization systems, I..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As a senior developer working with authorization systems, I frequently encounter subtle yet frustrating discrepancies when implementing complex permission logic. One of the most common sticking points involves the difference between declarative checks (like Blade directives) and object-oriented methods (like `$user->hasPermissionTo()`).

Today, we are diving deep into the behavior of the `spatie/laravel-permissions` package, specifically addressing why you might find that using `Gate` definitions works perfectly with `@can(...)`, but fails when calling `$user->hasPermissionTo(...)`. This post will walk you through the underlying mechanism and provide a robust solution for managing superadmin bypasses.

## The Discrepancy Between Gate and Permission Checks

The core of your issue lies in how Laravel's authorization system interacts with the Spatie package's implementation details.

When you use Blade directives like `@can('permission')`, you are leveraging Laravel's built-in ability to check permissions, which is highly optimized and often works seamlessly based on the roles and permissions assigned to the user.

However, methods like `$user->hasPermissionTo('permission')` rely on the underlying relationship defined by the package. If the setup—especially concerning guards or custom gate definitions—is slightly misaligned, this object-oriented call can return unexpected results, even if the data exists in the database.

In many scenarios involving roles and permissions managed by Spatie, `hasPermissionTo()` often defaults to checking for a specific role that *has* that permission, rather than directly querying the permission table in isolation, which can lead to confusion when custom gate logic is introduced.

## Analyzing Your Setup: Gates vs. Permissions

Let's examine the structure you presented:

You are attempting to use `Gate::before` in your `AuthServiceProvider` to create a global bypass for superadmins by checking for a specific role (`Superadmin`). This approach is valid for controlling access flow via gates.

```php
// In AuthServiceProvider.php
public function boot()
{
    $this->registerPolicies();

    Gate::before(function ($user, $ability) {
        $superadmin_rolename = 'Superadmin';
        $guard_name = 'web-admin';
        // This check controls access based on roles/gates
        return $user->hasRole($superadmin_rolename , $guard_name ) ? true : null;
    });
}
```

This gate logic successfully influences the authorization flow, which is why `@can()` works—it respects the established guard and role hierarchy. The failure in `$user->hasPermissionTo()` suggests that while the user might possess the necessary roles defined by the Gate, the direct permission check method isn't picking up the context correctly without explicit handling.

## The Solution: Prioritize Role Checks for Superadmin Status

Instead of relying solely on `hasPermissionTo()` for superadmin checks when you are using role-based access control (RBAC) heavily with Spatie, the most reliable approach is to check the user's roles directly within your controller or service layer, leveraging the very gate logic you already established.

If a user is a superadmin, they inherently bypass all permission checks. You should make this explicit in the code where you need the highest level of access.

Here is how you can safely implement this check in your controller:

```php
public function addProduct()
{
    $admin = Auth::guard('web-admin')->user();

    // 1. Explicitly check for superadmin role bypass first.
    if ($admin->hasRole('Superadmin', 'web-admin')) {
        return true; // Superadmins always have access
    }

    // 2. If not a superadmin, then fall back to checking the specific permission.
    if ($admin->hasPermissionTo('add products')) {
        return true;
    }

    return false;
}
```

### Best Practice: Using Roles for Global Access

When managing global roles like "Superadmin," it is often cleaner and more robust to manage this bypass via roles rather than attempting to force permissions into a single gate check. The `spatie/laravel-permissions` package is designed to work seamlessly with Laravel's built-in role management. By prioritizing the check for the `Superadmin` role in your business logic, you ensure that access control is explicit and predictable, adhering to good architectural principles found throughout the wider Laravel ecosystem, including frameworks like those discussed at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

The difference you observed between `@can()` and `$user->hasPermissionTo()` is often a reflection of how the specific package integrates with your application's established authorization structure (Gates vs. direct permission queries). For complex scenarios like superadmin bypasses, relying on explicit role checks (`$user->hasRole()`) within your service layer provides superior clarity and reliability compared to attempting to force the outcome through object methods alone. By combining the power of Gates for flow control and explicit Role checks for global privileges, you create a highly secure and maintainable authorization system.
