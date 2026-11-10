---
title: "How to Uninstall Laravel?"
description: "Title: A Comprehensive Guide on Uninstalling Laravel for Complete Fresh Installation Body: Laravel is a powerful PHP framework that allows developers to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: A Comprehensive Guide on Uninstalling Laravel for Complete Fresh Installation

Body:
Laravel is a powerful PHP framework that allows developers to create robust and modern web applications with ease. However, sometimes you may face errors due to insufficient or slow internet conditions, which can lead to an incomplete installation. If this occurs, it might be necessary to uninstall Laravel from your root directory and proceed with a fresh installation. In this blog post, we will guide you through the essential steps needed for this process.

Before we begin, it's crucial that you create a backup of your current project or environment in case anything goes wrong during the uninstallation. Once you have backed up your data, you can proceed with the following steps:

1. **Close all open connections to the Laravel-based web application:** Ensure that no processes are running on the local server by closing all browsers and terminals connected to your Laravel environment.

2. **Uninstall Composer dependencies:** As a dependency manager, Composer is used for installing Laravel and its third-party packages. To uninstall all dependencies, first navigate to the project's root directory and run the following command:

```bash
composer remove --all-dev
```

This command will delete all Composer entries from your composer.json file, allowing for a fresh installation in later steps.

3. **Delete the Laravel installation:** Next, remove the entire Laravel installation from the root directory where you initially installed it:

```bash
rm -r vendor/laravel
rm composer.lock
rm -rf bootstrap/cache
rm -f .env*
rm -fr public/*
```

4. **Uninstall PHP artisan:** Laravel's command-line interface (CLI) tool, "artisan," is also installed when you set up the framework in your project. To remove this utility, run:

```bash
rm -f vendor/bin/artisan
```

5. **Remove any related configuration files:** Your Laravel installation might have altered several system files or added a startup script to your web server’s configuration. Remove these changes to ensure that the new Laravel installation is completely separate from the previous one:

For NGINX and Apache servers, look for configuration file modifications like 'laravel-nginx.conf' or 'laravel.conf'. Delete them if found.

For NGINX servers with PHP FPM, check your php-fpm.conf (or php5.ini) file for "include /path/to/laravel/config/php-fpm.d/www.conf;". If it exists, remove the line containing this reference.

For Apache and other web servers, search for 'IncludeAlias' directives in server configuration files that might have been added during Laravel installation. Delete these lines to restore normal functionality.

6. **Reboot your system:** After uninstalling Laravel from your root directory, it's essential to restart your computer to ensure proper removal of the framework and any associated processes. This will also reestablish a clean environment for a new Laravel installation.

7. **Obtain fresh Laravel installer:** To begin a fresh Laravel installation, navigate to https://laravel.com/docs/download in your web browser and follow the provided instructions to install the Composer Global Installer:

```bash
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```

8. **Install Laravel using fresh installation process:** Finally, navigate to your desired directory and issue the following command to install a new Laravel installation:

```bash
composer create-project laravel/laravel --prefer-dist app-name
```

Replace "app-name" with the name of your new Laravel project. This will automatically download and install Laravel, its dependencies, and other necessary components for a fresh installation.

By following these steps, you can successfully uninstall Laravel from your root directory and prepare the environment for a complete fresh installation. For any questions or concerns about this process, feel free to visit https://laravelcompany.com/contact to reach out to our experts.
