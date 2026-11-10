---
title: "Laravel log level, how is different?"
description: "Laravel Log Levels: Understanding the Severity Hierarchy As a senior developer working with frameworks like Laravel, understanding how logging systems work..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As a senior developer working with frameworks like Laravel, understanding how logging systems work is crucial for effective debugging, monitoring, and managing application health. You've correctly observed the available logging methods (`Log::emergency`, `Log::error`, etc.) and the configuration setting in your `.env` file. The core question remains: what is the actual difference between these levels, and how do they affect what gets recorded?

This deep dive will explain the hierarchy of log levels used by Laravel, how they map to the underlying Monolog library, and why understanding this structure is essential for production environments.

---

## The Philosophy Behind Log Levels

Log levels are not arbitrary; they represent a severity scale. When you configure your application to log at a certain level (e.g., `debug`), the system acts as a filter. It will only record messages that are equal to or more severe than the configured threshold.

The framework leverages the PSR-3 standard via Monolog, which defines these levels clearly. The sequence, from least severe to most severe, is critical:

1.  **`DEBUG`**: Fine-grained information, typically useful only when diagnosing problems.
2.  **`INFO`**: Interesting events that occur during the application's execution (e.g., a request started or completed).
3.  **`NOTICE`**: Normal but potentially noteworthy events.
4.  **`WARNING`**: An indication that something unexpected happened, or indicative of some problem in the near future (e.g., deprecated features being used).
5.  **`ERROR`**: A serious problem occurred, but the application can continue running.
6.  **`CRITICAL`**: A severe error, indicating that the application is in a critical state and may be unable to perform its function.
7.  **`ALERT`**: Action must be taken immediately. This level is typically used for events that require immediate human intervention (e.g., system overload).
8.  **`EMERGENCY`**: System is unusable. This signifies a catastrophic failure where the application cannot continue operating at all.

## How Thresholds Control the Output

The setting you adjust in your `.env` file, `APP_LOG_LEVEL`, determines the *minimum* severity level that will be written to the log files.

If you set:
```dotenv
APP_LOG_LEVEL=error
```
This means the logging system will ignore all messages logged at the `debug`, `info`, `notice`, and `warning` levels, focusing only on events marked as `error`, `critical`, `alert`, or `emergency`.

**The key difference is filtering:** If your application is running at `error` level, a simple `Log::info('User requested page')` message will be silently discarded. Conversely, if you set the level to `debug`, *all* messages (from `debug` upwards) will be recorded.

## Practical Code Example: Logging Scenarios

Consider logging a database connection failure. How do the levels change the context?

```php
use Illuminate\Support\Facades\Log;

// Scenario 1: A minor issue during request processing
Log::info('User session loaded successfully.', ['user_id' => 42]); 
// This will be logged if APP_LOG_LEVEL is INFO or lower.

// Scenario 2: An unexpected warning that might affect future operations
Log::warning('Database query took longer than expected.', ['duration' => 500]);
// This requires the log level to be WARNING or lower to be recorded.

// Scenario 3: A failure that stops a critical process
try {
    throw new \Exception("Payment gateway failed.");
} catch (\Throwable $e) {
    Log::error("Payment processing failed.", ['exception' => $e->getMessage()]);
    // This event is captured at the ERROR level.
}

// Scenario 4: Total system failure requiring immediate attention
Log::critical('System halt imminent due to unrecoverable error.');
// This is the highest severity and should always be logged if the system is truly broken.
```

## Conclusion

The distinction between log levels is fundamentally about **context and urgency**. By using the correct level, you allow your monitoring tools and developers to quickly triage issues. In a production setting, it is best practice to set the `APP_LOG_LEVEL` to `error` or `critical`. This ensures that only genuinely problematic events interrupt your attention, while still preserving the full severity hierarchy available through methods like those exposed in [Laravel](https://laravelcompany.com)'s logging capabilities. Mastering this filtering mechanism is a hallmark of writing robust and maintainable Laravel applications.
