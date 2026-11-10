---
title: "Get S3Client from storage facade in Laravel 9"
description: "Getting the Underlying S3Client from the Storage Facade in Laravel 9 Upgrading large applications often introduces unexpected hurdles, especially when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Upgrading large applications often introduces unexpected hurdles, especially when migrating between major framework versions. The shift from Laravel 8 to Laravel 9, coupled with the mandatory move to Flysystem 3, required developers to re-evaluate how they access underlying dependencies. For those implementing complex file operations like S3 Multipart Uploads, this change can expose subtle but frustrating method signature differences.

This post dives into the specific issue you are facing: attempting to retrieve the raw `Aws\S3\S3Client` from the Laravel `Storage` facade in a Flysystem 3 environment, and how to correctly implement operations that require direct SDK access.

## The Migration Pain Point: Why the Old Approach Fails

In Laravel 8, accessing the underlying AWS client was straightforward, relying on a deep dive into the driver chain:

```php
// Working in Laravel 8 (Pre-Flysystem 3 shift)
$client = Storage::disk('s3')->getDriver()->getAdapter()->getClient();
```

This worked because the structure of the `Filesystem` interface and its underlying implementations allowed for this direct traversal.

However, with Flysystem 3, the abstraction layer has been tightened significantly. Methods like `getAdapter()` are often removed or relocated to enforce better separation between the filesystem logic and the adapter implementation. As you correctly found, Laravel 9 throws an exception because this specific chain of methods no longer exists in the updated structure.

## The Flysystem 3 Philosophy: Abstraction Over Exposure

Flysystem is designed around the principle of abstraction. It provides a unified interface for file operations regardless of the underlying storage mechanism (S3, local disk, FTP, etc.). While it’s crucial to understand the architecture—especially when dealing with enterprise solutions like those discussed by teams at [laravelcompany.com](https://laravelcompany.com)—we must respect the boundaries set by the framework's evolution.

The goal of Flysystem is for you to interact with the *filesystem* methods (`write`, `read`, `move`) rather than exposing deep, implementation-specific details like the raw SDK client, unless that detail is absolutely necessary for a unique operation.

## The Correct Approach: Accessing the S3 Client Contextually

If your goal is specifically to perform an AWS-native action like creating a Multipart Upload, you need access to the `S3Client`. Instead of forcing the `Storage` facade to expose this deep internal structure, we should leverage dependency injection or configuration to obtain the necessary client when performing specialized tasks.

Since the standard `Storage::disk('s3')` method is optimized for general operations, accessing the raw AWS client usually requires looking upstream at how the disk driver was instantiated.

### Solution: Accessing the Connection via Configuration and Driver

For complex operations that require direct SDK interaction (like Multipart Uploads), it is often safer to retrieve the necessary configuration details directly from your environment or a dedicated service, rather than relying on an internal property of the facade.

If you are using the default S3 driver provided by Flysystem, you can access the underlying connection parameters needed for the `Aws\S3\S3Client` instantiation through the configuration files:

```php
use Illuminate\Support\Facades\Config;
use Aws\S3\S3Client;

class MultipartUploaderService
{
    public function createMultipartUpload(string $bucket, string $key): array
    {
        // Retrieve S3 credentials from configuration
        $config = Config::get('filesystems.disks.s3');

        if (!$config) {
            throw new \Exception("S3 disk configuration not found.");
        }

        // Instantiate the AWS S3 Client directly using config details
        $client = new S3Client([
            'version' => 'latest',
            'region' => $config['region'],
            'credentials' => [
                'key'    => $config['key'],
                'secret' => $config['secret'],
            ],
        ]);

        // Now perform the specific S3 operation
        $result = $client->createMultipartUpload([
            'Bucket' => $bucket,
            'Key' => $key,
            'ContentType' => 'image/jpeg',
            'ContentDisposition' => 'inline',
        ]);

        return [
            'uploadId' => $result['UploadId'],
            'key' => $result['Key'],
        ];
    }
}
```

## Conclusion

Migrating from Laravel 8 to 9 forces a refactoring of how we interact with underlying dependencies. While the old chaining method has been deprecated in favor of a cleaner, more abstract Flysystem structure, specialized tasks—like initiating an S3 Multipart Upload—still require access to the raw AWS SDK client. By shifting the responsibility of client instantiation from the facade deep-dive to direct configuration retrieval, we ensure our code remains robust, decoupled, and compatible with the modern Laravel ecosystem. Always prioritize abstraction where possible, but know when specialized access is necessary.
