---
title: "Laravel: PHP Artisan Migrate throws PDO Exception: Could not find driver (Postgres)"
description: "Laravel: Troubleshooting PDO Driver Errors When Migrating to PostgreSQL As a senior developer, I've seen countless headaches arise when setting up database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I've seen countless headaches arise when setting up database interactions in PHP frameworks like Laravel, especially when dealing with specific database systems like PostgreSQL. The error you are encountering—`could not find driver: (SQL select * from information_schema.tables where tables_schema = username and table_name = migrations)` followed by the generic `PDOException: could not find driver`—is frustrating because your system diagnostics (`php -i`) suggest the necessary PostgreSQL driver (`pgsql`) is installed and enabled.

This situation usually points to a mismatch between how PHP loads extensions in different environments (CLI vs. FPM) or an issue with the specific compilation/installation process that affects the command-line execution context.

Let’s dive deep into why this happens and how we can resolve it for your Laravel 5.4 application running on Ubuntu 16.10 with PostgreSQL 9.5.4.

## Understanding the PDO Driver Failure

The error `could not find driver` during a database operation means that the PHP Data Objects (PDO) layer cannot locate or load the necessary extension required to communicate with the specific database backend (in this case, PostgreSQL).

Although your `php -i` output correctly shows `PDO drivers => pgsql`, this often confirms that the extension exists in the system's configuration files, but it fails to load when executed via the Command Line Interface (CLI) where `php artisan migrate` runs. This usually happens because the CLI environment loads a different set of configurations or dependencies than the web server environment (FPM).

## Troubleshooting Steps: Beyond Basic Checks

Since you have already performed the standard steps—installing `php-pgsql`, editing `php.ini`, and restarting services—we need to look at deeper system integration issues specific to Linux environments.

### 1. Verify CLI PHP Configuration

The key difference between your FPM setup and your CLI setup lies in which `php.ini` file is being read by the command line. While you edited `/etc/php/7.0/fpm/php.ini`, we must ensure the CLI environment is pointing to the correct configuration, or that the necessary modules are compiled correctly for the CLI interpreter.

**Action:** Check the specific `php.ini` file used by the CLI binary. Use the following command to see which configuration is active:

```bash
php -i | grep -E 'pdo|pgsql'
```

If this still shows missing drivers, it strongly suggests a problem with how the PostgreSQL client libraries (like `libpq`) are linked during the compilation of the PHP extension itself.

### 2. Re-examining Dependencies and Compilation

Even if you installed `php-pgsql`, sometimes system dependencies from the PostgreSQL client utilities (`libpq-dev` or similar packages) need to be present for a clean build process that links the driver correctly into the PHP installation.

**Action:** Ensure all necessary development headers are installed:

```bash
sudo apt update
sudo apt install libpq-dev build-essential
```

After installing these, you must **recompile and reinstall** the PHP module to ensure it links against the newly available libraries:

```bash
sudo apt install php7.0-pgsql  # Or the specific package name for your PHP version
sudo systemctl restart php7.0-fpm
```

### 3. Laravel Framework Context (A Note on Version)

While the immediate issue is a driver problem, keeping framework versions consistent is crucial. Since you are using Laravel 5.4, ensure that any custom setup or environment variables related to database connection in your `.env` file perfectly match what the underlying PHP installation expects. For modern deployments, maintaining up-to-date dependencies often simplifies these low-level configuration headaches. Remember that robust application development relies on stable foundations; for deeper architectural guidance, always refer to resources like [laravelcompany.com](https://laravelcompany.com).

## Conclusion: The Path Forward

The `PDOException: could not find driver` error in this context is almost always an environmental linking issue rather than a simple missing file. By focusing on ensuring that the system dependencies (`libpq-dev`) are present and forcing a reinstallation of the PHP module, we force the compilation process to correctly recognize and link the PostgreSQL PDO driver for the CLI environment.

If the problem persists after these steps, it might indicate a deeper issue with your specific Ubuntu build environment or a conflict with how PHP 7.0 was compiled on that system. However, following this dependency-focused approach usually resolves these stubborn low-level errors. Happy coding!
