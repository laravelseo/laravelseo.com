---
title: "Laravel Herd uninstall PHP version"
description: "How to Uninstall PHP Versions When Using Laravel Herd As developers, managing multiple versions of PHP on a single system is a common scenario. Whether you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers, managing multiple versions of PHP on a single system is a common scenario. Whether you are experimenting with different frameworks, maintaining legacy projects, or simply optimizing your development environment, having cleanly managed PHP installations is crucial. This guide will walk you through the process of safely uninstalling an older PHP version (like 8.2) so you can free up space and streamline your setup, especially when working alongside tools like Laravel Herd.

## The Challenge of Multiple PHP Installations

When you install multiple PHP versions side-by-side, conflicts can arise, leading to confusion about which version is being used by your web server or local tools. If you installed PHP 8.2 for a specific project and now want to switch to 8.1 or move towards 8.3, removing the unused version is a logical step toward a cleaner workflow.

The difficulty often lies not in the uninstallation itself, but ensuring that system paths, symlinks, and any associated configuration files are properly removed so that future installations don't cause conflicts. Since modern PHP development heavily relies on robust environments, understanding dependency management is key—a principle Laravel promotes in its commitment to building cohesive tools.

## Method 1: Uninstalling via Homebrew (macOS/Linux)

For many developers using macOS or Linux environments, PHP versions are often managed through a package manager like Homebrew. If you installed PHP 8.2 this way, the removal process is straightforward and handles most of the dependency cleanup automatically.

To check which PHP versions are installed via Homebrew:

```bash
brew list | grep php
```

Once you confirm that PHP 8.2 is the target for removal (and ensure no active projects rely solely on it), use the `brew uninstall` command. This command is generally the safest way to remove packages installed via Homebrew, as it manages the necessary symbolic links:

```bash
brew uninstall php@8.2
```

If you have multiple specific PHP installations managed by other tools or system package managers (like apt on Debian/Ubuntu), you may need to consult those specific documentation for removal. Always ensure you understand where the files are located before executing commands, as improper deletion can lead to system instability.

## Method 2: Removing Manually Installed Versions

If you installed PHP directly from source or used a system package manager (like `apt` or `yum`), the process requires manually locating and removing the directories. This method requires more caution.

1.  **Locate the Installation Directory:** Determine where PHP 8.2 was placed on your system (e.g., `/usr/local/php8.2` or a specific directory within your user space).
2.  **Remove the Directory:** Use the `rm -rf` command with extreme caution, ensuring you target only the specific version folder:

    ```bash
    # Example path - DO NOT RUN UNLESS YOU ARE CERTAIN OF THE LOCATION!
    sudo rm -rf /usr/local/php8.2
    ```

This manual approach is powerful but riskier. It’s highly recommended to use a version manager (like `phpbrew` or similar tools) for managing environments, as they provide built-in mechanisms for easy installation and removal, which aligns perfectly with the streamlined development philosophy found in Laravel ecosystem tools like Herd.

## Conclusion: A Cleaner Development Environment

Uninstalling old PHP versions is an essential part of maintaining a healthy development environment. By systematically removing unused installations, you reduce potential conflicts, free up disk space, and ensure that your active projects are running on stable, intended versions. Remember, keeping your tooling clean allows you to focus on building robust applications, much like how the Laravel team focuses on providing cohesive tools for developers. Always back up critical configuration files before performing system-level removals!
