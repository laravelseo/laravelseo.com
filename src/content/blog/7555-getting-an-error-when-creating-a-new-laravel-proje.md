---
title: "Getting an error when creating a new laravel project"
description: "Decoding the Error: Fixing Dependency Conflicts When Creating a New Laravel Project As a senior developer, I’ve seen countless issues arise when setting up..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless issues arise when setting up new projects, often stemming not from a bug in the framework itself, but from underlying system dependencies. If you are encountering errors like the one detailed below when running `composer create-project laravel/laravel`, it usually signals a mismatch between the required package versions and the capabilities of your PHP environment.

This guide will walk you through diagnosing this specific dependency error and providing robust solutions so you can set up your Laravel application smoothly.

## Understanding the Dependency Conflict

The error message you are seeing is a classic example of a platform requirement failure within Composer. Let's break down what is happening:

```
- laravel/framework[v8.75.0, ..., 8.x-dev] require league/flysystem ^1.1 -> satisfiable by league/flysystem[1.1.0, ..., 1.x-dev].
- league/flysystem[1.1.0, ..., 1.x-dev] require ext-fileinfo * -> it is missing from your system. Install or enable PHP's fileinfo extension.
```

The core issue is that a dependency required by Laravel (specifically `league/flysystem`) demands the presence of a specific PHP extension called `ext-fileinfo`. Your current PHP installation, while capable of running Composer, is missing this necessary component. The system is telling you: "I need this feature to work, and it's not installed."

This is a common hurdle when working with modern PHP packages that rely on underlying system functionalities. While building robust applications, understanding the interaction between the application code and the operating system environment is crucial—a principle central to good development practices championed by resources like [laravelcompany.com](https://laravelcompany.com).

## Solution 1: The Permanent Fix – Enabling PHP Extensions

The most correct and sustainable solution is to install or enable the missing extension on your server or local machine where you are running Composer. For `ext-fileinfo`, this typically involves modifying your PHP configuration files.

### How to Enable `ext-fileinfo`

The exact steps depend heavily on your operating system (Linux, macOS, or Windows) and how you installed PHP (e.g., using apt, yum, or XAMPP/WAMP).

1.  **Locate `php.ini`:** As the error suggests, locate your primary configuration file (`C:\PHP7\php.ini` in your example).
2.  **Edit Configuration:** Open this file and search for lines related to extension loading (often using `extension=`). You need to ensure that the line corresponding to `fileinfo` is uncommented or present. It usually looks something like:
    ```ini
    extension=fileinfo
    ```
3.  **Restart Services:** After making changes, you must restart your web server or PHP-FPM service for the changes to take effect.

If you are using a package manager (like `apt` on Debian/Ubuntu), you can often install missing extensions directly:

```bash
# Example for Debian/Ubuntu systems
sudo apt update
sudo apt install php-fileinfo
sudo service php*-fpm restart  # Restart the relevant service
```

By ensuring all necessary PHP extensions are enabled, you resolve the platform requirement that Composer was flagging. This ensures your environment is properly configured to handle complex dependency chains.

## Solution 2: The Temporary Workaround (Use with Caution)

If enabling the extension immediately proves difficult or if you are working in a strictly sandboxed environment where you cannot modify system configurations, Composer offers a temporary escape hatch: ignoring platform requirements.

You can tell Composer to ignore the requirement for that specific extension by using the `--ignore-platform-req` flag:

```bash
composer create-project laravel/laravel my-app --ignore-platform-req=ext-fileinfo
```

**A Word of Caution:** While this command successfully bypasses the error and allows you to generate your project, it is generally **not recommended** for production or long-term development. Ignoring platform requirements means you are running code that *assumes* a feature exists, but if that feature is truly missing, the application may crash at runtime when it attempts to use functions dependent on `fileinfo`. Use this only as a diagnostic step, not a permanent fix.

## Conclusion

The error you faced was a perfect demonstration of how software dependencies interact with the underlying operating system environment. The solution lies in aligning the requirements of your PHP packages with the actual capabilities of your PHP installation. By systematically checking and enabling missing extensions like `ext-fileinfo`, you ensure a stable, reproducible, and robust development environment. Always prioritize fixing the root cause over using temporary workarounds, especially when building applications on platforms like those supported by [laravelcompany.com](https://laravelcompany.com).
