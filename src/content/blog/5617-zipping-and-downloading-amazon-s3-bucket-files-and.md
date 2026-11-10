---
title: "Zipping and downloading Amazon S3 bucket files and folders in Laravel"
description: "Zipping and Downloading Amazon S3 Files and Folders in Laravel As a senior developer working with cloud infrastructure, we frequently encounter scenarios..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with cloud infrastructure, we frequently encounter scenarios where data resides in object storage like Amazon S3, and the requirement is to bundle these assets for easy distribution. The question—how to zip multiple folders and files from an S3 bucket and serve them through a Laravel application—is a common and practical challenge.

The short answer is that while S3 itself doesn't offer a native "zip" command, we can leverage the AWS SDK within our PHP environment (Laravel) to manage the file retrieval and then use PHP’s built-in capabilities to perform the actual compression before serving the result.

This guide will walk you through the robust process of fetching specific files from S3, packaging them into a single ZIP archive on your Laravel server, and making that archive downloadable by a user.

## The Architecture: Orchestrating S3 and Zipping in Laravel

The overall flow involves three main steps:
1. **Authentication & Listing:** Authenticate with AWS and list the specific objects (files/folders) you wish to compress from the S3 bucket.
2. **Download & Aggregate:** Download the contents of these objects locally onto the Laravel server's temporary storage.
3. **Compression & Delivery:** Use PHP’s `ZipArchive` class to create a single ZIP file containing all the downloaded assets, and then serve this archive back to the client via a Laravel route.

This approach keeps the heavy lifting within the application layer, which is where Laravel excels at managing requests and business logic. For robust cloud-native development, understanding how to interact with external services like AWS seamlessly is crucial, much like mastering the ecosystem described on [laravelcompany.com](https://laravelcompany.com).

## Step-by-Step Implementation Guide

### 1. Setting Up S3 Interaction

Before starting, ensure your Laravel application has the necessary AWS credentials configured (usually via environment variables or IAM roles if running on AWS infrastructure). You will typically use the AWS SDK for PHP to interact with S3.

For this example, we assume you have identified the paths of the three folders and one file you want to zip from a bucket named `my-data-bucket`.

### 2. Downloading Files Locally

We need to download the contents of the desired objects into a temporary directory on the server, where we can manipulate them.

```php
use Illuminate\Support\Facades\Storage;
use Aws\S3\S3Client;

class S3ZipController extends Controller
{
    public function createZip(S3Client $s3Client)
    {
        $bucket = 'my-data-bucket';
        $filesToZip = [
            'folder1/fileA.txt',
            'folder2/', // Note: We handle folders by copying the directory structure
            'image.jpg'
        ];

        $tempDir = storage_path('app/temp_s3_zip');
        if (!is_dir($tempDir)) {
            mkdir($tempDir);
        }

        foreach ($filesToZip as $s3Key) {
            // 1. Download the object from S3 to a temporary local path
            $localPath = $tempDir . '/' . basename($s3Key); // Simple example for demonstration
            
            // In a real scenario, you would use the S3Client::getObject method here
            // and stream the result to $localPath.

            // For demonstration purposes: simulate download
            if (!file_exists($localPath)) {
                 // Error handling omitted for brevity, but crucial in production
                throw new \Exception("Failed to download: " . $s3Key);
            }
        }

        // ... proceed to Step 3: Zipping ...
    }
}
```

### 3. Creating the ZIP Archive

Once all necessary files are staged locally, we use PHP’s `ZipArchive` class to create the final package. This step bundles the downloaded local files into a single downloadable artifact.

```php
use Illuminate\Support\Facades\Zip;
// ... inside your controller method ...

    public function createZip(S3Client $s3Client)
    {
        // ... (Assume Step 2 successfully populated the temporary files) ...
        $tempDir = storage_path('app/temp_s3_zip');
        $zipFileName = 's3_archive_' . time() . '.zip';
        $zipPath = storage_path('app/' . $zipFileName);

        $zip = new \ZipArchive();

        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === TRUE) {
            // Add all staged files to the zip archive
            array_map(function($file) use ($zip, $tempDir) {
                $relativePath = str_replace($tempDir . '/', '', $file); // Adjust path for clean ZIP structure
                $zip->addFile($file, $relativePath);
            }, glob($tempDir . '/*'));

            $zip->close();

            // Clean up temporary files (CRITICAL STEP)
            array_map('unlink', glob($tempDir . '/*'));
            rmdir($tempDir);

            return response()->download($zipPath, $zipFileName);
        } else {
            return response('Error creating ZIP file.', 500);
        }
    }
```

## Conclusion: Best Practices for S3 Data Management

Handling large file operations and external API calls requires careful attention to performance and security. When dealing with S3 data in Laravel, remember these best practices:

1. **Use Streams:** For very large files, avoid downloading entire files into memory before zipping. Use stream functions provided by the AWS SDK to stream data directly from S3 into your zip archive buffer if possible.
2. **Temporary Storage Cleanup:** Always ensure that temporary files downloaded from S3 are deleted immediately after they have been successfully added to the ZIP file. This prevents disk space issues and potential security breaches.
3. **Permissions (IAM):** Ensure the IAM role or access keys used by your Laravel application have only the minimum necessary permissions (Principle of Least Privilege) to read objects from the bucket.

By combining Laravel’s request handling capabilities with robust PHP tools, you can effectively bridge the gap between cloud storage and user-friendly file delivery.
