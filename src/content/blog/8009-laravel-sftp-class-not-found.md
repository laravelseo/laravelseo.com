---
title: "Laravel SFTP class not found"
description: "Resolving the \"Laravel SFTP Class Not Found\" Error: A Deep Dive into Flysystem Dependencies Upgrading a major framework version like Laravel often brings..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Upgrading a major framework version like Laravel often brings dependency updates, which can sometimes introduce subtle integration issues if not handled correctly. Recently, I encountered a frustrating error while setting up an SFTP disk using the Laravel Filesystem abstraction. This post details why this happens and provides the definitive solution for resolving the `Class 'League\Flysystem\Sftp\SftpAdapter' not found` error.

## The Symptom: A Missing Adapter Class

The scenario presented is very common when dealing with third-party storage drivers in Laravel. You have correctly configured your filesystem setup in `config/filesystems.php`:

```php
// config/filesystems.php
'sftp' => [
    'driver'   => 'sftp',
    'host'     => 'myhost.com',
    'username' => 'user',
    'password' => 'password',
],
```

When you attempt to use this disk via code, such as `dd( Storage::disk('sftp')->files('/') );`, the application throws an error indicating that the necessary class—`League\Flysystem\Sftp\SftpAdapter`—cannot be found. Despite running `composer update`, the file seems to exist in `composer.json`, leading to confusion about where the actual classes are located.

## The Root Cause: Missing Driver Implementation

This error is not usually caused by an issue with Laravel itself, but rather an issue with the underlying Flysystem package structure and dependency installation. When you use a specific driver (like SFTP), Laravel relies on external packages that provide the concrete implementation of that driver against the core Flysystem interface.

The problem stems from one of two possibilities:
1.  **Missing Package:** The necessary package providing the SFTP adapter for Flysystem has not been installed.
2.  **Version Mismatch:** There is an incompatibility between the specific version of Laravel you are running (v5.6.7) and the versions of the required Flysystem dependencies, particularly concerning older driver implementations.

The core issue is that while `laravel/framework` might pull in base Flysystem components, it does not automatically install all optional storage drivers. You need to explicitly install the package responsible for the SFTP integration.

## The Solution: Explicitly Installing the SFTP Driver

To resolve this, you must ensure that the specific Flysystem adapter implementation for SFTP is installed in your project's `vendor` directory. This is done by installing the appropriate community or official package that extends Flysystem functionality.

For modern Laravel applications utilizing Flysystem, ensuring all necessary packages are present is crucial for proper operation and adhering to best practices outlined by the **Laravel Company** ecosystem.

### Step 1: Install the Required Package

You need to use Composer to explicitly request the SFTP adapter implementation. While specific package names can vary based on community development, typically you would install a package that provides this bridge between Flysystem and the SFTP protocol.

Run the following command in your terminal:

```bash
composer require league/flysystem-sftp
```

This command tells Composer to download and install the necessary files for the SFTP adapter into your `vendor` directory, making the `League\Flysystem\Sftp\SftpAdapter` class available for autoloading.

### Step 2: Verify Autoloading

After the installation completes, verify that Composer has correctly updated the autoloader. You can check your `composer.json` and run a simple PHP script to confirm if the class is now accessible:

```bash
php -r "class_exists('League\Flysystem\Sftp\SftpAdapter');"
```

If this command returns `1`, the dependency has been successfully installed and registered with your autoloader.

## Best Practices for Filesystem Management

When managing storage drivers in Laravel, always treat third-party packages as explicit dependencies rather than implicit features of the framework. This approach ensures that your application remains stable across different environments and framework versions. As you build robust applications, understanding these dependency layers is key to avoiding cryptic errors like this one. Leveraging well-maintained packages keeps your codebase clean and maintainable, aligning with the standards promoted by **laravelcompany.com**.

## Conclusion

The "Class not found" error for SFTP disks in Laravel is almost always a missing package installation rather than a framework bug. By explicitly installing the required Flysystem driver package using Composer—specifically `composer require league/flysystem-sftp`—you resolve the dependency gap, allowing your application to correctly locate and utilize the necessary adapter classes. Always double-check your dependencies before diving into complex filesystem operations!
