---
title: "Add custom 500 error page only for production in Laravel"
description: "Add Custom 500 Error Pages Only for Production in Laravel Dealing with application errors is a critical part of building robust software. When an unhandled..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Dealing with application errors is a critical part of building robust software. When an unhandled exception occurs, how you present that error to the user—especially in a production environment versus a development environment—is crucial for both security and user experience.

You’ve hit on a very common requirement: wanting a clean, custom 500 error page for production deployments, but still needing the detailed debugging information when running locally (`APP_DEBUG=true`).

The simple approach of creating an `errors/500.blade.php` file is a good starting point, but it doesn't inherently solve the conditional display problem you are facing. To achieve true separation between debug and production error handling in Laravel, we need to dive into how Laravel manages its exception handling mechanism.

## Understanding Laravel's Error Handling Flow

Laravel manages all exceptions through the `app/Exceptions/Handler.php` file. When an unhandled exception occurs, this handler decides what response (header code and view) to send back to the user. The behavior here is heavily influenced by the environment variables, specifically the `APP_DEBUG` setting.

When `APP_DEBUG` is true, Laravel displays detailed stack traces and error messages directly in the browser for developers. When it's false (production), Laravel defaults to showing a generic error page. Our goal is to intercept the 500 response and apply custom logic based on this debug state.

## The Solution: Conditional Error Display via the Handler

To achieve your specific requirement—showing the default debug page when debugging, but a custom production page otherwise—we need to modify the logic within the exception handler. We can check the `APP_DEBUG` value directly within the handler to decide which view to render for a 500 error.

Here is how you can implement this conditional logic in your custom handler:

```php
// app/Exceptions/Handler.php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exceptions to report.
     *
     * @var array<int, class-string>
     */
    protected $dontReport = [
        //
    ];

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function render(\Illuminate\Http\Request $request, Throwable $exception)
    {
        // Check if the exception is an HTTP Exception (like HttpException)
        if ($exception instanceof HttpException) {
            // If we are in production mode AND it's a 500 error, show our custom view.
            if (!config('app.debug') && $exception->getStatusCode() === 500) {
                return response()->view('errors.500', [], 500);
            }
        }

        // For all other cases (including debug mode or non-500 errors), 
        // let Laravel handle the default rendering.
        return parent::render($request, $exception);
    }
}
```

### Explanation of the Code:

1.  **`if (!config('app.debug') && $exception->getStatusCode() === 500)`**: This is the core logic. It checks two conditions simultaneously:
    *   `!config('app.debug')`: Ensures we are *not* in debug mode (i.e., production).
    *   `$exception->getStatusCode() === 500`: Ensures the error being caught is specifically a server error (HTTP 500).
2.  **`return response()->view('errors.500', [], 500);`**: If both conditions are met, we manually construct and return an HTTP response using your custom view (`errors.500`) with the correct 500 status code.

## Best Practices for Production Errors

While the above method solves your specific conditional requirement, remember that robust error handling is key to a stable application. When designing your error pages, ensure they adhere to security best practices:

1.  **Avoid Leaking Information:** Never display raw stack traces or database errors to end-users in production. Your custom 500 page should be friendly and apologetic, while detailed logs are reserved for the developers.
2.  **Use Logging:** Always ensure that when a 500 error occurs, the full exception details (the stack trace) are logged securely on the server side using Laravel's logging facilities. This allows your team to debug without exposing sensitive data externally.
3.  **Leverage Framework Tools:** As you build larger applications, exploring advanced features within the framework is beneficial. For instance, understanding how Laravel manages middleware and request lifecycle can deepen your understanding of where errors are being thrown and caught, which is often detailed in the official documentation at [laravelcompany.com](https://laravelcompany.com).

By implementing conditional logic in your exception handler, you gain granular control over the user experience, ensuring that developers get the necessary detail locally while production users receive a clean, branded error message.
