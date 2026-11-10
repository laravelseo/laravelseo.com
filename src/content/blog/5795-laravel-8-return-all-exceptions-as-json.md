---
title: "Laravel 8 return all exceptions as json"
description: "Laravel 8: Returning All Exceptions as JSON for Robust API Development As developers building modern APIs with Laravel, consistency in error handling is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As developers building modern APIs with Laravel, consistency in error handling is paramount. When an application throws an exception, the response delivered to the client should be predictable—ideally structured JSON data rather than raw HTML error pages. Many developers attempt to customize this behavior, especially when dealing with API endpoints. However, achieving this seamlessly across all exceptions in Laravel 8 can be tricky, as the framework defaults to standard view rendering unless explicitly told otherwise.

This post dives into why your attempts might have failed and provides a robust, developer-centric solution for ensuring all exceptions are returned as clean JSON responses.

## Understanding Laravel's Exception Handling Mechanism

Laravel manages exceptions through the `Illuminate\Foundation\Exceptions\Handler` class. When an exception is thrown during a request lifecycle, the handler decides how to render it. By default, if the request is not explicitly an API request or if certain view-related errors occur, Laravel defaults to rendering standard error views (HTML).

The user attempt you shared in Laravel 5, modifying the `render` method directly, was a valid starting point, but modern Laravel versions require a more nuanced approach to ensure that JSON formatting is applied consistently for API interactions. Simply overriding the default behavior might miss edge cases or fail when dealing with specific framework errors versus application logic errors.

## The Robust Solution: Customizing the Render Logic

To reliably return all exceptions as JSON, we need to intercept the rendering process and force a JSON structure whenever an exception is present. This should be done within your custom Exception Handler.

Here is how you can modify `app/Exceptions/Handler.php` to enforce JSON responses for errors:

```php
<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Console\Command\InvalidArgumentException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
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
    public function render($request, Throwable $exception)
    {
        // Check if the request is an API request (optional but good practice)
        if ($request->wantsJson() || $request->is('api/*')) {
            return $this->renderJson($exception, $request);
        }

        // For all other requests, fall back to the default rendering behavior
        return parent::render($request, $exception);
    }

    /**
     * Custom logic to render exceptions as JSON.
     */
    protected function renderJson(Throwable $exception, Request $request)
    {
        // Determine the appropriate status code and message based on the exception type
        $statusCode = ($exception instanceof \Illuminate\Http\Exception\HttpResponseException) ? 400 : 500;

        return Response::json([
            'error' => $exception->getMessage(),
            'code' => $exception->getCode() ?: $statusCode,
            'trace' => config('app.debug') ? $exception->getTraceAsString() : null,
        ], $statusCode);
    }
}
```

### Why this approach works:

1.  **Conditional Rendering:** We first check if the request is intended to be an API call using `$request->wantsJson()` or checking the URI prefix (`api/*`). This prevents forcing JSON responses on standard web routes that might require HTML views.
2.  **Centralized Logic:** By creating a dedicated `renderJson` method, we keep the logic clean and reusable, adhering to good object-oriented principles.
3.  **Contextual Data:** Instead of just returning the raw message (which can expose sensitive internal details), we package the error into a structured JSON format including an appropriate status code and optionally the trace for debugging purposes (only if `APP_DEBUG` is true).

This strategy ensures that you control exactly what data leaves your application, providing a much more professional API experience. This level of fine-grained control over exception handling is crucial when scaling applications, aligning with the principles promoted by robust frameworks like those found on resources such as https://laravelcompany.com.

## Conclusion

Moving from simple HTML error pages to consistent JSON error responses requires moving beyond simple overrides in the `render` method. By implementing conditional logic within your custom handler and leveraging Laravel's request context, you gain the power to dictate the exact structure of your error feedback. This practice is essential for building scalable, reliable APIs in any version of Laravel. Always prioritize structured data output when developing services that communicate via HTTP.
