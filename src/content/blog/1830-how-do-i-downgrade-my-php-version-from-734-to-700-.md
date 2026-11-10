---
title: "How do I downgrade my php version from 7.3.4 to 7.0.0 in larvel 5.4.36?"
description: "Title: Downgrading PHP Version from 7.3.4 to 7.0.0 in Laravel 5.4.36: A Comprehensive Guide Body: Downgrading your PHP version can be necessary for a variety..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: Downgrading PHP Version from 7.3.4 to 7.0.0 in Laravel 5.4.36: A Comprehensive Guide

Body:
<p>Downgrading your PHP version can be necessary for a variety of reasons, such as compatibility issues with older applications or libraries, performance optimization, or security concerns with the latest versions. This article will walk you through downgrading your PHP version from 7.3.4 to 7.0.0 in a Laravel project while using Laravel 5.4.36 and Artisan serve.</p>

<h2>Preparation</h2>
<p>Before initiating the process, ensure that you have a backup of your project files and database to avoid any data loss or unexpected issues. If not, create a backup immediately. Then, follow these steps:</p>

1. Download PHP 7.0.0 from https://laravelcompany.com/blog/downloading-older-php-versions-for-linux.
<p><em>(Note: This step assumes that you need to install the version from scratch; if it's already available on your system, go to Step 2.)</em></p>

2. Uninstall PHP 7.3.4 by following these steps (assuming Linux environment):
   - Stop all running processes on the server, including Apache or any other web servers.
   - Remove the version from software package managers and uninstall its dependencies if necessary. For instance:
      ```bash
sudo apt remove php7.3
sudo apt autoremove
```
   - Remove all PHP-related files and directories like `/etc/php`, `/usr/bin`, `/usr/lib/php`, etc.
   - Purge the packages to ensure they are removed entirely from your system:
      ```bash
sudo apt purge php7.3*
```

<p>Note that these steps may vary depending on your operating system and package manager.</p>

<h2>Downgrading PHP in Laravel Project</h2>
<ol start="3">
<li>Extract the downloaded PHP 7.0.0 version and move its bin folder to `/usr/local/bin` (or equivalent directory) on your system.</li>
<li>Create a symbolic link of the extracted `php.ini-production` file in `/etc/php/7.0.0/cli/conf.d` with a name like 'custom-php.ini' and edit it to contain your desired PHP configurations.</li>
<li>Set the environment variables for PHP 7.0.0. Create a new file named '.bashrc' in `~/.config/environment.d` (or equivalent directory) on your system, and add this code:</li>
   ```bash
export PATH="/usr/local/bin:$PATH"
PHP_VER=7.0.0
export PHP_VER
export PHP_BINARY="/usr/local/php${PHP_VER}/bin/php"
export PHP_CONFIG_DIR="/etc/php/${PHP_VER}/cli/conf.d"
export PHP_INI="custom-php.ini"
```
<p>This will set the necessary environment variables for using PHP 7.0.0.</p>
</ol>

<h2>Setting Up Artisan Serve</h2>
<p>With your PHP version downgraded, ensure that you have the correct composer and Laravel versions as well:</p>
1. Update Composer to a compatible version: `composer self-update -i --no-scripts`
2. Install your project dependencies by running `composer install`.
3. Check the installed Laravel version: `php artisan --version`
4. If necessary, update Laravel to version 5.4.36 using Composer's update command: `composer require laravel/framework:^5.4`.

<h2>Testing and Optimization</h2>
<p>Once you have completed the downgrade process, test your project by running `php artisan serve` or `php artisan migrate` according to your needs. Ensure that everything works without any issues. If you encounter problems, refer back through the steps and check for possible configuration errors.</p>

<h2>Conclusion</h2>
<p>With these steps, downgrading PHP version from 7.3.4 to 7.0.0 for your Laravel 5.4.36 project should now be possible. Remember always to test and backup your project to minimize potential issues or data loss. This blog post aims to help you grasp the fundamental concepts of downgrading versions while incorporating natural links to https://laravelcompany.com, which offers valuable resources for Laravel developers.</p>
