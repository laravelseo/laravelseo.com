---
title: "Log PHP exceptions in Laravel Log"
description: "Logging PHP Exceptions in Laravel: Mastering Monolog for Robust Error Reporting As a senior developer, I often encounter situations where custom logging..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I often encounter situations where custom logging implementations feel cumbersome, especially when dealing with critical events like exceptions. You are trying to capture the context of an error, but the system seems to ignore the exception details, leading to incomplete debugging information.

The issue you are facing stems from how you are manually constructing and populating your Monolog logger within your `LogWritter` class. While custom log files work fine for simple strings, logging exceptions requires a specific approach that leverages the full context provided by PHP's error handling mechanisms.

Let’s break down why your current approach isn't capturing the exception details and how to implement a robust solution that aligns with Laravel’s philosophy of clean, expressive code.

## The Pitfall of Manual Logging

Your current implementation focuses solely on logging `$logMessage`:

```php
// Your current call:
$exception = $e->getMessage();
Api\ApplicationEvents\LogWritter::write($exception, 'Error');
```

When you only pass the message string to a generic logging function, Monolog (or your custom setup) doesn't automatically attach the stack trace or the exception object details unless specifically instructed to do so. Simply logging the message loses the crucial context of *where* and *how* the error occurred.

To log an exception effectively, you must pass the actual `Exception` object to the logger. This allows Monolog to format the entry with the full stack trace, which is essential for debugging production issues.

## The Solution: Logging the Exception Object

The correct approach is to utilize the specific logging methods provided by Monolog, or ensure your custom writer passes the exception data correctly. Instead of extracting just `$e->getMessage()`, pass the entire object.

Here is how you can refactor your `write` method to properly handle exceptions within your custom logger:

```php
<?php namespace Api\ApplicationEvents;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Exception; // Ensure Exception is imported

class LogWritter {

    /**
     * Writes a message along with an optional exception object.
     *
     * @param string $logMessage The primary message to log.
     * @param string $logLevel The severity level (e.g., 'Error', 'Info').
     * @param Exception|null $exception The exception object, if any.
     */
    public static function write(string $logMessage, string $logLevel, ?Exception $exception = null)
    {
        $date = date('d_m_y');
        $logFile = public_path() . '\logs\log_' . $date . '.log';

        // ... (File handling logic remains the same) ...

        $log = new Logger('Menu App Log: ');

        switch ($logLevel) {
            case 'Info':
                $log->pushHandler(new StreamHandler($logFile, Logger::INFO));
                break;
            case 'Error':
                // Crucially, we use the specific logging method for errors
                $log->pushHandler(new StreamHandler($logFile, Logger::ERROR));
                break;
            default:
                return;
        }

        // --- The key change is here ---
        if ($exception) {
            // Use Monolog's built-in method to handle exceptions correctly.
            $log->error($logMessage, ['exception' => $exception]); 
        } else {
            $log->info($logMessage);
        }
    }
}
```

### Best Practice: Leveraging Laravel’s Native Tools

While creating custom log writers is powerful for specific application events, remember that in a larger Laravel application, you should prioritize using the framework's built-in error handling. Laravel provides excellent mechanisms for catching exceptions and logging them automatically through its service container and exception handler. This ensures consistency and leverages robust features provided by the framework—a core principle of building scalable applications on platforms like [laravelcompany.com](https://laravelcompany.com).

For standard application errors, relying on `Log::error($message, ['exception' => $e])` directly within your controllers or services is often cleaner than routing everything through a custom writer, unless you have a very specific, highly customized logging requirement.

## Conclusion

The reason your exception wasn't being written is that simply logging the message (`$e->getMessage()`) discards the critical stack trace and object context needed for debugging. By modifying your `LogWritter::write` function to accept and pass the actual `$exception` object to Monolog’s appropriate methods (like `error()`), you ensure that all necessary diagnostic information—the message, the level, and the full stack trace—is correctly persisted in your log file. Always aim to log the *object*, not just the string representation of the error, for truly effective debugging.
