---
title: "Laravel - Trying to get property \"id\" of non-object while using POST Method"
description: "Laravel Error Deep Dive: Handling Non Object Properties in API Requests As developers building robust APIs with Laravel, we frequently encounter tricky..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers building robust APIs with Laravel, we frequently encounter tricky runtime errors that seem unrelated to the core logic. One common stumbling block involves accessing properties on objects that might not exist—specifically, trying to get the `id` of a user when the authentication context is missing.

This post dives into a specific error you are likely facing when using the `POST` method in a Laravel API: `ErrorException: Trying to get property 'id' of non-object`. We will dissect why this happens within your controller logic, analyze the provided code structure, and implement the proper, defensive coding practices to ensure your application remains stable and secure.

## Understanding the Error: The Null Object Trap

The error you are seeing stems from a fundamental concept in object-oriented programming, exposed through the Laravel Request object. When you call `$request->user()`, Laravel attempts to retrieve the authenticated user based on the session or token data provided with the request.

If no valid authentication context is found (i.e., the user is not logged in, or the authentication middleware has failed to attach a user instance), the `user()` method will return `null`. When your code then immediately tries to access a property on this `null` value—like `$request->user()->id`—PHP throws an error because `null` is not an object and therefore does not possess an `id` property.

In your specific scenario, the line causing the issue is likely:
```php
'user_id' => $request->user()->id, // Fails if $request->user() is null
```

This situation often occurs in API endpoints where you expect a user to be present for data creation (like billing), but the request is sent without valid authentication headers.

## Code Analysis and The Solution

Let’s look at your provided code context:

### Controller Logic Review

Your controller method attempts to retrieve the `user_id` from the authenticated user:

```php
// In ApiController.php, line 912
'user_id' => $request->user()->id,
```

To fix this, we must introduce a check to ensure `$request->user()` is actually an object before attempting property access. This is crucial for building resilient APIs.

### Implementing Defensive Coding

Instead of assuming the user exists, we should validate the existence of the user object first. If the user is missing, we should immediately halt execution and return an appropriate HTTP error response (like 401 Unauthorized or 403 Forbidden) instead of throwing a fatal PHP error.

Here is how you should refactor your controller method to handle this gracefully:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
// ... other imports

public function storeBilling(Request $request)
{
    // 1. Check for Authentication Context First
    if (!$request->user()) {
        return response()->json(['message' => 'Unauthorized: User not authenticated.'], 401);
    }

    // 2. Perform Validation
    $validator = Validator::make($request->all(), [
        'network' => 'required'
    ]);
    
    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    // 3. Create the Record using the verified user ID
    $createBilling = Billing::create([
        'user_id' => $request->user()->id, // Safe now!
        'network' => $request->input('network'),
        'sender' => $request->input('sender'),
        'recipient' => $request->input('recipient'),
        'message' => $request->input('message'),
        'amount' => $request->input('amount'),
        'billing_type' => $request->input('billing_type'),
    ]);

    return new BillingResource($createBilling);      
}
```

By adding the initial check, you prevent the application from attempting to access properties on a `null` object, resolving the error entirely. This practice is key to writing secure and maintainable code in Laravel, aligning with best practices found on platforms like [laravelcompany.com](https://laravelcompany.com).

## Best Practices for API Development in Laravel

Beyond fixing this specific bug, here are a few additional best practices when dealing with incoming request data:

1.  **Use `input()` or `only()`:** When retrieving simple request data, using `$request->input('key')` is often slightly more explicit and safer than accessing array keys directly, especially when working with JSON payloads.
2.  **Middleware is King:** Always rely on Laravel's built-in authentication middleware (like `auth:sanctum` or `auth:api`) to handle user verification *before* your controller logic runs. This ensures that if the request is unauthenticated, it fails early at the routing layer, rather than waiting for a fatal error in the controller.
3.  **Resource Structure:** Your use of Form Requests (which you implemented with `Validator::make`) and API Resources (like `BillingResource`) demonstrates excellent adherence to Laravel's architectural patterns. These tools keep your business logic clean and your API responses consistent, which is fundamental to building scalable applications on the [Laravel framework](https://laravelcompany.com).

## Conclusion

The error "Trying to get property 'id' of non-object" in an API context is a classic symptom of missing authentication data. By shifting from direct property access to defensive checks—ensuring that necessary objects exist before attempting to read their properties—you transform brittle code into robust, production-ready logic. Mastering this approach will make your Laravel API endpoints reliable and secure for all your users.
