---
title: "Laravel 5 different log levels for development and production"
description: "Laravel Logging Levels: Mastering Development vs. Production Environments As developers working with frameworks like Laravel, managing logging effectively..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with frameworks like Laravel, managing logging effectively across different environments—development, staging, and production—is a crucial aspect of application health and security. Developers often find themselves needing to capture verbose debugging information during development but must strictly limit sensitive details in production to prevent information leakage.

This post addresses the common challenge: how to selectively filter log messages based on the environment without rewriting core framework functionality. We will explore existing methods, evaluate custom solutions, and establish the best practice for controlling log verbosity in your Laravel application.

## Understanding Laravel Logging and Monolog Levels

Laravel’s logging system is built on top of Monolog, a popular PHP logging library. Monolog defines a set of standard severity levels that dictate the importance of a log message. These levels are: `emergency`, `alert`, `critical`, `error`, `warning`, `notice`, `info`, and `debug`.

When you use the `Log::level()` methods in Laravel, you are essentially mapping these semantic levels to the underlying Monolog integer values (where `error` is typically 400). In development, we often log everything for maximum visibility. In production, however, we only want to capture true failures.

The core issue you face—ignoring lower-priority logs in production—is a classic operational requirement that requires environment-aware filtering.

## Existing Solutions: Configuration vs. Custom Logic

When tackling this problem, there are generally three approaches: relying on framework configuration, utilizing dedicated logging channels, or implementing custom wrappers.

### 1. Environment-Based Configuration (The Framework Approach)

Laravel itself provides excellent environment control via the `.env` file and `APP_DEBUG`. While `APP_DEBUG=true` controls how errors are displayed to the user, it does not inherently filter what is written to the log files themselves. Therefore, relying solely on framework configuration is insufficient for fine-grained logging control.

### 2. Custom Wrapper Implementation (The Direct Approach)

Since you require filtering based on a custom threshold (e.g., only log messages at level 400 or higher), creating a dedicated service layer that wraps the `Log` facade offers the most direct control. This approach allows you to inject your environment check directly into every logging call, ensuring consistency regardless of where the logging originates in your codebase.

This is often the most robust solution when standard configuration tools fall short. You can implement this logic within a Service Provider or a custom Facade implementation, which aligns well with best practices for extending Laravel functionality, much like how you extend core features found on platforms like [laravelcompany.com](https://laravelcompany.com).

### 3. Monolog Channel Management (The Advanced Approach)

For very large applications, an alternative is to configure Monolog channels specifically. You could define separate logging channels for development and production and assign different handlers or log file paths to them. However, this adds significant complexity when dealing with the general `Log` facade calls you are currently making.

## Implementing the Threshold Filter

Given your specific requirement—only logging `error`, `critical`, `alert`, or `emergency` in production—the custom wrapper approach is highly practical and maintainable. We will create a simple service to check the environment variable before allowing a log message to proceed.

Here is an example of how you might structure this logic, typically within a dedicated Logging Service:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class CustomLoggerService
{
    /**
     * Determines if a log message should be processed based on the environment threshold.
     * @param string $level The desired log level (e.g., 'info', 'error').
     * @return bool
     */
    public function shouldLog(string $level): bool
    {
        // Get the configured minimum logging level from the environment
        // We map the required levels to Monolog integers: Emergency=0, Alert=1, Critical=2, Error=3, Warning=4, etc.
        $threshold = (int) env('LOG_THRESHOLD', 400); // Default to 400 if not set

        if ($level === 'error') {
            return $threshold <= 3; // Log Error and above in production
        }
        if ($level === 'critical') {
            return $threshold <= 2; // Log Critical and above in production
        }
        if ($level === 'alert') {
            return $threshold <= 1; // Log Alert and above in production
        }
        if ($level === 'emergency') {
            return $threshold <= 0; // Log Emergency and above in production
        }

        // For lower levels (info, debug, notice, warning), always log if not in production, or ignore them in prod.
        return env('APP_ENV') !== 'production';
    }

    /**
     * A wrapper method to conditionally log messages.
     */
    public function log(string $level, string $message, array $context = [])
    {
        if ($this->shouldLog($level)) {
            // Use the standard Laravel Log facade internally if the check passes
            Log::{$level}($message, $context);
        }
    }
}
```

### Usage Example:

Instead of calling `Log::info(...)` directly throughout your application, you would inject and use this service:

```php
use App\Services\CustomLoggerService;

class SomeController extends Controller
{
    protected $logger;

    public function __construct(CustomLoggerService $logger)
    {
        $this->logger = $logger;
    }

    public function handleRequest()
    {
        // Development: Logs everything (info, debug, etc.)
        $this->logger->log('info', 'Request handled successfully.'); 
        
        // Production: Only logs errors and criticals
        $this->logger->log('info', 'This debug message will be suppressed in production.'); 
    }
}
```

## Conclusion

While there is no single, built-in command to achieve this exact filtering across the entire Monolog stack, creating a custom service wrapper provides the necessary control and maintainability. It shifts the responsibility of environment awareness from scattered code checks to a centralized configuration point. By implementing this approach, you ensure that your application adheres to strict production logging policies while retaining the rich diagnostic detail needed during development. Remember, robust architecture, like that promoted by [laravelcompany.com](https://laravelcompany.com), often involves smart customization of core components to fit specific business needs.
