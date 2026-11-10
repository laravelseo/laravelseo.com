---
title: "SQLSTATE[HY000] [1049] Unknown database - Database created, not functioning"
description: "Solving SQLSTATE[HY000] [1049] Unknown Database During Laravel Migrations As a senior developer working with the Laravel ecosystem, I’ve seen countless..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, I’ve seen countless developers run into frustrating errors during setup. One of the most common—and maddeningly vague—errors is `SQLSTATE[HY000] [1049] Unknown database`. This error typically signals a disconnect between what your application *thinks* it should be connecting to and what the underlying MySQL server actually recognizes at the moment the command executes.

This post will dissect the exact scenario you are facing, explain the root cause, and provide the definitive steps to resolve this issue, ensuring your migrations run smoothly.

---

## Understanding the Discrepancy

You’ve correctly observed that the database (`laravel1`) exists when viewed in a tool like phpMyAdmin. This tells us the database *exists* on the server. However, the error occurs when Laravel, specifically via the Artisan command `php artisan migrate`, attempts to establish a connection and execute a command against that specified database name.

The core problem is not usually that the database doesn't exist, but rather an issue with the **connection context** or **configuration loading** during the migration process, often stemming from subtle mismatches between your environment variables (`.env`) and Laravel’s internal configuration (`config/database.php`).

## The Root Cause: Configuration Mismatch

When you run `php artisan migrate`, Laravel reads the database credentials from the environment file to establish the connection. If there is a conflict—for instance, if the default values in your `database.php` file are overriding or misinterpreting the specific environment variables provided—the PDO driver throws an error because it cannot find the specified target during the execution of the SQL command.

In many local development setups, this often happens when:
1. The database was created manually outside the Laravel setup process (e.g., directly in MySQL).
2. The `DB_DATABASE` variable is set correctly in `.env`, but the framework's internal connection logic fails to initialize the session context properly before executing the migration command.

## Step-by-Step Resolution Guide

To fix this, we need to ensure perfect synchronization between your environment variables and Laravel’s configuration. Follow these steps for a reliable solution:

### 1. Verify Environment Variables (`.env`)

First, double-check that all connection details are correctly defined and accessible to the application. Ensure `DB_DATABASE` is set exactly as you intend it to be.

```dotenv
DB_HOST=localhost
DB_DATABASE=laravel1  # Must match the database you created
DB_USERNAME=root
DB_PASSWORD=somepass
```

### 2. Inspect Database Configuration (`database.php`)

Next, examine your `config/database.php` file. This file dictates how Laravel constructs the connection parameters for Eloquent and migrations. Pay close attention to how the environment variables are being pulled in. Ensure the default values do not interfere with your specific setup.

For a standard MySQL setup, this configuration should look robust:

```php
'mysql' => [
    'driver'    => 'mysql',
    'host'      => env('DB_HOST', 'localhost'),
    'database'  => env('DB_DATABASE', 'forge'), // Ensure this points correctly
    'username'  => env('DB_USERNAME', 'forge'),
    'password'  => env('DB_PASSWORD', ''),
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
    'strict'    => false,
],
```

### 3. The Migration Fix: Re-running Setup

If the configuration appears correct, the most effective solution is often to force Laravel to re-initialize its connection context by running the setup command again. Sometimes, simply clearing the cache or attempting the migration in a fresh terminal session resolves transient state issues.

Try these commands sequentially:

```bash
php artisan cache:clear
php artisan config:clear
php artisan migrate
```

If the error persists after these steps, it strongly suggests an underlying permission issue on the MySQL side, where the `root` user (or whichever user you are connecting as) might have access to the database but lacks the necessary privileges for Laravel’s process to fully interact with it during migration initialization.

## Conclusion

The `SQLSTATE[HY000] [1049]` error is a classic symptom of configuration drift, not necessarily a broken database. By meticulously verifying the synchronization between your `.env` file and `config/database.php`, and by ensuring all Laravel caches are cleared, you can bypass this frustrating hurdle. Remember, robust setup is key to building scalable applications; always prioritize clean environment configurations when working with frameworks like Laravel. For deeper insights into how Laravel manages these connections, exploring the official documentation on resource management is highly recommended.
