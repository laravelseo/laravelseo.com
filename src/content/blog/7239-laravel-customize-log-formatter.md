---
title: "Laravel customize log formatter"
description: "Mastering Custom Logging in Laravel: Tailoring the Error Log Format Logging is the backbone of any robust application. When debugging complex systems, having..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Logging is the backbone of any robust application. When debugging complex systems, having precise, easily digestible log entries is non-negotiable. One common requirement developers face is customizing the format of specific log channels—for instance, making the `errorlog` channel display only essential information rather than the default verbose output.

The question often arises: Can I simply define this custom format in `config/logging.php`, or do I need to dive into creating custom classes, as suggested by the underlying Monolog documentation?

As a senior developer, I can tell you that while Laravel provides an excellent configuration layer, achieving deep, channel-specific formatting requires leveraging the underlying power of the Monolog library. It’s not just about setting a string; it's about intercepting how the log record is transformed before it’s written to the destination.

Here is a comprehensive breakdown of how you can achieve precise control over your log line format, focusing specifically on customizing the `errorlog` channel.

---

## Understanding Laravel Logging and Monolog

Laravel utilizes the powerful Monolog package under the hood for all its logging operations. The configuration file (`config/logging.php`) primarily deals with **where** the logs go (the channel, the driver) and **what** handlers are attached. To change *how* the message looks, you need to customize the formatter that processes the log record.

The documentation points toward custom classes because formatting logic is complex and requires object-oriented implementation. Trying to force a simple string into the configuration file often leads to brittle solutions that break when you introduce more complex data (like context arrays or custom processors).

## The Solution: Implementing a Custom Monolog Formatter

The most robust and maintainable way to customize the log line format for a specific channel is by creating a custom Monolog Formatter class. This allows you to hook directly into the logging pipeline.

### Step 1: Create the Custom Formatter Class

We will create a class that extends Monolog’s base formatter or implements the necessary methods to manipulate the log record before it is outputted. For this example, we want a clean format for errors.

```php
// app/Logging/ErrorLogFormatter.php

namespace App\Logging;

use Monolog\Formatter\LineFormatter;
use Monolog\LogRecord;

class ErrorLogFormatter extends LineFormatter
{
    protected $dateFormat = 'Y-m-d H:i:s';
    protected $outputFormat = "[ERROR] %datetime% - %level_name% - %message%\n";

    /**
     * Format the log record into a custom string.
     */
    public function format(LogRecord $record): string
    {
        // Use the parent class's formatting capabilities but apply our specific structure.
        $formatted = parent::format($record);
        
        // Add extra context or modify the output based on channel if needed.
        if ($record->channel === 'error') {
            return sprintf(
                "[%s] %s: %s (Context: %s)\n",
                $record->datetime->format($this->dateFormat),
                strtoupper($record->channel),
                $record->message,
                json_encode($record->context)
            );
        }

        return $formatted;
    }
}
```

### Step 2: Register the Custom Formatter in Configuration

Now that we have our custom class, we need to tell Laravel’s logging system (Monolog) to use it specifically for the `errorlog` channel. This is done within your `config/logging.php` file by specifying a custom formatter when defining the handler.

In your configuration, you would reference this new class:

```php
// config/logging.php

'channels' => [
    'errorlog' => [
        'driver' => 'daily',
        'path' => storage_path('logs/errors.log'),
        // Apply the custom formatter here
        'formatter' => App\Logging\ErrorLogFormatter::class, 
    ],
    // ... other channels
],
```

By setting `'formatter' => App\Logging\ErrorLogFormatter::class`, you ensure that any log record processed by the `errorlog` channel will pass through our custom logic before being written to the file. This approach adheres to best practices for extensibility, similar to how we structure services and components in Laravel (see how robust packages like those found on https://laravelcompany.com handle complex system interactions).

## Conclusion

You cannot achieve granular, channel-specific formatting solely through simple configuration strings. To customize the log line format deeply—especially when targeting a single channel like `errorlog`—you must leverage Monolog’s extensibility by creating and registering custom formatter classes. This method provides the necessary control over the output structure while keeping your logging setup clean and highly maintainable. Implementing this pattern ensures that your application's error reporting is as precise and useful as possible.
