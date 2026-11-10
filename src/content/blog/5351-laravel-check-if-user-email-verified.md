---
title: "Laravel check if user email verified"
description: "Laravel: Checking Email Verification Directly in Your Controller Without Middleware As a senior developer working with the Laravel ecosystem, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we often encounter scenarios where we need fine-grained control over access authorization within specific controller methods, rather than relying solely on global middleware or route definitions. The request—to check if a user is authenticated *and* has a verified email only for a single action like `create`—is very common.

While using middleware (like the one you mentioned) is generally the most DRY (Don't Repeat Yourself) way to enforce these rules across an entire application, there are valid reasons why you might need to perform this check directly inside the controller method.

This post will explore how to achieve this specific authorization requirement cleanly within your controller, demonstrating both a direct approach and introducing the more scalable Laravel-native solution using Policies.

## The Direct Approach: Checking Model State in the Controller

If you absolutely must perform the check within the controller function itself, the most straightforward way is to access the authenticated user object retrieved via `Auth::user()` and inspect its attributes. This keeps the logic tightly coupled with the action being performed.

In your specific case, you need to ensure two conditions are met: the user is logged in *and* their email has been verified.

Here is how you can implement this check directly within your `create` method:

```php
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Assuming your User model is here

public function create()
{
    // 1. Check if the user is authenticated
    if (!Auth::check()) {
        return redirect()->route('login');
    }

    $user = Auth::user();

    // 2. Check if the email is verified
    if (!$user->email_verified_at) {
        // Redirect back or show an error message if verification is missing
        return redirect()->back()->with('error', 'Please verify your email address before proceeding.');
    }

    // If both checks pass, proceed with creating the resource
    // ... rest of your logic (State/City fetching)

    $states = State::orderBy('name', 'asc')->get();
    $state_id  = '1'; // Example static ID
    $cities = City::where('state_id', $state_id)->orderBy('name', 'asc')->get();

    return view('pages.create_product', ['user' => $user, 'states' => $states, 'cities' => $cities]);
}
```

### Analysis of the Direct Approach

This method is explicit and works perfectly for a single function. However, as your application grows, repeating this `if` statement across dozens of controller methods becomes cumbersome, leading to code duplication and potential inconsistencies if the verification rule ever changes.

## The Scalable Solution: Leveraging Laravel Policies

For robust authorization logic, especially when dealing with complex rules like email verification, the recommended Laravel approach is utilizing **Policies**. Policies allow you to centralize the "what" (authorization rules) away from the "how" (controller execution). This aligns perfectly with how large applications should be structured.

A Policy defines a clear contract for whether a user is allowed to perform an action on a specific model.

### Implementing Email Verification via a Policy

1.  **Define the Policy:** Create a policy for your `User` model (e.g., `UserPolicy`).
2.  **Define the Rule:** Within the policy, define a method that checks the verification status.
3.  **Apply in the Controller:** Use the built-in `Gate` or `Policy` helpers to check permissions before executing the code.

For example, you could define a simple gate:

```php
// In your AuthServiceProvider.php (or similar setup)
Gate::define('create-product', function ($user) {
    return Auth::check() && $user->email_verified_at !== null;
});
```

Then, in your controller, you simply check this gate:

```php
public function create()
{
    // Check if the user has permission to perform this action
    if (Auth::user()->can('create-product')) {
        // Proceed with creating the resource and fetching data...
        $user = Auth::user();
        $states = State::orderBy('name', 'asc')->get();
        // ... rest of your logic
        return view('pages.create_product', ['user' => $user, /* ... */]);
    } else {
        return redirect()->route('login')->with('error', 'Access denied. Please ensure your email is verified.');
    }
}
```

## Conclusion

While the direct check inside the controller (as shown in the first example) solves your immediate problem efficiently, it sacrifices scalability. As you continue developing with Laravel, I strongly recommend migrating these types of authorization checks into **Policies**. This practice adheres to the principles of clean architecture and maintains consistency across your entire application. By leveraging Laravel’s built-in authorization features, you ensure that your application logic remains readable, maintainable, and robust, which is central to building high-quality applications on the platform provided by [laravelcompany.com](https://laravelcompany.com).
