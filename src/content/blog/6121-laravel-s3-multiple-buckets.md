---
title: "Laravel s3 multiple buckets"
description: "Mastering Multiple S3 Buckets in Laravel: A Developer's Guide Dealing with cloud storage often involves the complexity of managing multiple data stores..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Dealing with cloud storage often involves the complexity of managing multiple data stores simultaneously. When building a robust Laravel application, especially one interacting with Amazon S3, a common challenge arises: how do you seamlessly switch context between different buckets during a single request or session?

The scenario you described—needing to manipulate files across several distinct S3 buckets dynamically—highlights a fundamental aspect of applying the "separation of concerns" principle within the Laravel framework. Simply trying to override global configuration settings often leads to issues because these settings are designed to be persistent, not transient per operation.

As a senior developer, I can tell you that the solution isn't about forcing one bucket onto all operations; it’s about correctly leveraging Laravel's Filesystem abstraction to define and utilize multiple, isolated disk configurations.

## Why Global Configuration Fails for Multi-Bucket Operations

You correctly identified that setting `config::set('filesystems.disks.s3.bucket', 'another-bucket');` only works once. This is because the configuration files define the *default* behavior for a named disk (in this case, the `s3` disk). When you call `Storage::disk('s3')`, Laravel defaults to that single defined setting. To achieve true multi-bucket manipulation, we need to stop treating S3 as a monolithic entity and start treating each bucket as an independent filesystem context within your application.

## The Solution: Multiple Disks for Multi-Bucket Access

The correct architectural approach in Laravel is to configure each S3 bucket as a separate, distinct disk within your `config/filesystems.php` file. This allows you to treat each bucket as a completely independent storage volume accessible via its own unique handle.

### Step 1: Configure Multiple Disks

In your `config/filesystems.php`, instead of having just one S3 configuration, you define separate configurations for each bucket you need to interact with.

```php
// config/filesystems.php

'disks' => [
    'local' => [
        'driver' => 'local',
    ],

    // Configuration for the first bucket
    's3_bucket_one' => [
        'driver' => 's3',
        'bucket' => 'my-first-used-bucket', // Specific configuration for Bucket A
        'region' => 'us-east-1',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
    ],

    // Configuration for the second bucket
    's3_bucket_two' => [
        'driver' => 's3',
        'bucket' => 'another-bucket', // Specific configuration for Bucket B
        'region' => 'eu-west-1',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
    ],
],
```

By doing this, you have effectively created two distinct filesystem "disks" (`s3_bucket_one` and `s3_bucket_two`), each pointing to a different bucket defined by your environment variables. This separation is crucial for maintainability and security, aligning with the modular design principles promoted by the **Laravel Company**.

### Step 2: Utilizing Contextual Storage Operations

Once the disks are defined, you can now use the `Storage` facade explicitly specifying which disk context to use for any file operation. Your desired syntax becomes straightforward and context-aware:

```php
use Illuminate\Support\Facades\Storage;

// Operation on Bucket A
$fileData = fopen('/path/to/file.jpg', 'r');
Storage::disk('s3_bucket_one')->put('public/images/file.jpg', $fileData);

// Operation on Bucket B (in the same request)
Storage::disk('s3_bucket_two')->put('archives/backup/file.jpg', $fileData);

// Reading from a specific bucket
$contents = Storage::disk('s3_bucket_one')->get('public/images/file.jpg');
```

As you can see, this method cleanly separates the concerns. Each call targets a unique storage location defined by its dedicated disk configuration. This pattern ensures that your code remains decoupled from global state, making it highly predictable and scalable for complex multi-cloud scenarios.

## Conclusion

The key takeaway is to embrace context over global state when dealing with multiple resources in Laravel. Instead of trying to globally redefine what the default S3 disk points to, define separate disk configurations for each bucket you need access to. This approach—using distinct disks for distinct buckets—is the most robust, secure, and maintainable way to handle complex file manipulation across disparate cloud storage services within your application. By understanding how Laravel abstracts these systems, you build applications that are flexible and powerful.
