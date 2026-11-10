---
title: "Upgrading laravel into 8 I got illuminate/support support?"
description: "Title: Upgrading Laravel into 8 Fixing Illuminate/Support Issues Body: If you're facing issues while upgrading to Laravel 8 because of the illuminate/support..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Upgrading Laravel into 8 - Fixing Illuminate/Support Issues

Body:

If you're facing issues while upgrading to Laravel 8 because of the illuminate/support issue, it could be due to your composer.json file conflicting with PHP version requirements or package dependencies. Here's a comprehensive solution to fix this issue.

1. Identify and resolve any conflicts between your Laravel version and PHP version:
Ensure that your PHP version is compatible with the latest Laravel framework. You can update your PHP version by following the instructions from your hosting provider or using tools like Homebrew (for macOS), apt-get, or yum (Linux). For example, if you have Laravel 8 and use PHP 7.2, change it to a compatible version like PHP 7.4 or higher.

2. Check composer.json for dependencies:
Analyze your composer.json file for references to illuminate/support and its compatibility with the Laravel framework. Remove any outdated versions of the package with conflicts that could be causing issues during the upgrade process. Ensure that all dependencies are up-to-date, and you have the latest Laravel version specified in your composer.json:

<pre><code>{
    "require": {
        "php": "^7.3|^8.1",
        // ...other required packages...
        "illuminate/support": "<your_compatible_version>" // replace with the compatible version for Laravel 8.x
    }
}
</code></pre>

3. Repair composer.json to remove conflicting dependencies:
Run the following command in your terminal to fix possible dependency conflicts and update your composer.json file accordingly:

<pre><code>$ composer update --ignore-platform-reqs --with-dependencies --no-dev
</code></pre>

4. Update Laravel version while keeping illuminate/support package:
If you do not wish to remove the illuminate/support package, you can still upgrade your Laravel framework version by downgrading PHP to a compatible version and using the --ignore-platform-reqs flag when installing the new Laravel version. For example, run these commands to update Laravel 8 while keeping illuminate/support:

<pre><code>$ composer require laravel/framework:9.x --dev -vvv --ignore-platform-reqs
$ composer install --ignore-platform-reqs --no-scripts --no-dev
</code></pre>

Remember to update the Laravel framework's version in your .env file accordingly and ensure you have the compatible PHP version installed.

5. Update composer.json to align with current requirements:
Make sure your composer.json file is up-to-date by following these steps:

a) Add the required dependencies:
<pre><code>{
    "require": {
        "php": "^7.3|^8.1",
        // ...other required packages...
        "illuminate/support": "<your_compatible_version>" // replace with the compatible version for Laravel 8.x
    }
}
</code></pre>

b) Update composer.json with the correct dependency resolution preferences:
<pre><code>{
    "config": {
        "optimize-autoloader": true,
        "preferred-install": "dist",
        "sort-packages": true
    }
}
</code></pre>

c) Run composer update to install the required dependencies:
<pre><code>$ composer update --ignore-platform-reqs --with-dependencies --no-dev
</code></pre>

6. Check for any additional conflicts:
Run your Laravel application and monitor for errors or inconsistencies in your application's functionality. If issues persist, check the composer.json file for conflicting dependencies or missing packages and adjust accordingly.

By following these steps, you should be able to address illuminate/support issues while upgrading to Laravel 8 smoothly. If further assistance is needed, reach out to experts in the Laravel community for guidance.
