---
title: "Laravel Passport Trying to get property 'secret' of non-object"
description: "Laravel Passport Error: Why You See \"Trying to get property 'secret' of non object\" As a senior developer working with Laravel and API security, I’ve seen..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As a senior developer working with Laravel and API security, I’ve seen countless developers run into confusing exceptions when implementing systems like Laravel Passport or Sanctum. The error you are encountering—`Trying to get property 'secret' of non-object`—is notoriously frustrating because it often points to a deep configuration issue rather than a simple typo in the controller code.

This post will dive deep into why this specific error occurs during token creation with Laravel Passport and provide a comprehensive, step-by-step guide to resolving it.

## Understanding the Error Context

You are attempting to use the method `$user->createToken('authToken')->accessToken;` within your `AuthController`. This process relies entirely on the underlying Eloquent model (`$user`) correctly implementing the necessary interfaces provided by the Passport package.

The error message, "Trying to get property 'secret' of non-object," tells us exactly what went wrong: Laravel Passport’s internal factory is expecting an object that possesses a `secret` property (which is used internally for signing tokens), but instead, it received something that was *not* an Eloquent model instance—likely `null` or some other unexpected type.

This usually means the `$user` variable you are calling methods on is not a valid Eloquent model object when Passport tries to process the request.

## Root Cause Analysis: Model Setup is Key

In 99% of cases where this error occurs during token generation, the problem resides in the setup of your User model or the installation of Passport itself, not the controller logic itself.

Here are the most common culprits:

1.  **Missing Trait:** The most frequent cause is forgetting to include the necessary trait that grants Eloquent models the ability to handle API tokens.
2.  **Model Instantiation Failure:** Although you use `User::create()`, if there were any underlying database constraint failures or custom model events, it might return an unexpected result (though less likely with `create()`).
3.  **Passport Installation Flaw:** Issues during the initial Passport setup can sometimes lead to broken relationships or service bindings.

## Step-by-Step Solution and Debugging

To fix this, we need to systematically debug your setup, following best practices outlined by the Laravel team.

### 1. Verify the `HasApiTokens` Trait

Ensure that your `App\Models\User` model correctly implements the necessary interface for Passport functionality. You must use the `Laravel\Passport\HasApiTokens` trait.

**In `app/Models/User.php`:**

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens; // <-- Make sure this is imported!

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; // <-- Ensure it's in the use statement
    // ... rest of your model code
}
```

If this trait is missing or misspelled, Passport cannot find the necessary methods (like `createToken`), leading directly to the error when trying to access properties like `secret`.

### 2. Re-verify Passport Installation

Even if you ran `php artisan passport:install`, it’s worth ensuring your Service Provider is correctly set up. Check your `AuthServiceProvider` and ensure all necessary facades are loaded as recommended by the official Laravel documentation on [laravelcompany.com](https://laravelcompany.com).

### 3. Review Controller Logic (Best Practice)

While the error is likely model-related, it's good practice to always guard against null errors in your controller. Always check if the user was successfully created before attempting token issuance.

**Refined `AuthController.php` Example:**

```php
use App\Models\User;
use Illuminate\Http\Request;

public function register(Request $request) 
{
    $validatedData = $request->validate([
        'name' => 'required|max:55',
        'email' => 'email|required|unique:users',
        'password' => 'required|confirmed',
        'who' => 'required'
    ]);

    $user = User::create($validatedData);

    // CRITICAL CHECK: Ensure the user was actually created before proceeding
    if (!$user) {
        return response()->json(['message' => 'User creation failed'], 422);
    }

    try {
        // Get access token
        $accessToken = $user->createToken('authToken')->accessToken;
        
        return response([
            'user' => $user, 
            'access_token' => $accessToken
        ]);
    } catch (\Exception $e) {
        // Catch any unexpected Passport errors here for better debugging
        return response()->json(['message' => 'Token generation failed: ' . $e->getMessage()], 500);
    }
}
```

## Conclusion

The error "Trying to get property 'secret' of non-object" in a Laravel Passport context is almost always a symptom pointing back to an improperly configured Eloquent model, specifically the missing `HasApiTokens` trait on your User model. By rigorously checking your model setup and ensuring proper integration with the framework, you will resolve this issue and successfully implement secure token-based authentication. Keep up the great work building robust APIs!
