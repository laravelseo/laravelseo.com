---
title: "Laravel migration could not find driver"
description: "Solving the Dreaded \"Could Not Find Driver\" Error in Laravel Migrations As a senior developer working with the Laravel ecosystem, we often encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we often encounter frustrating roadblocks when setting up database interactions. One of the most common and maddening errors developers face during setup or migration attempts is the `Illuminate\Database\QueryException: could not find driver`. This error doesn't point to an issue in your Eloquent models or migration files; instead, it signals a fundamental problem with your PHP environment and its ability to communicate with the underlying database.

This post will dive deep into why this error occurs, dissect the configuration you provided, and give you a step-by-step guide to resolve this issue so you can successfully run `php artisan migrate`.

## Understanding the "Could Not Find Driver" Error

When Laravel attempts to connect to a database (like MySQL, PostgreSQL, or SQLite), it relies on PHP's Data Objects (PDO) extension to handle the communication. The error "could not find driver" means that the specific PDO driver required for your selected database connection is either not installed on your server or is not enabled in your PHP configuration (`php.ini`).

In your specific case, since you are connecting via `DB_CONNECTION=mysql`, Laravel expects the `pdo_mysql` extension to be present and loaded. The error occurs because PHP cannot find this necessary module when initializing the database connection handler.

## Analyzing Your Configuration

Let’s examine the configuration you provided to see where the disconnect might be happening:

**Your `.env` File:**
```dotenv
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=lsapp
DB_USERNAME=root
DB_PASSWORD=
```

**Your `config/database.php` Snippet (for the `mysql` driver):**
```php
'mysql' => [
    'driver' => 'mysql',
    // ... other settings
    'options' => extension_loaded('pdo_mysql') ? array_filter([
        PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
    ]) : [],
]
```

The configuration itself is logically sound. The code correctly checks if `pdo_mysql` is loaded before attempting to use it, which is good practice. This confirms that the *application* is asking for a driver that it cannot find in the *environment*. Therefore, the solution lies outside of Laravel's configuration and within your PHP setup.

## Step-by-Step Solution: Enabling the PDO MySQL Driver

To fix this, you must ensure that the necessary PHP extension is installed and enabled on the system where your Laravel application is running (e.g., your local machine or Docker container).

### 1. Check Installed Extensions

First, check which extensions are currently loaded in your PHP environment by running:
```bash
php -m
```
Look for `pdo_mysql` in the output. If it is missing, proceed to the next step.

### 2. Enable the Extension via `php.ini`

You need to locate your active `php.ini` file and uncomment (or add) the line that loads the MySQL PDO driver.

1.  **Locate `php.ini`**: You can find this by running `php --ini`.
2.  **Edit the File**: Open the file and search for the line related to `pdo_mysql`. It should look similar to this (depending on your OS/installation):
    ```ini
    extension=pdo_mysql
    ```
3.  **Save and Restart**: Save the `php.ini` file. Crucially, if you are running a web server or FPM, you must restart the service for the changes to take effect.

If you are using a package manager like `apt` or `yum`, you might need to install the necessary package first (e.g., `sudo apt install php-mysql`).

## Conclusion and Best Practices

The "could not find driver" error is almost always an environment setup issue, not a Laravel code bug. By ensuring that the `pdo_mysql` extension is properly installed and loaded in your PHP configuration, you resolve this connection roadblock immediately.

Remember, robust application development starts with a solid foundation. When building scalable applications using frameworks like Laravel, understanding the underlying environment—the operating system, the web server, and the PHP extensions—is just as crucial as mastering Eloquent relationships. Always ensure your dependencies are correctly configured before moving on to complex business logic or advanced features. For more deep dives into Laravel architecture and best practices, I highly recommend exploring resources from [laravelcompany.com](https://laravelcompany.com). Happy coding!
