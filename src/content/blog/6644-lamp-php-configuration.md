---
title: "LAMP PHP configuration"
description: "Resolving Composer Dependency Errors in LAMP/Laravel Environments: The Missing ext dom Issue As senior developers, we often encounter frustrating..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As senior developers, we often encounter frustrating roadblocks when setting up development environments, especially when dealing with dependency management tools like Composer. A common scenario arises when installing frameworks like Laravel on a fresh LAMP stack (Linux, Apache/Nginx, MySQL, PHP), where the system seems configured correctly, yet Composer throws cryptic errors related to missing PHP extensions.

This post dives into a specific, yet highly common, issue: why `composer install` fails due to a missing `ext-dom` extension, and how to reliably fix it on Ubuntu-based systems running PHP.

## Understanding the Dependency Conflict

The error message you encountered clearly points to a fundamental problem:

```
phpunit/phpunit 6.4.3 requires ext-dom * -> the requested PHP extension dom is missing from your system.
```

This tells us that several critical packages Composer needs—such as `phar-io/manifest` and various testing libraries like PHPUnit—depend on the **DOM extension** (`ext-dom`). The DOM extension provides functionality for handling XML and HTML documents within PHP. If this core module is not compiled into your specific PHP installation, Composer cannot proceed with downloading and installing the required dependencies.

While you correctly checked the `.ini` files to ensure extensions were *enabled* (which controls how PHP runs), the error indicates that the underlying **PHP binary extension itself is missing** from the system's compiled modules. This often happens when installing minimal packages or using custom/older builds of PHP, where essential modules are omitted by default.

## The Practical Solution: Installing Missing PHP Extensions

Since you are running Ubuntu 17.10 and PHP 7.1, we need to use the appropriate package management tools to install the missing module directly into your environment. This process involves ensuring that the necessary development packages for PHP are installed alongside the core runtime.

For Debian/Ubuntu systems, the fix involves using `apt` to install the specific PHP extension package:

```bash
# Update the package list
sudo apt update

# Install the missing DOM extension package for your specific PHP version (7.1)
sudo apt install php7.1-dom
```

After running this command, the system will compile and link the necessary files for the `dom` extension into your existing PHP installation. This ensures that when Composer runs, it can find the required functions needed by the dependencies.

## Verification and Laravel Best Practices

Once the installation is complete, you should verify that the extension is properly loaded. You can do this by running:

```bash
php -m
```

You should see `dom` listed among the enabled modules.

For a robust development environment, especially when working with modern frameworks like Laravel, setting up dependencies correctly is paramount. When focusing on application structure and dependency management within your project, remember that managing these underlying system configurations is just as important as writing clean code. For deeper insights into structuring large applications and adhering to best practices for framework setup, always refer back to resources like [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Dependency errors during Composer installation are rarely about incorrect configuration files; they are usually about missing underlying system components. By diagnosing the specific missing extension (`ext-dom` in this case) and using the appropriate package manager commands (`sudo apt install php7.1-dom`), we can resolve these headaches quickly. This practice ensures that your LAMP stack is fully equipped to handle complex dependency resolutions, allowing you to focus on building powerful applications without getting bogged down by environment setup issues.
