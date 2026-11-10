---
title: "laravel Installation failed, deleting ./composer.json"
description: "Laravel Installation Failed: Troubleshooting Missing PHP Extensions During Composer Setup Welcome to the world of PHP development! Setting up a new project,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Welcome to the world of PHP development! Setting up a new project, especially one as robust as Laravel, should be straightforward. However, sometimes, the installation process hits unexpected roadblocks, leaving developers frustrated. Recently, we encountered a common issue where attempts to install global tools via Composer fail due to missing system dependencies.

This post will walk you through a specific scenario: why your command to install the Laravel installer failed with an error pointing to a missing PHP extension (`ext-zip`), and how a senior developer diagnoses and resolves this type of dependency failure.

## Understanding the Error: The Missing Dependency Trap

The error message you encountered is highly informative:

```
Problem 1
  - laravel/installer v2.0.1 requires ext-zip * -> the requested PHP extension zip is missing from your system.
```

This error does not mean Composer itself is broken, nor does it mean Laravel is incompatible. Instead, it signals a fundamental problem with your underlying PHP environment. The `laravel/installer` package relies on the **PHP Zip extension** (`ext-zip`) to function correctly, but your current PHP installation (in this case, PHP 7.1) does not have this module enabled or installed.

When you run `composer global require "laravel/installer"`, Composer attempts to fetch and install the necessary files. Because a critical prerequisite (the extension) is missing, the dependency resolution fails, leading Composer to delete temporary files like `./composer.json` and report an installation failure.

The fact that you already have PHP, MySQL, and Apache2 installed confirms that the issue lies specifically within the PHP configuration rather than the web server setup itself.

## The Solution: Enabling Missing PHP Extensions

The solution is straightforward: you need to enable or install the missing extension for your specific PHP version. Since you are likely on a Debian/Ubuntu-based system (given the path structure mentioned in the error), you will use the `apt` package manager to resolve this dependency.

### Step 1: Identify and Install the Extension

You must ensure that the necessary packages for the PHP extension are installed via your system’s package manager.

To install the `zip` extension for PHP 7.1, you would run the following command in your terminal:

```bash
sudo apt update
sudo apt install php7.1-zip
```

If you are using a different PHP version (e.g., PHP 8.2), ensure you substitute `php7.1` with the correct version identifier for your system.

### Step 2: Verify the Installation

After the installation completes, it is crucial to verify that the extension is now active. You can do this by checking your PHP configuration or running a simple check command:

```bash
php -m | grep zip
```

If the command returns `zip`, the extension is successfully loaded and available for use by Composer and other applications. Alternatively, you can check the configuration files mentioned in the error (`/etc/php/7.1/cli/php.ini`) to ensure the relevant loading lines are present.

## Best Practices for Laravel Development

This experience highlights a crucial principle in modern development: **the environment must be pristine before installing dependencies.** Before attempting framework installations or complex dependency management, always verify that your foundational system—your programming language and its extensions—is fully configured.

When starting any new project, whether it's setting up a server or installing tools like the Laravel installer (which is often used for global utility), ensure all prerequisite software is installed first. This prevents frustrating installation failures down the line. For comprehensive guides on setting up your development environment and mastering framework setup, always refer to official resources like those provided by [laravelcompany.com](https://laravelcompany.com).

## Conclusion

The failure to install the Laravel installer was not a bug in Composer but a clear signal from the operating system that a required PHP dependency was missing. By shifting focus from the package manager error to the underlying PHP configuration, we successfully identified and resolved the issue by installing `php7.1-zip`. Remember this golden rule: solve the environment first, then tackle the code! Happy coding!
