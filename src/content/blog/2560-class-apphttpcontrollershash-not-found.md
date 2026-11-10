---
title: "Class 'App\\Http\\Controllers\\Hash' not found"
description: "Solving the Mystery: Class 'App\\Http\\Controllers\\Hash' not found in Laravel Helpers As a senior developer working within the Laravel ecosystem, you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working within the Laravel ecosystem, you frequently encounter errors that seem cryptic but often boil down to misunderstanding how Laravel handles class loading, namespaces, and service access. The error "Class 'App\Http\Controllers\Hash' not found" when trying to use methods like `Hash::check()` in a global helper file is a classic stumbling block.

This post will diagnose why this happens and provide the correct, idiomatic Laravel solutions for implementing reusable hashing logic without breaking your application structure.

## The Root Cause: Misunderstanding Class Loading

The error you are seeing stems from how PHP and the Laravel framework handle namespaces and autoloading. When you use a `use` statement (like `use App\Http\Controllers\Hash;`), PHP looks for that exact class file in the defined namespaces. If the class structure doesn't align with where PHP expects to find it, the autoloader fails, resulting in the "not found" error.

In Laravel, classes like those residing in the `App\Http\Controllers` namespace are typically intended for routing and request handling, not for general utility functions that should be accessible globally. Trying to pull a controller directly into a helper file violates separation of concerns (SoC) and breaks the expected dependency graph.

## Solution 1: The Laravel Way – Using Facades

The most idiomatic way to access built-in or service-provided functionality in Laravel is through **Facades**. A Facade is essentially a static proxy to a class, allowing you to interact with system services without needing to manually manage the instantiation of those classes.

For hashing operations, Laravel provides the `Hash` facade, which handles all the underlying security logic for you. You do not need to define your own controller class just to access this functionality.

### Correct Implementation Example

Instead of trying to import a non-existent controller, you should use the existing facade directly within your helper file:

```php
<?php

// /app/Helpers/functions.php

use Illuminate\Support\Facades\Hash; // Import the actual Facade

// If old password matches password
function checkOldPassword($oldPassword, $user) {
    // Use the Hash facade directly to perform the check
    if (Hash::check($oldPassword, $user->password)) {
        dd('a');
    } else {
        return back()->withErrors([
            'message' => 'Your old password is incorrect.'
        ]);
    }
}
```

Notice the crucial change: we imported `Illuminate\Support\Facades\Hash` and called it statically as `Hash::check()`. This delegates the work to Laravel's established system, which is safer and correctly managed. This approach aligns perfectly with the principles of clean architecture promoted by frameworks like [Laravel](https://laravelcompany.com).

## Solution 2: Best Practice – Creating a Dedicated Helper Class

While using Facades solves the immediate syntax error, placing complex business logic directly inside a global `functions.php` file is generally considered poor practice in large applications. It leads to tightly coupled code that is difficult to test and maintain.

A better, more robust approach is to create a dedicated Service or Helper class where your utility methods reside. This keeps your application organized and makes dependencies explicit.

### Creating a Custom Hashing Helper

If you need custom validation logic specific to your application's rules, you can create a dedicated helper class:

```php
<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Hash;

class PasswordHelper
{
    /**
     * Checks if the provided password matches the stored hash.
     */
    public static function checkPassword(string $oldPassword, string $storedHash): bool
    {
        return Hash::check($oldPassword, $storedHash);
    }
}

// Usage in functions.php:
function checkOldPassword($oldPassword, $user) {
    // Logic now calls the dedicated helper class
    if (PasswordHelper::check
