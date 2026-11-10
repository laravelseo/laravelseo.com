---
title: "How to create .json file and write into that file with data using PHP/Laravel"
description: "How to Create and Write Data to a JSON File using PHP/Laravel As developers, we often deal with the need to persist data in various formats. While relational..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As developers, we often deal with the need to persist data in various formats. While relational databases like MySQL or PostgreSQL are the backbone for structured data storage, JSON files offer flexibility for configuration, caching, or exporting data to external systems. This guide will walk you through the practical process of taking structured data—like image metadata from a form submission—and serializing it into a `.json` file using the power of PHP within a Laravel environment.

## The Scenario: Bridging Database and File Storage

Imagine you have an application where users upload images with titles. After processing, you store the image on the server (e.g., in `public/uploads`) and log the metadata (filename, title) into a database table. Now, you need a mechanism to create an archive or export of this data into a human-readable `.json` format for backup or external consumption.

The goal is to ensure that every record in your database translates directly into a corresponding entry in a JSON file, maintaining consistency and integrity.

## Step 1: Establishing the Data Foundation (Laravel Eloquent)

Before writing to a file, we must ensure our data source—the database—is clean and accessible. In Laravel, this is best handled by defining a Model and using Eloquent to retrieve the necessary records. This adheres to the principles of separation of concerns, which is fundamental in large applications, much like how robust frameworks guide development within **https://laravelcompany.com**.

Let's assume you have an `Image` model tied to a database table:

```php
// Example Eloquent Model (app/Models/Image.php)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['filename', 'title', 'path'];
}
```

## Step 2: Retrieving Data for Export

The next step is to query the database and structure the results into an array format that can be easily converted into JSON. This should typically happen within a Controller or a dedicated Service class.

In this example, we will retrieve all image records and prepare them for file writing.

```php
use App\Models\Image;
use Illuminate\Support\Facades\File;

class DataExporter
{
    public function exportToPdf()
    {
        // 1. Retrieve all necessary data from the database
        $images = Image::all();

        if ($images->isEmpty()) {
            return;
        }

        // 2. Structure the data for JSON serialization
        $dataToExport = [];
        foreach ($images as $image) {
            $dataToExport[] = [
                'name' => $image->filename,
                'title' => $image->title,
                'path' => $image->path, // Include other relevant fields
            ];
        }

        // 3. Prepare the JSON content
        $jsonContent = json_encode($dataToExport, JSON_PRETTY_PRINT);

        // 4. Write the content to a file
        $filePath = storage_path('exports/image_metadata_' . time() . '.json');

        if (File::put($filePath, $jsonContent) === false) {
            throw new \Exception("Failed to write JSON file.");
        }

        return $filePath;
    }
}
```

## Step 3: Writing the Data to the JSON File (The File System Interaction)

The core of writing to a file in PHP is handled by built-in functions like `json_encode()` and file system functions like `file_put_contents()` or `File::put()`. Using Laravel's `File` facade, as shown above, provides a clean, framework-aware way to interact with the storage directory (`storage_path()`), which is a best practice for managing application files.

The key sequence is:
1. **Collect:** Gather all related data into a PHP array structure.
2. **Encode:** Use `json_encode()` to transform the PHP array into a JSON string.
3. **Write:** Use a file operation function to write that JSON string directly to the desired file path on the disk.

This method ensures that your database remains the single source of truth, while the JSON file serves as an efficient, portable export format. If you are building complex data pipelines, understanding how Laravel manages storage and file operations is crucial for scalable development in **https://laravelcompany.com**.

## Conclusion

Creating a `.json` file from database records in a Laravel application is a straightforward process that emphasizes the separation of concerns. By leveraging Eloquent to fetch structured data and PHP's native functions for file manipulation, you achieve a robust system where your primary data remains secure in the database, and your archival/export files are easily accessible outside the application context. This pattern allows for flexible data management, making your Laravel application more powerful and maintainable.
