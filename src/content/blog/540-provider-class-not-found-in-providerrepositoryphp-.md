---
title: "Provider Class not found In ProviderRepository.php line 208"
description: "Title: Resolving 'Provider Class not found In ProviderRepository.php line 208' During Uninstallation of Spatie/Geocoder Package for Laravel Applications..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Resolving 'Provider Class not found In ProviderRepository.php line 208' During Uninstallation of Spatie/Geocoder Package for Laravel Applications

Body:

Introduction

The error "Provider Class not found In ProviderRepository.php line 208" can be a frustrating experience when attempting to uninstall the Spatie/Geocoder package from your Laravel application. The issue typically occurs when there are conflicts between the composer dependencies and the package's autoloading, or if the package itself is incompatible with your current Laravel version. In this comprehensive guide, we will help you diagnose and resolve this error by offering a correct and thorough explanation from a developer's perspective, including relevant code examples and best practices.

Step 1: Verify Composer Version

Before starting any troubleshooting process, ensure your project has the most up-to-date composer version installed. You can check your current version using this command:

```bash
composer self-update --check
```

If an update is available, run:

```bash
composer self-update
```

Step 2: Update the Spatie/Geocoder Package to Latest Version

Run this command to update the Spatie/Geocoder package to its latest version and ensure compatibility with your Laravel application:

```bash
composer require spatie/geocoder --update-with-all-conflicts
```

This command will attempt to resolve conflicts if any are found. If the issue remains, proceed to step 3.

Step 3: Clear and Reinstall Composer Dependencies

Sometimes, a cache conflict can cause issues when working with packages. To ensure your project has the latest dependencies, run these commands in sequence:

```bash
composer dump-autoload -o
composer update
```

Step 4: Manually Update the ProviderRepository.php File

In case the error persists after running the previous steps, you can attempt to resolve it manually by updating your application's service provider code. Follow these instructions:

1. Locate the `ProviderRepository.php` file in your application's root directory.
2. Open the class definition and locate line 208 (if it exists).
3. Replace the code with this snippet, which ensures the autoloading of the package classes:

```php
public static function add($provider, $class) {
    if (strpos($provider, 'Spatie\\Geocoder') !== false) {
        parent::add($provider, $class);
        require_once __DIR__ . '/vendor/autoload.php';
    }
}
```

Step 5: Reinstall the Package and Verify Its Correct Installation

Once you've updated the `ProviderRepository.php`, you can reinstall the Spatie/Geocoder package by running the following commands in your terminal:

```bash
composer require spatie/geocoder --dev
composer install
```

Step 6: Test Your Application's Functionality

After successfully uninstalling and re-installing the Spatie/Geocoder package, test your application to ensure its functionality. If issues persist, consult the Laravel Company documentation or contact their support team for further assistance.

Conclusion

By following these steps, you should have a better understanding of how to resolve the 'Provider Class not found In ProviderRepository.php line 208' error during uninstallation of the Spatie/Geocoder package in your Laravel applications. Remember always to keep your composer versions updated and try different troubleshooting methods if necessary. If you encounter any other issues or need further assistance, feel free to reach out to the Laravel Company for support.
