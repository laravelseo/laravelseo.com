---
title: "Why do I get an InvalidArgumentException: \"Driver [] is not supported\" error in Laravel?"
description: "Title: Understanding and Resolving \"Driver [] is not supported\" Errors in Laravel In this article, we'll discuss an issue typically encountered during..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Understanding and Resolving "Driver [] is not supported" Errors in Laravel

In this article, we'll discuss an issue typically encountered during Laravel development - the InvalidArgumentException: "Driver [] is not supported" error. This error occurs when a mismatch between the declared driver name and its actual configuration occurs. Let's explore why this happens and how to resolve it effectively.

The Laravel framework uses different file storage drivers for various purposes, like local or cloud-based services (Amazon S3) among others. These drivers are configured in the filesystems.php file found within your project's config folder. A typical Laravel 5.4 configuration might look like this:

```php
return [
    'default' => 'local',

    'cloud' => 's3',

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'visibility' => 'public',
        ],

        's3' => [
            'driver' => 's3',
            'key' => 'your-key',
            'secret' => 'your-secret',
            'region' => 'your-region',
            'bucket' => 'your-bucket',
        ],
        'uploads' => [
            'driver' => 'local',
            'root' => public_path('uploads'),
        ],

    ],

    'storage' => [
        'driver' => 'local',
        'root'   => storage_path(),
    ],

];
```

Here, we can see that the default driver is set to 'local'. It is used for local filesystems and has a root path of storage_path('app'). If you have other drivers configured with different names (let's say 'mydisk'), they may also be present in this configuration file.

The error "Driver [] is not supported" occurs when you attempt to use an unrecognized driver name or incorrectly configure a driver that isn't supported by the Laravel framework. In most cases, this happens due to issues in the filesystems.php file: A mismatch between the declared driver name and its actual configuration, such as referring to a non-existing driver or a driver that is not currently enabled.

To resolve this issue, you must first identify the problematic driver name. Double-check the name in your code (in controllers, models, views, etc.) against the ones listed in the filesystems.php file. If there's no match, ensure the driver exists under any of the 'disks' configuration keys and is correctly configured for use.

If you find that the driver exists but still get this error, try restarting your development server or reinstalling the Laravel framework to ensure all necessary components are up-to-date and functioning properly. If the issue persists, contact the Laravel community for assistance or search online for potential solutions - there might be a configuration conflict that requires further troubleshooting.

In conclusion, the "Driver [] is not supported" error typically stems from a mismatch between the declared driver name in your code and the actual configuration in the filesystems.php file. To fix this issue, double-check the driver names in both locations, ensure that the drivers are correctly configured, and troubleshoot any possible conflicts. By following these steps, you'll be able to eliminate this error from your Laravel application.
