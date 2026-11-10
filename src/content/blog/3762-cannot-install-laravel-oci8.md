---
title: "Cannot install laravel oci8"
description: "Resolving the Composer Error: Why You Can't Install yajra/laravel oci8 Without the OCI8 Extension As a senior developer, I’ve seen countless frustrating..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless frustrating roadblocks when setting up projects, especially when dealing with legacy dependencies or specific PHP extensions. The error you are encountering—where Composer reports that the required extension (`ext-oci8`) is missing—is a very common hurdle, particularly on manually configured PHP environments like those you are running outside of XAMPP or WAMP.

This post will walk you through exactly why this error occurs and provide the definitive steps to enable the necessary OCI8 extension so you can successfully install `yajra/laravel-oci8`.

## Understanding the Composer Error

When you run the command:
```bash
composer require yajra/laravel-oci8:^8
```
Composer attempts to resolve all dependencies. In this case, the package `yajra/laravel-oci8` has a dependency requirement: it mandates that the PHP installation must have the `ext-oci8` extension enabled and at version 2.0.0 or higher.

The error message clearly states the issue:
```
yajra/laravel-oci8 v8.0.0 requires ext-oci8 >=2.0.0 - it is missing from your system. Install or enable PHP's oci8 extension.
```

This error is not a problem with Composer itself; it is a fundamental requirement of the underlying PHP environment you are using. Composer relies on the PHP CLI to execute the necessary setup, and if the required module isn't loaded by PHP, the installation fails immediately.

## The Solution: Enabling the PHP Extension

Since you are managing your PHP installation directly (not via a package manager like XAMPP/WAMP), enabling extensions requires manual configuration of the PHP settings files. Based on the path provided in your error (`C:\PHP74\php.ini`), we can target the solution specifically for your setup.

### Step 1: Locating and Editing `php.ini`

You need to locate the main PHP configuration file, which is specified as `C:\PHP74\php.ini`. Open this file using a text editor (like VS Code or Notepad++).

### Step 2: Enabling the Extension

Inside the `php.ini` file, you need to find the line that loads extensions. Extensions are typically enabled by uncommenting the lines that start with `extension=`.

Search through the file for references to the OCI8 extension. You should look for a line similar to this (the exact path might vary slightly):

```ini
; Check if this line exists and is commented out
; extension=oci8
```

If you find it, uncomment that line by removing the leading semicolon (`;`). It should look like this:

```ini
extension=oci8
```

**Pro Tip for Windows Users:** If you are unsure which lines to edit, search for `extension` within the file. Ensure that the line corresponding to `oci8` is active and not commented out.

### Step 3: Verification and Restart

After saving the `php.ini` file, you **must** restart your PHP environment for the changes to take effect. This usually means restarting any services or command-line sessions running PHP.

To verify that PHP recognizes the extension in your command line:
```bash
php --ini
```
Check the output under the "Loaded Configuration File" and the list of loaded modules to confirm that `oci8` is now listed.

## Finalizing the Installation

Once you have confirmed that `ext-oci8` is successfully enabled, navigate back to your project directory and retry the Composer command:

```bash
composer require yajra/laravel-oci8:^8
```

This time, Composer will be able to inspect your system's PHP configuration, detect the required extension, and proceed with downloading and installing the package without the dependency resolution error.

## Conclusion

Dealing with environment-specific errors is a core part of senior development. While modern frameworks like those promoted by **Laravel** strive for streamlined setup, understanding the underlying mechanics—how PHP extensions are loaded—is crucial for troubleshooting complex setups. By manually ensuring that necessary PHP modules like `oci8` are correctly configured in your `php.ini`, you gain full control over your environment and can resolve these types of dependency conflicts effectively. Happy coding!
