---
title: "I cannot install Laravel with Composer (ext-zip extension is missing)"
description: "I cannot install Laravel with Composer (ext zip extension is missing): A Deep Dive into PHP Extension Troubleshooting As a senior developer, I’ve seen..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless installation and dependency errors plague projects, often stemming from subtle mismatches between the operating system, the PHP version, and required extensions. The scenario you described—failing to install Laravel via Composer because the `ext-zip` extension is missing—is a classic example of this friction point.

This post will walk you through why these errors occur and provide the definitive, step-by-step solution to ensure your PHP environment is correctly configured for modern framework installations like those used by **Laravel**.

## Understanding the Root Cause: Why Extensions Matter

The error message clearly states that `laravel/installer` requires the `ext-zip` extension. This means Composer, when executing the installation script, relies on PHP’s ability to access certain functions (in this case, file compression utilities provided by the zip extension). If the extension is not compiled into your PHP installation or not loaded correctly by the CLI environment, Composer cannot proceed.

The complexity arises because fixing this often involves synchronizing three separate layers:
1. The operating system package manager (Debian/APT).
2. The PHP installation itself.
3. The way PHP is configured to load modules (`php.ini`).

Your attempts to install `php7.4-zip` and edit `php.ini` are good starting points, but they often fail because the specific environment you are running Composer in (especially when using tools like `php --ini`) has a different configuration context than what is expected by the installer script.

## The Correct Diagnostic and Solution Strategy

When dealing with command-line tools that rely on PHP extensions, we must ensure the system dependencies are installed *and* that the PHP CLI interpreter knows where to find them.

### Step 1: Verify the System Dependencies

Since you are on a Debian-based system (Debian 9), the first step is ensuring you have the correct development packages for your specific PHP version, and then installing the actual extension module.

While running `apt-get install php7.4-zip` is correct for installing the zip utility, sometimes the necessary headers or compilation tools are missing if you are working outside a standard LAMP stack setup.

**Best Practice:** Ensure you have all necessary build tools installed before attempting complex extensions:

```bash
sudo apt update
sudo apt install build-essential
sudo apt install php7.4-dev  # Install development headers for PHP 7.4
sudo apt install php7.4-zip # Install the actual zip extension module
```

### Step 2: Reconfirming the Extension Loading (The CLI Context)

The confusion often lies in how `php.ini` settings interact with the command line environment. For Composer to see the extension, it must be loaded when PHP is executed from the terminal.

Instead of manually editing `.dll` or `.so` files directly (which is often complex on modern Linux setups), we rely on the standard configuration provided by your package manager. If you installed `php7.4-zip`, ensure that the primary PHP executable (`php`) is correctly linked to use those modules.

If you are using a tool like XAMPP or LAMP, these tools manage the environment setup more holistically. If you are running commands directly via the CLI, focus on ensuring your system's default PHP installation is sound.

### Step 3: Attempting the Installation Again

After ensuring all necessary packages are installed and the system has been refreshed, try the Composer command once more:

```bash
composer global require laravel/installer
```

If the issue persists after following these steps—installing development tools, installing the specific extension package via `apt`, and ensuring the PHP version matches the extension you installed—it often points to a deeper environment configuration problem (e.g., multiple PHP versions conflicting, or using a custom build).

## Conclusion: Building Robust Environments

Troubleshooting dependency issues is an integral part of being a senior developer. The lesson here is that when dealing with framework setups like those in the **Laravel** ecosystem, we must treat the underlying environment—the operating system and the PHP installation—as rigorously as the application code itself.

Never assume that installing a package via `apt` automatically resolves all runtime dependencies for complex tools like Composer. Always verify the prerequisites explicitly. By ensuring your system has all the necessary development headers and extensions installed correctly, you eliminate these frustrating dependency failures and ensure a smooth path to building robust applications.
