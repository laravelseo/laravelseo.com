---
title: "Laravel Sanctum token expiration based on last usage"
description: "Implementing Dynamic Token Expiration in Laravel Sanctum: Beyond Static created at As developers leveraging Laravel for robust API authentication, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers leveraging Laravel for robust API authentication, we often encounter situations where the default security mechanisms need to be adapted to fit specific business logic. One common friction point arises with Laravel Sanctum: token expiration. By default, Sanctum relies on a static expiration time set during token creation, typically checked against the `created_at` timestamp. While simple and effective for many use cases, this approach fails when you require a dynamic, sliding window expiration based on the *last actual usage* of the token—mimicking session management rather than pure access control.

This post dives into why simply updating the model timestamp isn't enough and explores how we can achieve true "last used" token validation without resorting to directly modifying vendor files.

## The Limitation of Default Sanctum Expiration

When you configure an expiration time in your `config/sanctum.php` (e.g., 24 hours), the system checks if the token was created more than 24 hours ago. As demonstrated in the provided context, this check is performed within the core `Sanctum\Guard` class.

The problem with relying solely on `created_at` is that it creates a rigid expiration boundary. If a token is used frequently, its effective lifespan is dictated by its initial creation time, regardless of when the user last interacted with it. To implement a sliding window—where every request resets the timer based on the latest activity—we need to alter the validation context *before* the guard executes its final check.

## Deconstructing the Validation Flow

As you astutely observed in examining `vendor/laravel/sanctum/src/Guard.php`, the validation logic is tightly coupled to the token's creation timestamp:

```php
protected function isValidAccessToken($accessToken): bool
{
    if (! $accessToken) {
        return false;
    }

    $isValid =
        (! $this->expiration || $accessToken->created_at->gt(now() - $this->expiration)) // <-- This is the static check
        && $this->hasValidProvider($accessToken->tokenable);
    // ... rest of the logic
    return $isValid;
}
```

The guard executes this check first. By the time we might inject a custom validation layer (like a middleware or an `AuthServiceProvider` hook), the token has already been deemed invalid based on its creation date, preventing us from applying our desired "last used" rule dynamically. This highlights a common architectural challenge: modifying core library behavior requires careful interception points.

## The Solution: Customizing the Token Model and Middleware

Since we cannot easily rewrite the internal guard logic, the most robust, maintainable approach is to shift the responsibility for validation to a layer that controls token retrieval *and* leverages Eloquent relationships. We must ensure that when a request comes in, the token we are using reflects its current validity state.

Instead of trying to inject logic into the core Sanctum guard, we can implement a custom authentication mechanism or leverage Laravel's built-in authorization features. For this scenario, the best practice involves tying the expiration check directly to your Eloquent model and ensuring that any access attempt is preceded by a crucial timestamp update.

### Step 1: Updating the Token Model

First, ensure your Sanctum token model (or the associated token record in your database) includes the necessary field for tracking usage:

```php
// In your Token Model (e.g., App\Models\PersonalAccessToken)
protected $fillable = [
    // ... existing fields
    'last_used_at', // Add this field
];
```

### Step 2: Enforcing the Sliding Window via Custom Logic

Since we cannot directly modify Sanctum’s internal guard, we introduce a custom middleware that intercepts the request and validates the token against our custom logic *before* it hits the standard Sanctum authentication pipeline. This requires ensuring the token is loaded correctly based on its dynamic state.

A developer focused on building secure applications should always strive to keep business logic separate from framework internals. Just as with other powerful tools available in Laravel, understanding the interplay between Eloquent models and service providers is key to mastering application architecture. For deeper insights into structuring complex authentication flows within the Laravel ecosystem, exploring official documentation is highly recommended, such as resources found on https://laravelcompany.com.

While a full implementation often involves creating a custom token retrieval layer, the principle remains: we control the flow of data. We would typically place this custom check in a central authorization gate or middleware that relies on retrieving the token and checking its `last_used_at` against the required window, effectively overriding the default behavior where necessary.

## Conclusion

Achieving dynamic, usage-based token expiration in Laravel Sanctum requires moving beyond simple configuration flags. By analyzing how the underlying guard functions and understanding the timing of execution, we realize that direct modification is fragile. The pragmatic solution lies in building a custom layer—a dedicated middleware or authorization service—that intercepts the request flow. This pattern ensures that your application’s security rules are based on your unique business requirements (like sliding windows) while respecting the core structure provided by Laravel and Sanctum, resulting in a more flexible and secure API.
