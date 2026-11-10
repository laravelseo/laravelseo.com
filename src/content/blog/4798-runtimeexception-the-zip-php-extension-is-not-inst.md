---
title: "RuntimeException The Zip PHP extension is not installed"
description: "Fixing the RuntimeException: The Zip PHP Extension is Not Installed Welcome to the world of development! It’s completely normal to hit roadblocks when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Welcome to the world of development! It’s completely normal to hit roadblocks when setting up a new environment, especially when dealing with system dependencies. As you've discovered, even when you install frameworks like Laravel and package managers like Composer, the underlying operating system needs specific tools—in this case, PHP extensions—to function correctly.

If you are running into the error `[RuntimeException] The Zip PHP extension is not installed` while trying to run `laravel new project`, don't worry. This is a very common dependency issue on Linux systems. As a senior developer, I can tell you exactly why this happens and provide you with the definitive steps to resolve it.

## Understanding the Error: Why Do I Need the Zip Extension?

The error message tells us exactly what the problem is: your PHP installation is missing the `zip` extension.

In the context of Composer and Laravel, these tools rely on PHP being able to handle file compression and extraction operations. When Composer attempts to download dependencies or create project structures, it often uses ZIP archives internally. If the necessary PHP module (the extension) isn't loaded, PHP throws a runtime exception because it cannot perform that required operation.

Think of it this way: Composer is the driver, but the Zip extension is the specific tool needed for the job to be completed smoothly. Without it, the process stalls. Getting your environment set up correctly is the first crucial step toward building robust applications on platforms like those supported by [laravelcompany.com](https://laravelcompany.com).

## Step-by-Step Solution: Installing the Zip PHP Extension

The solution involves installing the missing extension directly onto your Linux distribution's PHP installation. The exact command depends on which package manager your system uses (e.g., `apt` for Debian/Ubuntu or `yum`/`dnf` for CentOS/RHEL).

### For Debian/Ubuntu Systems (using APT)

If you are using a Debian-based distribution (like Ubuntu), you will use the Advanced Package Tool (`apt`) to install the required package.

1.  **Update Package Lists:** Always start by refreshing your package index.
    ```bash
    sudo apt update
    ```
2.  **Install the Zip Extension:** Install the PHP module specifically for your version (e.g., PHP 8.2).
    ```bash
    sudo apt install php-zip
    ```
3.  **Restart Web Server (Optional but Recommended):** To ensure the changes are fully registered by the system, restart your web server if you are running a local server environment.
    ```bash
    sudo service apache2 restart  # Or nginx, depending on your setup
    ```

### For RHEL/CentOS Systems (using YUM/DNF)

If you are using a Red Hat-based distribution, use the `yum` or `dnf` command instead.

1.  **Install the Zip Extension:**
    ```bash
    sudo dnf install php-zip
    # Or for older systems: sudo yum install php-zip
    ```
2.  **Restart Web Server (If necessary):**
    ```bash
    sudo systemctl restart httpd # Or nginx
    ```

## Verification and Next Steps

After running the appropriate installation command, you should verify that the extension is now active. You can check this by running the `php -m` command, which lists all loaded modules:

```bash
php -m | grep zip
```

If the installation was successful, this command should output `zip`.

Now, try running your original command again within your project directory:

```bash
composer create-project laravel/laravel example-app
```

This time, Composer should be able to execute its file operations successfully, and you will proceed with setting up your new Laravel project without the runtime error.

## Conclusion

Encountering dependency issues is a rite of passage for every developer. The key takeaway here is that development environments are not just about installing frameworks; they involve managing the underlying operating system dependencies. Always check your PHP extensions before diving into complex framework setups. By understanding how PHP modules interact with tools like Composer, you move from being a user to becoming a true troubleshooter. Happy coding!
