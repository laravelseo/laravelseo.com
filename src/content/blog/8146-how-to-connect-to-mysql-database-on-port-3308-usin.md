---
title: "How to connect to MySQL database on port 3308 using laravel framework 5.1?"
description: "How to Connect to MySQL on Port 3308 Using Laravel Framework As a senior developer, I often encounter frustrating connection issues when setting up database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I often encounter frustrating connection issues when setting up database interactions in frameworks like Laravel. Connecting to a standard service is usually straightforward; however, when dealing with custom ports or complex network configurations, things can quickly turn into cryptic `PDOException` errors.

The scenario you described—trying to connect Laravel's Eloquent ORM via `php artisan migrate:install` and failing with "No connection could be made because the target machine actively refused it"—is a classic symptom of a network or configuration mismatch between the application, the database server, and the operating system's firewall.

This guide will walk you through the correct, robust way to configure your Laravel application to connect to a MySQL instance running on a non-standard port like 3308, resolving the ambiguities in your attempts.

## Diagnosing the Connection Failure

The errors you encountered highlight two potential failure points: network connectivity and authentication.

1.  **`SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it.`**: This error almost always indicates a low-level network refusal. It means the PHP driver (PDO) successfully reached the IP address, but the MySQL service was either not running on that specific port, or a firewall actively blocked the TCP handshake attempt from your application server to the database server.
2.  **`Access denied for user 'homestead'@'10.xxxxxx' (using password: YES)`**: This error indicates that the network connection *was* established, but the credentials provided (`user`/`pass`) were rejected by the MySQL server for that specific host/user combination.

The key is to ensure Laravel uses the most explicit and standard way to define the connection parameters.

## The Correct Approach: Hostname Including the Port

When connecting to a remote service using a non-standard port, the most reliable method is to embed the port directly into the hostname specified in your configuration. This delegates the responsibility of finding the correct endpoint entirely to the network layer, which is what PDO expects.

Forget trying to configure separate `host` and `port` settings if they conflict; instead, combine them:

### Step 1: Configure Your `.env` File

Ensure your environment variables clearly define the full connection string for the host, including the port. This setup is standard practice when dealing with non-default ports.

```dotenv
DB_HOST=10.15.1.5:3308
DB_DATABASE=mydb_dev
DB_USERNAME=user
DB_PASSWORD=pass
```

### Step 2: Configure `config/database.php`

In your Laravel configuration file, you should reference these environment variables directly. When the `DB_HOST` contains the port, the PDO driver handles the rest seamlessly.

```php
// config/database.php

'mysql' => [
    'driver'    => 'mysql',
    // Use the full hostname:port combination here
    'host'      => env('DB_HOST', '10.15.1.5:3308'), 
    'database'  => env('DB_DATABASE', 'mydb_dev'),
    'username'  => env('DB_USERNAME', 'user'),
    'password'  => env('DB_PASSWORD', 'pass'),
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
    'strict'    => false,
],
```

This approach is cleaner because it treats the entire connection string as a single entity, which aligns perfectly with modern database abstraction principles, much like the core philosophy behind frameworks like **Laravel** itself.

## Advanced Troubleshooting: Network and Server Checks

If the above configuration still fails, the problem is almost certainly external to Laravel's code:

1.  **Firewall Check:** Ensure that the server running your Laravel application has outbound access to port 3308 on the database host (`10.15.1.5`). If you are connecting across different subnets or machines, check the security groups or firewall rules immediately.
2.  **MySQL Binding:** Verify that the MySQL service itself is configured to listen on the network interface you expect. Check your MySQL configuration file (`my.cnf` or `my.ini`) to ensure `bind-address` is not restricting access only to `127.0.0.1`.
3.  **MySQL User Permissions:** Double-check that the user (`user`) exists and has privileges specifically granted for connections originating from the IP address your application is running from (e.g., `'user'@'10.15.1.5'`).

## Conclusion

Connecting Laravel to a MySQL database on a custom port requires understanding how network protocols interact with PDO drivers. By consolidating the host and port into a single `DB_HOST` variable, you provide the most direct instruction to the underlying driver, minimizing ambiguity. Always remember that framework functionality relies heavily on stable, correct infrastructure. For deeper dives into Eloquent models and data handling in Laravel, be sure to explore resources on **laravelcompany.com**. By systematically checking network configurations alongside your database settings, you will resolve these connection issues quickly and efficiently.
