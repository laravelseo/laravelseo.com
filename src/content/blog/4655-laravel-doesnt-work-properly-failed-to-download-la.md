---
title: "Laravel doesn't work properly - Failed to download laravel/laravel from dist: The zip extension and unzip/7z commands are both missing, skipping"
description: "Laravel Installation Nightmare: Fixing Missing Extensions and Composer Errors As senior developers, we all know the feeling: you’re ready to start a new..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers, we all know the feeling: you’re ready to start a new project with a powerful framework like Laravel, but the setup process throws cryptic errors. The message you encountered—"Failed to download laravel/laravel from dist: The zip extension and unzip/7z commands are both missing, skipping"—is a classic symptom of an environment misconfiguration, especially when dealing with Composer and PHP dependencies.

This post will dive deep into why this happens and provide the step-by-step solution to ensure your local development environment is properly configured for seamless Laravel project setup.

---

## Understanding the Errors: Why Installation Fails

The error message you received stems from two distinct, but related, problems: a missing system utility issue (ZIP support) and a missing PHP extension issue (`ext-fileinfo`).

### Problem 1: Missing ZIP Support

When Composer tries to download packages in the "dist" format (pre-packaged archives), it relies on underlying system tools to extract these files. If the PHP installation lacks the necessary ZIP extension, or if the command-line environment cannot find standard tools like `unzip` or `7z`, the download and extraction process fails immediately.

### Problem 2: Missing PHP Extensions (`ext-fileinfo`)

The subsequent dependency resolution errors reveal the deeper issue. Laravel and its required packages (like those for Flysystem, which handles file storage) rely on specific PHP extensions to perform file system operations efficiently. The error trace specifically points out that `league/mime-type-detection` and `league/flysystem-local` require the **`ext-fileinfo`** extension, which is missing from your PHP installation (`C:\php-8.2.11\php.ini`).

This means Composer successfully cloned the repository, but when it tried to resolve the required dependencies based on your current environment, it hit a roadblock because crucial file handling capabilities were absent.

## The Solution: Configuring Your PHP Environment Correctly

Fixing this requires addressing both the system tools and the PHP configuration simultaneously. Simply reinstalling PHP or Composer is often insufficient; we must manually configure the PHP environment variables.

### Step 1: Enabling ZIP and System Tools (The Quick Fix)

While enabling the core extensions is the main goal, ensuring your command-line environment has proper extraction capabilities is a good first step. On Windows systems running PHP, this usually involves ensuring that the relevant DLLs are accessible to the CLI environment or ensuring you have appropriate system utilities installed globally.

### Step 2: Enabling Required PHP Extensions (The Core Fix)

This is the most critical part. You need to explicitly enable the missing extensions within your `php.ini` file.

1.  **Locate `php.ini`:** As indicated in your error, the relevant file is `C:\php-8.2.11\php.ini`.
2.  **Edit the File:** Open this file in a text editor.
3.  **Enable `fileinfo`:** Search for the line related to `fileinfo` and ensure it is uncommented (remove the semicolon `;` at the beginning). It should look like this:

    ```ini
    extension=fileinfo.so
    ```
    *(Note: On Windows, extensions are often compiled as `.dll` and loaded via `extension=extname.dll`, but in many setups, if you are using a standard package or XAMP/WAMP environment, enabling the module name is sufficient.)*

4.  **Save and Restart:** Save the `php.ini` file. For changes to take effect in your command-line environment (CLI), you often need to restart your terminal session or ensure that the CLI is using this newly configured instance of PHP.

### Step 3: Reattempting the Installation with Composer Flags

Once the extensions are enabled, try running the installation again. If the system still complains, you can use the temporary workaround suggested by Composer to bypass the immediate check, though fixing the configuration permanently is superior:

```bash
composer create-project laravel/laravel test
# Or, if the issue persists temporarily:
composer create-project laravel/laravel test --ignore-platform-req=ext-fileinfo
```

## Conclusion: Building a Robust Development Stack

This experience highlights a fundamental truth in modern development: framework installation is not just about running a single command; it’s about ensuring your entire runtime environment is stable and correctly configured. A robust setup prevents frustrating dependency errors down the line.

When building applications with Laravel, understanding how PHP extensions interact with Composer dependencies is key to avoiding these pitfalls. Always prioritize configuring your base PHP installation before attempting framework installations. For deeper insights into managing dependencies and best practices within the Laravel ecosystem, always refer to the official documentation at [https://laravelcompany.com](https://laravelcompany.com). Happy coding!
