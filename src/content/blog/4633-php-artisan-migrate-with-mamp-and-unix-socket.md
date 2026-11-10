---
title: "PHP Artisan Migrate with MAMP and Unix Socket"
description: "Migrating Database Connections: Solving the MAMP/Unix Socket Dilemma in Laravel Moving between major framework versions, like transitioning from Laravel 4.2..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Moving between major framework versions, like transitioning from Laravel 4.2 to 5.0, often introduces subtle but significant changes in how configuration and environment variables are handled. When dealing with local development environments—especially when mixing tools like MAMP with containerized setups like Homestead or Vagrant—database connection issues related to file paths, such as the `PDOException: No such file or directory`, are very common stumbling blocks.

This post dives into why you are encountering this error and provides a robust solution for correctly setting up your database connection when using MAMP on macOS.

## Understanding the Root Cause: Socket Path Discrepancies

The error `SQLSTATE[HY000] [2002] No such file or directory` indicates that the PHP Data Objects (PDO) layer cannot find the specified MySQL socket file (`mysql.sock`) when attempting to connect to the database.

This discrepancy arises because:

1.  **Homestead/Vagrant Setup:** These tools manage an isolated, consistent environment where paths are explicitly defined and managed by the virtualization layer.
2.  **MAMP Setup:** When running directly on macOS with MAMP, the location of the socket file (`/Applications/MAMP/tmp/mysql/mysql.sock`) is specific to that local installation.
3.  **Laravel Configuration:** Laravel relies on environment variables (from the `.env` file) to dictate database settings. If you manually set the `unix_socket` path in a custom array structure (as you did in your 4.2 setup), you bypass Laravel’s standard configuration loading mechanism, which often expects these paths to be resolved through system-level environment variables or specific driver settings.

The core issue is that simply defining the socket path in an arbitrary PHP array doesn't automatically inform the underlying PDO driver how to resolve the path in a way that works consistently across all execution environments (MAMP vs. Homestead).

## The Modern Solution: Leveraging `.env` and System Environment Variables

For modern Laravel applications, the recommended approach is to rely on your operating system’s environment variables, which allows for cleaner separation of configuration from code. Instead of manually defining the socket path in a custom array, we need to ensure that PHP/PDO can access this path via standard means.

Since you are using MAMP locally, the most reliable method is ensuring your application environment correctly inherits the necessary paths.

### Step 1: Standardizing the `.env` File

In Laravel 5.0 and later, database configuration lives primarily in the `.env` file. While there isn't a specific built-in variable for `unix_socket`, we can utilize custom variables or ensure your PHP environment is primed correctly.

If you must explicitly define it, it should be done within the connection configuration structure that Laravel uses. However, the most effective fix often involves ensuring the system knows where to look.

### Step 2: The Recommended Fix for Local Development

For MAMP setups, instead of fighting with manual socket definitions in custom arrays, focus on configuring your PHP execution environment to see the socket correctly.

If you are running Artisan commands directly from the terminal (e.g., `php artisan migrate`), ensure that when your shell executes PHP, it is aware of the necessary paths. This often involves setting specific environment variables *before* running the command, or ensuring your `.env` file points to a configuration that respects these local paths.

For complex setups involving local server paths, review how Laravel handles PDO drivers. While you might not directly inject `unix_socket` into the standard connection array in the `.env`, ensure that any custom configuration layer you use correctly references the path provided by your system setup. For general framework guidance on robust development practices, always refer to established patterns found on sites like [laravelcompany.com](https://laravelcompany.com).

**Example of a Clean Configuration Focus:**

Instead of manually defining the socket in a verbose array, focus on ensuring your connection details are standard:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1  # Use TCP/IP if socket resolving fails initially
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=root
DB_PASSWORD=your_password
```

If the above configuration still fails with the socket error when running migrations, it confirms that the issue is environmental. The final step often involves ensuring your system’s `$PATH` or PHP configuration correctly resolves the path specified in your MAMP installation structure.

## Conclusion

The migration from Laravel 4.2 to 5.0 highlights a shift toward relying on standardized environment management. When local development environments diverge (MAMP vs. Homestead), database connectivity errors often stem from mismatched file path expectations. By moving away from manually defining low-level PDO parameters and focusing instead on robust environment variables, you create a solution that is more portable and less prone to breaking across different hosting setups. Always prioritize testing your setup thoroughly; this attention to detail is crucial for maintaining reliable application development.
