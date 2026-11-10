---
title: "laravel return exception as json instead of an html"
description: "Returning Laravel Exceptions as JSON: Moving Beyond HTML Error Pages As developers building modern applications, especially those serving APIs, the way..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As developers building modern applications, especially those serving APIs, the way errors are presented is just as important as how they are handled internally. When an exception occurs in a standard Laravel application, the default behavior is to render a user-friendly (or sometimes unhelpful) HTML error page. For API development, this is entirely unsuitable; we need structured, machine-readable responses, typically JSON.

This post dives into how you can customize Laravel's exception handling mechanism to ensure that exceptions are returned as detailed JSON objects instead of raw HTML, giving you full context for debugging and client-side error management.

## Understanding the Default Exception Flow

Laravel centralizes all uncaught exceptions and errors through the `app/Exceptions/Handler.php` file. This class dictates how Laravel decides what to render when an exception occurs. In newer versions of Laravel (like v7+), this handler is designed to manage both web requests (rendering views) and API responses.

Your goal is to intercept this process and force a JSON response whenever an error is thrown, rather than letting the default rendering mechanism take over. Simply returning the exception object directly in a controller method, as you attempted, often results in an empty object because the framework expects a specific response format derived from the handler.

## Customizing the Exception Renderer

To achieve structured JSON output for exceptions, we need to override the core logic within the `render()` method of your custom exception handler. This is the most robust way to control the response format across your entire application.

Here is how you can modify your `app/Exceptions/Handler.php` file to force JSON responses for exceptions:

```php
<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Console\MissingArgumentException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Localization\NotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function render(Request $request, Throwable $exception)
    {
        // Check if we are handling an API request (e.g., checking the Accept header or route prefixes)
        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            return $this->renderJson($request, $exception);
        }

        // Fallback to the default behavior for web requests (rendering HTML)
        return parent::render($request, $exception);
    }

    /**
     * Custom logic to render exceptions as JSON.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\JsonResponse
     */
    protected function renderJson(Request $request, Throwable $exception)
    {
        // Customize the data you want to expose in the JSON response.
        // We include the message, file, and line number for full context.
        return response()->json([
            'message' => $exception->getMessage(),
            'code' => $exception->getCode(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(), // Include the full stack trace for debugging
        ], $exception->getStatusCode());
    }
}
```

## Explanation of the Implementation

The key to this solution lies in overriding the `render()` method. By checking if the incoming request expects JSON (using `$request->wantsJson()`), we can selectively execute our custom logic instead of falling back to the default HTML renderer (`parent::render(...)`).

The helper method, `renderJson()`, is where the magic happens. Instead of just returning a simple message, we are explicitly constructing an array containing rich debugging data: the exception message, the code, file location, and crucially, the full stack trace (`$exception->getTraceAsString()`). This provides the client with everything needed to diagnose the error without relying on Laravel's default view layer.

This approach aligns perfectly with best practices when building robust APIs using Laravel. For more advanced API structuring and ensuring consistent JSON responses, exploring tools like Laravel Pact or leveraging services from the [Laravel Company](https://laravelcompany.com) ecosystem can be highly beneficial.

## Conclusion

By customizing the `render()` method in your exception handler, you gain complete control over how exceptions are communicated to the outside world. This transforms error reporting from a simple HTML page into a rich, actionable JSON payload, significantly improving the experience for API consumers and streamlining your error debugging process. Remember that controlling input/output flow is fundamental when developing systems on the Laravel framework.
