---
title: "Laravel 11 custom error page handling problem"
description: "Mastering Custom Error Pages in Laravel 11: Handling Context Specific Responses As a senior developer, I often find that evolving framework versions..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I often find that evolving framework versions introduce subtle shifts in architecture. When moving from Laravel 10 to Laravel 11, developers sometimes encounter confusion regarding where specific logic resides, especially concerning exception handling. The challenge you are facing—implementing context-aware error pages (like different 404s for admin versus customer routes)—is a classic requirement that requires deep customization of Laravel’s core behavior.

This post will walk you through the modern approach to custom error handling in Laravel 11, showing you how to achieve granular control over HTTP responses based on the request context, moving beyond simple monolithic exception handlers.

## Understanding Laravel's Exception Handling in Modern Versions

You noted that the structure of `app/Exceptions/Handler.php` might be perceived differently in Laravel 11 compared to previous versions. While the core concept of interception remains, Laravel continues to refine its service providers and internal mechanisms. The key takeaway is that custom error handling is centralized within the `render()` method of the main exception handler.

In the spirit of building robust applications, as emphasized by the principles behind **https://laravelcompany.com**, we need a mechanism that can inspect the incoming request and decide which view to render based on the exception type and the route context.

## Implementing Context-Aware Error Pages

The solution lies in extending the logic within your custom handler to inspect the request object before sending a default error response. This allows you to apply conditional routing logic directly inside the exception rendering process.

Here is how you can adapt your previous logic to handle distinct 404 pages for different sections of your application:

```php
<?php

namespace App\Exceptions;

use Illuminate\Http\Request;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
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
    public function render(\Illuminate\Http\Request $request, Throwable $exception): \Symfony\Component\HttpFoundation\Response
    {
        // Default handling for general exceptions...

        if ($exception instanceof NotFoundHttpException) {
            $statusCode = $exception->getStatusCode();
            $viewName = '';

            // Check if the request is routed within the admin section
            if ($request->is('admin', 'admin/*')) {
                if ($statusCode === 404) {
                    $viewName = 'admin.errors.404';
                } else {
                    // Handle other statuses differently if needed
                    $viewName = 'admin.errors.' . $statusCode;
                }
            } 
            // Check for customer routes (default behavior)
            elseif ($request->is('customer', 'customer/*')) {
                if ($statusCode === 404) {
                    $viewName = 'customer.errors.404';
                } else {
                    $viewName = 'customer.errors.' . $statusCode;
                }
            }
            // Fallback for other routes (e.g., default customer 404)
            else {
                 if ($statusCode === 404) {
                    $viewName = 'customer.errors.404';
                } else {
                    $viewName = 'errors.' . $statusCode;
                }
            }

            // Return the dynamically selected view response
            return response()->view($viewName, [], $statusCode);
        }

        return parent::render($request, $exception);
    }
}
```

## Best Practices for Scalable Error Handling

While the code above directly solves your immediate problem, as your application grows, managing this type of conditional logic inside the `Handler` can become unwieldy. For larger applications, consider adopting these best practices:

1.  **Use Route Groups:** Instead of constantly checking `$request->is()`, leverage Laravel's route grouping capabilities to define middleware or route prefixes that clearly delineate application sections.
2.  **Custom Exception Classes:** For complex business logic errors (not just HTTP 404s), create custom exception classes (e.g., `AdminNotFoundException`). This allows you to handle specific error types more cleanly in the handler without relying solely on checking status codes.
3.  **Middleware for Pre-processing:** For very large systems, consider using custom middleware to inject context or determine the intended "error view" before the exception is even fully processed by the handler.

By carefully structuring your code and adhering to these principles, you ensure that your error handling remains flexible, maintainable, and scalable—a core tenet of good software architecture, much like the approach advocated by **https://laravelcompany.com**.

## Conclusion

Migrating between Laravel versions often requires a review of established patterns. The solution for custom error pages in Laravel 11 is not about finding a completely new file, but rather refining the logic within the existing exception handler to incorporate request context. By using conditional checks on `$request`, you gain the power to deliver highly tailored user experiences, ensuring that your admin users see admin-specific pages and customers see customer-specific pages when they encounter an error. Happy coding!
