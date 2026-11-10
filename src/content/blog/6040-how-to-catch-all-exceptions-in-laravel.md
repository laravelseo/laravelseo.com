---
title: "How to catch all exceptions in Laravel"
description: "How to Catch All Exceptions in Laravel and Store Them in the Database As a senior developer working with the robust ecosystem of Laravel, understanding how..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As a senior developer working with the robust ecosystem of Laravel, understanding how exceptions flow through the application is crucial for building resilient and maintainable systems. The question of how to catch *all* exceptions and persist them to a database touches upon logging, error handling, and data integrity—all critical areas in large-scale application development.

While there are many third-party packages available, often the most effective solution lies not in overriding core framework behavior but in implementing a structured, custom error management pipeline tailored to your specific business needs.

## The Laravel Exception Handling Mechanism

In Laravel, exceptions are handled primarily through the `App\Exceptions\Handler` class. This is the central point where all uncaught exceptions (and recoverable ones) are caught before they are displayed to the user or logged by default.

If you want to intercept every error that bubbles up—whether it’s a standard `ModelNotFoundException`, an application-specific error, or a critical system failure—you need to customize this handler. Simply using the default behavior might result in errors being logged only to files, which is insufficient if your requirement is database persistence.

## Strategy: Customizing the Handler for Database Logging

To achieve your goal of storing exceptions in a database, you need to extend the default error reporting mechanism. The best practice here involves leveraging Laravel's existing logging capabilities (Monolog) and creating a custom logging channel that pushes critical errors into your relational database.

Here is the conceptual approach:

1.  **Extend the Handler:** Create a custom exception handler that extends `Illuminate\Foundation\Exceptions\Handler`.
2.  **Intercept Exceptions:** Override methods like `report()` or create custom logic within the `render()` method to catch exceptions before they are handled by default.
3.  **Persist Data:** When an exception is caught, extract key details (class, message, stack trace, timestamp) and use your Eloquent models to store this information in a dedicated `error_logs` table.

## Practical Implementation Example

Let's demonstrate how you might implement a custom logging method within your handler. Imagine you have an `ErrorLog` model set up in your database:

```php
<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Throwable;
use App\Models\ErrorLog; // Assuming you have an ErrorLog model

class CustomExceptionHandler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string>
     */
    protected $dontReport = [
        //
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Throwable
     */
    public function report(Throwable $exception)
    {
        // 1. Log the exception using the default mechanism (optional, but good practice)
        parent::report($exception);

        // 2. Custom Logic: Store critical exceptions in the database
        if ($exception instanceof \Exception) {
            ErrorLog::create([
                'exception_class' => get_class($exception),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
                'status' => 'error',
            ]);
        }
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // You can still handle rendering the error to the user here, 
        // while ensuring it has already been logged above.
        return parent::render($request, $exception);
    }
}
```

## Conclusion: Building Resilient Systems

While catching *all* exceptions globally is an advanced technique, it is a powerful way to ensure that no critical error slips through the cracks and can be reviewed retrospectively in your database. Remember, Laravel provides excellent tools for logging via Monolog; by extending the `Handler`, you are essentially creating an intelligent middleman that ensures data persistence alongside standard application flow.

By implementing this strategy, you move beyond simple file-based logging to establish a centralized, searchable record of application failures, which is essential for debugging complex systems and maintaining high standards—much like the focus on clean architecture promoted by frameworks like Laravel.
