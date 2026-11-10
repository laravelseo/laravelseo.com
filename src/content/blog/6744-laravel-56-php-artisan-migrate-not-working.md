---
title: "Laravel 5.6 | PHP artisan migrate not working"
description: "Laravel 5.6 | PHP artisan migrate not working: Solving the macOS/MAMP Connection Nightmare As a senior developer, I’ve seen countless tickets where seemingly..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless tickets where seemingly simple commands like `php artisan migrate` stall out with cryptic SQL errors. The frustration is real, especially when you have perfect configuration on another operating system (like Windows/XAMPP) but hit a wall on macOS/MAMP.

The issue you are encountering—the `SQLSTATE[HY000] [2002] No such file or directory` error during migration—is almost always a database connection problem, specifically related to how PHP’s PDO driver attempts to locate the MySQL server socket file. This is a classic environment configuration mismatch rather than a bug in Laravel itself.

Let's dive deep into why this happens and the definitive steps to fix your migration process on macOS.

***

## Understanding the Error: The Socket File Problem

The error message `No such file or directory` points directly to the operating system failing to find the specified MySQL socket path (`/tmp/mysql.sock`). When Laravel tries to execute a query via PDO, it relies on this connection string to establish communication with the database server.

This issue is highly common in environments like MAMP (on macOS) because the default configuration for how PHP connects to the local MySQL instance differs significantly from how XAMPP handles it on Windows. Even when you manually adjust settings in your `.env` file, if the underlying system path or MAMP's internal setup hasn't been correctly updated, the connection will fail at the lowest level before Laravel can even execute the migration command.

## Why Your Attempts Didn't Work

You correctly identified and attempted common fixes: changing `localhost` to `127.0.0.1`, adjusting the port (`DB_PORT`), and explicitly adding `'unix_socket' => '/tmp/mysql.sock'` to `config/database.php`. While these steps are vital for general connectivity, they often fail when the system’s default socket location is incorrect or inaccessible to the specific PHP process running Artisan.

The core problem isn't just pointing to a file; it's ensuring that the *exact* path specified in your configuration (`/tmp/mysql.sock`) actually exists and is accessible by the user context running the command, especially when using MAMP's service management.

## Definitive Solutions for macOS/MAMP

Since we are dealing with an environment-specific file system issue, the solution involves verifying the MySQL installation path and ensuring PHP has proper permissions.

### 1. Verify the Actual Socket Location

First, you need to confirm where your specific MAMP installation is placing its socket file. You can often find this by checking the MAMP documentation or inspecting standard MySQL installation paths on macOS.

If the default path is indeed `/tmp/mysql.sock`, ensure that file exists and has the correct permissions. If it does not, you must either create it (which
