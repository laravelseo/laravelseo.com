---
title: "Installing Laravel 5.1 on OSX with MAMP"
description: "Troubleshooting Laravel Migration Errors on OSX with MAMP: Solving the No such file or directory Issue As a senior developer, I’ve seen countless..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless developers stumble when setting up local environments, especially when dealing with older frameworks like Laravel 5.1 on macOS using tools like MAMP. The specific error you encountered—`[PDOException] SQLSTATE[HY000] [2002] No such file or directory` during database migration—is a classic symptom of an environment misconfiguration, not necessarily a bug in the Laravel code itself.

This post will dissect why this error occurs in the context of MAMP on OSX and provide a step-by-step guide to diagnosing and resolving this common connectivity issue.

## Understanding the Error Context

The `PDOException: SQLSTATE[HY000] [2002] No such file or directory` indicates that the PHP Data Objects (PDO) layer, which Laravel uses to communicate with the MySQL database, failed to locate the necessary configuration or the actual database file/socket. In a local setup managed by MAMP, this usually boils down to one of three problems:

1.  **MySQL Service Status:** The MySQL server is not running.
2.  **Incorrect Configuration:** The `.env` file points to an inaccessible host or port.
3.  **Path Issues (The OSX Factor):** PHP cannot find the correct socket or configuration files because the environment variables are misconfigured for the local MAMP setup.

When running migrations (`php artisan migrate`), Laravel attempts to establish a connection, and if the underlying PDO driver cannot find the required MySQL resources, the migration fails immediately before any SQL is executed.

## Step-by-Step Troubleshooting Guide

Here is the definitive process for fixing this connectivity issue on your OSX/MAMP environment:

### 1. Verify MAMP Service Status

Before diving into code, ensure your database server is active. Open your MAMP application and confirm that the MySQL service is running successfully. If it didn't start automatically, try manually starting the server via the MAMP control panel. A dead MySQL server will inevitably lead to a "No such file or directory" error when PHP tries to connect.

### 2. Inspect the `.env` File Configuration

The most common culprit is incorrect database configuration within your Laravel application's `.env` file. Double-check these critical lines:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1  # Or localhost, depending on your MAMP setup
DB_PORT=3306
DB_DATABASE=your_laravel_db_name
DB_USERNAME=root
DB_PASSWORD=your_password
```

Ensure that `DB_HOST` is correctly pointing to the MySQL server (usually `127.0.0.1`). If you are running into persistent issues, try explicitly setting the connection via the socket path if your MAMP installation requires it, though for most modern setups, standard TCP/IP addressing works fine.

### 3. Check PHP and MySQL Connectivity Manually

To isolate whether the problem is Laravel-specific or a general PHP/MySQL connectivity issue, test the connection directly from the command line using the MySQL client:

```bash
mysql -u root -p
```

If you can successfully log into the MySQL prompt, it confirms that your MAMP installation and database server are functioning correctly. If this command fails, the problem lies entirely with your MAMP setup (Step 1).

## Best Practices for Local Development

When working locally, understanding how environments interact is crucial. As we explore framework development, remember that robust environment management is a cornerstone of reliable application deployment. Following established practices, such as those promoted by organizations focusing on modern PHP frameworks like [laravelcompany.com](https://laravelcompany.com), ensures that your setup remains stable regardless of the operating system you are using.

If all checks pass and the error persists, it might be related to file permissions within your MAMP installation directory, which is a common headache on macOS. Ensure that your user account has the necessary read/write permissions for the directories where PHP attempts to access configuration files.

## Conclusion

The `PDOException` during Laravel migrations on OSX with MAMP is almost always an environmental setup issue rather than a code error. By systematically checking the MySQL service status, verifying the `.env` file credentials, and performing direct connectivity tests, you can quickly isolate the root cause. Mastering these local environment checks will save countless hours of debugging time, allowing you to focus on building powerful applications instead of wrestling with configuration files.
