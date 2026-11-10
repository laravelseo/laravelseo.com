---
title: "Laravel 5.8: How to check data type in Controller"
description: "Laravel 5.8: How to Check Data Types in Your Controller – The Right Way As senior developers working with Laravel, we often deal with incoming data from HTTP..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with Laravel, we often deal with incoming data from HTTP requests. A common scenario is ensuring that the data received matches the expected structure and type before processing it. The question posed—how do you accurately check the data type of a variable inside a controller method?—is fundamental to writing robust, resilient applications.

In your example, you correctly use Laravel’s validation system:

```php
$data = $request->validate([
   'charge' => 'required|integer', // Validation ensures it *should* be an integer
]);
```

This tells Laravel that the incoming `charge` must be a valid integer. However, when you move into runtime logic within your controller method, simply checking for a magic constant like `INTEGER` won't work in PHP. We need to use native PHP functions to inspect the actual type of the variable.

This post will walk you through the correct methods for checking data types in Laravel controllers, moving from simple checks to robust error handling.

## Understanding Data Types in PHP and Laravel

When data is passed from a web request into your controller, it often arrives as strings, even if the user entered numbers. The key difference lies between the *value* (what the number represents) and the *type* (how PHP stores that value).

If you want to check if a variable holds an integer, you should use PHP’s built-in type checking functions: `is_int()`, `is_float()`, or `is_numeric()`.

### The Correct Way to Check Data Types

Instead of trying to compare the variable directly against a constant, use explicit type checking. For your specific scenario where you expect an integer:

```php
public function chargeWallet(Request $request, $wallet, $user)
{
    $data = $request->all(); // Use all() or input() to get the request data

    // Step 1: Check if the 'charge' field exists and is an integer type.
    if (isset($data['charge']) && is_int($data['charge'])) {
        // The data is guaranteed to be a strict integer here.
        $chargeAmount = $data['charge'];

        // Proceed with database operations or logic...
        flash()->overlay('Success!', 'Success Message', 'success');
    } else {
        // Handle the error if the type check fails.
        flash()->overlay('Error!', 'Invalid Data Type', 'danger');
        return redirect(back());
    }

    return redirect(back());
}
```

Notice how we use `is_int($data['charge'])`. This function returns `true` only if the variable is strictly of the integer type in PHP. If the input was a string like `"123"`, this check would fail, which is often desirable when strict type enforcement is required for financial operations.

## Best Practices: Validation vs. Runtime Checking

It is crucial to understand the distinction between validation and runtime checks in Laravel development.

**1. Leverage Validation First (The Laravel Way):**
As demonstrated in your initial setup, the best place to enforce data types is during the validation phase using the `rules` array. This shifts error handling to the framework level, making your code cleaner and more declarative. If validation fails, Laravel automatically handles redirecting the user back with error messages, which is much safer than manual checks.

**2. Runtime Checks for Business Logic:**
Runtime checks (like `is_int()`) should be used for secondary business logic—situations where you need to perform an action *only if* a specific type of data is present and valid (e.g., performing complex calculations or database inserts). If the input fails validation, the request should generally stop immediately.

For deeper insights into structuring your application logic in Laravel, understanding the flow between the Request, Controller, and Model is key. Exploring best practices on the [Laravel Company website](https://laravelcompany.com) can provide excellent context for these architectural decisions.

## Conclusion

To summarize, when checking data types in a Laravel controller:

1.  **Rely on Validation:** Always use the `validate()` method with appropriate rules (`integer`, `string`, `boolean`) to handle input sanity checks upfront.
2.  **Use Native PHP Functions:** If you must perform runtime type inspection within your logic, use functions like `is_int()`, `is_float()`, or `is_numeric()` for accurate and reliable results.

By combining Laravel's powerful validation layer with precise PHP type checking, you ensure that your application remains secure, predictable, and handles unexpected input gracefully.
