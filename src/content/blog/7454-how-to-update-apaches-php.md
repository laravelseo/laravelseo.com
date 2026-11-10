---
title: "How to update Apache's PHP?"
description: "How to Update Apache's PHP: Resolving Version Conflicts for Framework Development Setting up a modern web application, such as one built on Laravel, often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Setting up a modern web application, such as one built on Laravel, often requires specific PHP versions. When you find yourself juggling multiple PHP installations on a server—like having PHP 7.0 and PHP 7.2 installed alongside each other—the challenge shifts from installation to configuration: ensuring your web server (Apache) is correctly pointing to the required interpreter.

If you are running into issues where `phpinfo()` reports an older version than expected, it means Apache is defaulting to an incompatible handler or binary. As a senior developer, understanding how the web server interacts with the PHP environment is crucial for stable deployments. This guide will walk you through diagnosing and correctly configuring Apache on Ubuntu to serve PHP 7.2 instead of the default PHP 7.0.

## Diagnosing the PHP Version Conflict

Before attempting any changes, we must confirm exactly what Apache is currently using. On many Debian/Ubuntu systems, switching PHP versions often involves using symbolic links or configuration files managed by `update-alternatives`.

First, let's confirm the current state:

```bash
# Check which version Apache is currently executing (if mod_php is active)
sudo php -v

# Check where the system thinks the default PHP executable points
ls -l /usr/bin/php
```

If `phpinfo()` still shows an older version, it suggests that Apache's configuration files are explicitly pointing to the older binary path, or a different module (like PHP-FPM) is taking precedence. For Laravel development, which relies on specific dependency chains, this mismatch is a critical roadblock.

## Configuring Apache to Use PHP 7.2

The method you use depends heavily on whether you are using the traditional `mod_php` module or the modern PHP-FPM setup. Since you are configuring Apache directly, we will focus on ensuring the correct module is enabled and configured.

### Method 1: Using `update-alternatives` (System Level)

Ubuntu uses the `update-alternatives` system to manage which version of a command (like `php`) is the default system choice. If you have multiple PHP installations, this tool allows you to select the active default globally.

You can check the available options:
```bash
sudo update-alternatives --config php
```
This command will present a list of installed PHP versions, allowing you to manually set which one is the system default for commands executed by the system (which Apache often respects). Select the entry corresponding to your desired PHP 7.2 installation.

### Method 2: Configuring Apache Modules (`mod_php`)

If you are using `mod_php` directly within Apache, you need to ensure that the module is compiled and linked against the specific PHP version you want to use. If you installed PHP 7.2 separately, you might need to re-enable or configure the module for that specific path.

A common approach when dealing with multiple versions is to use separate configurations if possible, often by setting up Virtual Hosts (if using Apache) or ensuring that the necessary modules are correctly linked to the chosen PHP binary directory.

For robust application deployment, moving towards **PHP-FPM** integrated with Apache (using `mod_proxy_fcgi`) is generally the recommended best practice for performance and isolation, especially when deploying complex frameworks like those found on sites managed by Laravel. You can find excellent guides on setting up this architecture by reviewing modern infrastructure practices detailed on [https://laravelcompany.com](https://laravelcompany.com).

## Conclusion

Resolving PHP version conflicts is a common hurdle in server administration. The key takeaway is that the problem rarely lies with Apache itself, but rather in how the operating system and web server are linked to the installed binaries. By using tools like `update-alternatives` for system defaults and understanding the difference between module-based setups (`mod_php`) versus process-based setups (PHP-FPM), you gain control over which environment serves your application. Always prioritize clean, isolated environments when setting up framework dependencies, ensuring that your Laravel project runs in a predictable and stable context across all deployments.
