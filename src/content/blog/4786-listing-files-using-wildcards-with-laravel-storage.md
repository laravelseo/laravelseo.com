---
title: "Listing files using wildcards with Laravel Storage and AWS S3"
description: "Listing Files Using Wildcards with Laravel Storage and AWS S3 Migrating file storage from a local filesystem using simple functions like glob() to a cloud..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Migrating file storage from a local filesystem using simple functions like `glob()` to a cloud solution like AWS S3 introduces new challenges, especially when dealing with pattern matching. As a senior developer transitioning applications, you'll quickly realize that the simplicity of local shell commands doesn't directly translate to object storage APIs.

This post will guide you through the correct and robust way to list files in an AWS S3 bucket based on wildcard patterns within your Laravel application context.

---

## The Challenge: Globbing vs. Object Storage Listing

In a traditional filesystem, using `glob('path/to/files/*.jpg')` is instantaneous. However, AWS S3 operates as an object store managed via APIs. There is no direct equivalent to the shell's `glob()` function accessible through the standard Laravel `Storage` facade for listing objects based on complex patterns across the entire bucket in a single call.

The core problem is that S3 listing operations are typically focused on prefixes (folders) rather than arbitrary file name wildcards. Therefore, achieving wildcard matching requires fetching the list of all objects and applying the filtering logic within your Laravel application layer.

## Solution: Listing and Filtering Objects in S3

The most reliable method involves using the AWS SDK methods exposed through Laravel's `Storage` facade to retrieve all relevant files and then performing the pattern matching on the resulting file names (keys).

### Step 1: Accessing the Files via the Storage Facade

Since you are using S3, ensure your configuration points correctly. The `Storage` facade abstracts the underlying driver, making this process cleaner than raw SDK calls for simple operations.

```php
use Illuminate\Support\Facades\Storage;

class ImageLister
{
    protected $disk = 's3'; // Assuming 's3' is configured in config/filesystems.php

    /**
     * Lists files matching a wildcard pattern in the S3 bucket.
     *
     * @param string $pattern The glob pattern to match (e.g., 'FS_1054_*.JPG')
     * @return array List of full file paths or metadata
     */
    public function listFilesByWildcard(string $pattern): array
    {
        $files = [];

        // 1. Get all files in the S3 bucket (or prefix)
        // Note: Storage::disk()->files() retrieves all files, which can be slow for huge buckets.
        $allFiles = Storage::disk($this->disk)->files();

        foreach ($allFiles as $path) {
            // 2. Check if the file path matches the desired wildcard pattern
            if (fnmatch($pattern, $path)) {
                $files[] = $path;
            }
        }

        return $files;
    }
}
```

### Step 2: Explanation and Best Practices

The code above demonstrates a common developer pattern when dealing with remote storage. We leverage the `fnmatch()` function in PHP, which is designed specifically for matching filenames against shell-style wildcards (like `*`, `?`, `[]`).

1.  **Retrieval:** We start by fetching all file paths from the S3 disk using `Storage::disk('s3')->files()`.
2.  **Iteration & Filtering:** We then iterate over these results. For each file path retrieved, we use `fnmatch($pattern, $path)` to perform the wildcard comparison against our desired mask (e.g., `'FS_1054_*.JPG'`).
3.  **Result:** Only paths that successfully match the pattern are collected.

While this approach works perfectly for moderate numbers of files, it is crucial to understand its performance implications. For extremely large buckets containing millions of objects, fetching *all* file names and then filtering them in PHP can become computationally expensive and slow down your request.

## Advanced Consideration: Optimizing for Scale

If you are dealing with massive datasets or high-traffic operations, relying on listing every object is inefficient. For scalable solutions, consider these alternatives:

1.  **Prefix Listing:** If your file structure mirrors your desired pattern (e.g., all images live under a specific folder), use S3's prefix-based listing capabilities, which are much faster than listing the entire bucket.
2.  **S3 Inventory:** For large-scale auditing or batch processing, AWS S3 Inventory provides a mechanism to generate reports of objects, which can be processed asynchronously outside of a direct application request loop.

When architecting systems on Laravel, always prioritize efficiency. As you build robust applications, remember that understanding the underlying API limitations—like the difference between local `glob()` and remote object storage listing—is what separates a functional script from a performant, enterprise-grade solution. For deeper architectural insights into leveraging cloud services within your framework, exploring resources like those found at [https://laravelcompany.com](https://laravelcompany.com) is highly recommended.

## Conclusion

You can successfully list files using wildcards in AWS S3 within Laravel by combining the `Storage` facade's file retrieval methods with standard PHP string matching functions like `fnmatch()`. While this method is effective for most use cases, always profile your operations to ensure that performance remains excellent, especially when scaling to massive amounts of data. Choose the right API call for the job, and build efficient systems on top of the robust foundation provided by Laravel.
