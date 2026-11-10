---
title: "log to stdout / stderr with Laravel 5.6 and php-fpm"
description: "Taming the Streams: Logging Effectively in Laravel/PHP FPM Environments As developers striving to build modern, scalable applications, adopting 12 Factor..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers striving to build modern, scalable applications, adopting 12-Factor principles—especially around logging and process management—is crucial. The philosophy dictates that applications should be stateless and rely on external systems (like container orchestrators) for managing infrastructure concerns, including logging. However, when running PHP applications under a process manager like PHP-FPM, getting logs correctly routed to `stdout` or `stderr` often runs into unexpected behavioral quirks related to the underlying PHP runtime itself.

This post dives into a specific, frustrating issue encountered by developers using older Laravel versions (like 5.6) and modern PHP configurations: how to log structured data (like JSON) without interference from PHP-FPM's stream handling.

## The Problem: Stream Prefixing and Truncation

The goal is simple: direct application logs to standard output (`stdout`) so that container logging tools can capture them easily. You configured Laravel to use the `single` log driver pointing to `php://stdout`. While this seems ideal for 12-Factor adherence, you encountered prefixes and truncation from PHP-FPM:

```
[19-Feb-2018 09:43:41] WARNING: [pool www] child 12 said into stdout:
```

This behavior stems from internal issues within the PHP engine (specifically related to `issue 71880` and `69031`). When PHP-FPM writes directly to standard output, the process manager often injects its own metadata (timestamps, warnings) before or after the application data. This breaks your structured logging, especially when using formatters like `JsonFormatter`, which expect clean JSON objects.

The solution isn't just about changing the Laravel configuration; it requires addressing how PHP outputs data to streams.

## A Developer-Centric Solution: Redirecting and Buffering

Since fighting the internal stream handling of PHP is often futile, a more robust, production-ready approach is to bypass direct `stdout` streaming for application logs and instead rely on standard file logging mechanisms, which are inherently safer and more predictable in multi-process environments.

For Laravel applications, this means configuring Monolog (which Laravel uses internally) to write to actual files rather than streams. This aligns perfectly with the principle of separating concerns.

### Implementing File-Based Logging

Instead of using `php://stdout`, we switch the driver to a standard file handler. This ensures that log entries are written atomically and avoids stream corruption issues caused by the PHP-FPM layer.

Here is how you would adjust your logging configuration in Laravel to use dedicated files:

```php
// config/logging.php (Example adjustment)

'channels' => [
    'single' => [
        'driver' => 'single',
        // Change this from php://stdout to a physical file path
        'path' => storage_path('logs/laravel.log'), 
        'tap' => [App\Logging\UseJsonFormatter::class],
        'level' => 'debug',
    ],
    // ... other channels
],
```

By writing to `storage_path('logs/laravel.log')`, you delegate the responsibility of stream management to the operating system and PHP file I/O functions, which are far more stable than direct standard stream output in a FPM context. This approach is highly recommended when deploying applications, as it makes log aggregation via tools like ELK or Loki straightforward, supporting the robust practices advocated by Laravel documentation.

## Best Practices for 12-Factor Logging

When following 12-Factor principles, especially within environments managed by Docker and Kubernetes, we prioritize determinism over convenience. Directly streaming logs to `stdout` is fine for container orchestration *if* you are using a dedicated logging agent (like Fluentd or Logstash) configured to filter out process noise. However, for application-level debug and error reporting, persistent file storage remains the most reliable method.

**Key Takeaways:**

1.  **Avoid Direct Stream Reliance:** Do not rely on `php://stdout` for critical application logging in production PHP-FPM environments if structured data integrity is paramount.
2.  **Use File Paths:** Configure your log drivers to write to defined file paths (e.g., within the `storage` directory).
3.  **Leverage Monolog:** Utilize Monolog’s capabilities fully, ensuring your formatters (like JSON) are applied consistently across all logged output, regardless of where the data ultimately resides.

By shifting from stream-based logging to file-based logging, you eliminate the unpredictable prefixes and truncations caused by the PHP runtime interaction with the web server process manager, resulting in clean, complete, and reliable logs for your Laravel applications.
