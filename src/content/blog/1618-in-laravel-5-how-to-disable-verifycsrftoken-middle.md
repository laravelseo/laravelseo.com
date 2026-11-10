---
title: "In Laravel 5, How to disable VerifycsrfToken middleware for specific route?"
description: "Title: Disabling VerifycsrfToken Middleware for Specific Routes in Laravel 5 In Laravel 5, the VerifyCsrfToken middleware helps protect your application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Disabling VerifycsrfToken Middleware for Specific Routes in Laravel 5

In Laravel 5, the `VerifyCsrfToken` middleware helps protect your application against Cross‑Site Request Forgery (CSRF) attacks by adding a token to each form request. However, it might cause issues when working with third-party APIs such as VendHQ that don't send CSRF tokens in their requests. In this article, we will discuss how you can disable the `VerifyCsrfToken` middleware for specific routes to handle these situations effectively.

1. Identify the Route: First, determine which route needs to be excluded from the `VerifyCsrfToken` middleware by accessing your application's router file (usually located at "app/Http/routes.php"). In most cases, this is the route that handles an API request or webhook callback.

2. Define the Exception: Next, add a new exception handler to your `AppServiceProvider` class in the 'register()' method for handling the exception related to missing CSRF token exceptions for specific routes. This will prevent Laravel from throwing the default `TokenMismatchException`. Here is an example code snippet:

```php
public function register()
{
    // Disable VerifyCsrfToken middleware for specific route
    $this->app->routes()->match(function ($route) {
        if ($route->getName() === 'api.vendhq.webhook') {
            Route::pattern('_token', '[a-f0-9]{32}');
            $route->middleware(array('csrf' => ['skip' => true]));
        }
    });

    // Handle missing CSRF token exceptions
    $this->app->bind('exception\Handler', function () {
        return new class extends ExceptionHandler
        {
            public function report($e)
            {
                if ($e instanceof TokenMismatchException && request()->route()->getName() === 'api.vendhq.webhook') {
                    // Do nothing, since we know this is a valid webhook call from VendHQ without CSRF token
                } else {
                    parent::report($e);
                }
            }
        };
    });
}
```

In the above example, we have:
- Added a new route pattern to handle API routes that will be excluded from `VerifyCsrfToken`, passing in the custom CSFR token format (UUIDv4).
- Skipped or disabled the 'csrf' middleware for our specific route.
- Bind an exception handler named "exception\Handler" and added a custom report method to handle the TokenMismatchException only when we know it is related to valid webhook calls from VendHQ.

3. Test Your Changes: Finally, test your changes by making an API call or a webhook request without the CSRF token and confirm that the process works as expected. If successful, you have effectively disabled the `VerifyCsrfToken` middleware for the specified route while maintaining security on other routes.

In conclusion, handling exceptions related to missing CSRF tokens can be crucial when integrating with third-party APIs such as VendHQ. By following these steps and properly configuring your routing and exception handling, you can avoid issues caused by `VerifyCsrfToken` middleware for specific routes while still maintaining the security of your Laravel 5 application.
