---
title: "Disable password reset from Laravel"
description: "How I Can Disable Password Reset in Laravel: A Developer's Guide Dealing with authentication features is a cornerstone of any web application, but sometimes..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Dealing with authentication features is a cornerstone of any web application, but sometimes you need complete control over which features are exposed. You want to disable the password reset functionality entirely, perhaps because your application handles password management through a custom system or relies solely on other security mechanisms.

You asked how to stop the password reset process from appearing on the login page, and you tried using `Auth::routes()`. While this is a common starting point, it often falls short when dealing with deeply integrated framework features like Laravel's authentication scaffolding. As a senior developer, I can tell you that disabling functionality requires looking beyond just route definitions; we need to examine the underlying controllers, session handling, and middleware.

This guide will walk you through the correct, robust methods for completely disabling password reset in a Laravel application.

## Why the Simple Approach Fails

The reason your initial attempt using `Auth::routes(['register' => false, 'password.request' => false, 'password.reset' => false]);` did not work is likely due to how Laravel handles route registration and scaffolding. These methods primarily adjust the routes defined within the default authentication structure, but they may not fully deactivate the underlying controller logic or session handling that allows the reset process to be initiated via other means (like a direct request to a password reset URL).

To truly disable a feature in Laravel, we need a more explicit approach that targets all layers of the system.

## The Correct Strategy: Disabling Routes and Controllers

The most effective way to eliminate unwanted functionality is to surgically remove or bypass the routes and ensure no associated logic remains accessible.

### Step 1: Explicitly Remove Password Reset Routes

Instead of relying solely on `Auth::routes()`, you should explicitly look at your route files (usually in `routes/web.php` or dedicated authentication files) and manually remove any routes related to password requests or resets that might be defined by default scaffolding.

If you are using Laravel Breeze or Jetstream, these features are often tightly coupled with the scaffolding. You need to ensure that no entry points exist for `/forgot-password`, `/reset-password`, etc.

**Example of Route Management:**

In your `routes/web.php` file, review and delete any routes you find related to password management:

```php
// Example of routes to potentially remove or comment out:
// Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
// Route::post('/reset-password', [ResetPasswordController::class, 'store']);
```

### Step 2: Removing Associated Controllers and Logic

If simply removing the routes is insufficient, it means the controllers themselves are still accessible. You must ensure that the classes responsible for handling these requests no longer exist or are not referenced by any middleware.

For a complete lockdown, you should examine your `app/Http/Controllers` directory. If you have custom controllers managing password resets (e.g., a `PasswordResetController`), delete those files entirely. This prevents any lingering logic from being executed, regardless of the URL accessed.

## Advanced Option: Using Middleware for Global Restriction

If you prefer a more centralized control mechanism, you can use middleware to globally restrict access to specific routes or controller groups. While this doesn't *delete* the functionality, it ensures that even if routes are accidentally added later, they remain inaccessible.

You can define a custom middleware that checks if certain features should be disabled before allowing access to any authentication-related paths:

```php
// In your Kernel file (app/Http/Kernel.php) or route files:
Route::middleware(['disable.password.reset'])->group(function () {
    // All routes within this group will be restricted
});
```

You would then define the `disable.password.reset` middleware to check a configuration flag, ensuring that if you toggle this setting off in your environment file (`.env`), all password reset functionality is instantly blocked across the entire application. This approach promotes clean separation of concerns, which aligns with Laravel's philosophy on building scalable applications, much like when you are developing complex features using **Laravel Company** tools.

## Conclusion

Disabling a feature completely requires a multi-layered approach in Laravel: address the routes, eliminate the controllers, and optionally use middleware for robust security. Simply toggling flags within `Auth::routes()` is often insufficient because it doesn't touch the actual controller logic. By taking these explicit steps, you ensure that your application remains secure, clean, and fully under your control.
