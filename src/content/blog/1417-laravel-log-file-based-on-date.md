---
title: "Laravel log file based on date"
description: "Title: Creating Daily Log Files in Laravel Using Custom Configuration Body: In many cases it is beneficial for developers to have fine grained control over..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Creating Daily Log Files in Laravel Using Custom Configuration

Body: In many cases it is beneficial for developers to have fine grained control over the application's logging infrastructure. This can be achieved by storing logs based on specific configurations, such as creating daily log files with filenames corresponding to that day. By doing so, you'll easily manage, store and retrieve your logs according to their date.

To implement this feature in a Laravel application, we first need to extend the default Illuminate\Foundation\Bootstrap\ConfigureLogging bootstrap class. This can be done by creating a new file named 'CustomLogger.php' under your project root directory, typically within an 'App/Http' or 'App/Lib' folder depending on your application structure.

In this newly created file, add the following content:

```php
<?php namespace App;

use Illuminate\Foundation\Bootstrap\ConfigureLogging;

class CustomLogger extends ConfigureLogging
{
    /**
     * Create a new log manager instance.
     *
     * @return \Illuminate\Log\Factory
     */
    public function createLogManager()
    {
        // Get the current date in format 'Y-m-d'
        $today = date('Y-m-d');

        // Override default 'laravel.log' filename with custom filename using current date as prefix
        $filename = "/storage/logs/{$today}/laravel.log";

        return parent::createLogManager([
            'singles' => [
                'daily' => ['file' => $filename],
            ],
        ]);
    }
}
```

This code first creates a new constant for the current date in the format we want (e.g., 'Y-m-d') and then modifies the default log filename to include that date as a prefix. Finally, it creates an instance of Illuminate\Log\Factory using the modified configuration.

Now you'll need to configure your application to use this new Logger class. Add the following lines to your 'config/app.php' file:

```php
<?php

return [
    /* ... */
    'log_manager' => \App\CustomLogger::class,
];
```

Restart your application and verify that the logs are being saved with daily filenames. If everything goes well, you will now have a new log file for each day in the <code>/storage/logs</code> directory, making it much easier to manage, store, and retrieve them based on their respective dates.

Remember that this approach can be further improved using other approaches such as timestamp-based filenames or even by using dedicated logging libraries like Monolog or Sentry. But the basic principle will always remain: extending the default bootstrap class for Laravel to fit your specific needs.

In conclusion, implementing daily log files in a Laravel application is possible through custom configuration and extension of the default 'ConfigureLogging' bootstraper class. By following these steps, you can easily manage and organize your logs based on their associated dates.
