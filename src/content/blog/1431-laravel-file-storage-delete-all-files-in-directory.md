---
title: "Laravel File Storage delete all files in directory"
description: "Title: Efficiently Deleting All Files in Laravel Storage Directories Introduction Laravel provides a powerful Filesystem API that allows developers to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Deleting All Files in Laravel Storage Directories

Introduction

Laravel provides a powerful Filesystem API that allows developers to efficiently manage file storage. One of the tasks we often come across is deleting all files from a specific directory, particularly when dealing with assets or temporary items. In this comprehensive blog post, we'll explore how to delete all files in a directory using Laravel's Filesystem API and provide practical code examples for a cleaner workflow.

Method 1: Using Storage Facade to Delete Files

The most straightforward method of deleting all files from a specific directory involves utilizing the Storage Facade, which is an interface provided by Laravel that allows us to manipulate file storage. Here's how it can be done:

```php
use Illuminate\Support\Facades\Storage;

// Delete all files with .jpg extension in a backgrounds directory
$files = Storage::allFiles('backgrounds'); // Get all the files list
foreach ($files as $file) {
    if (strpos($file, '.jpg') !== false) {
        Storage::delete($file);
    }
}
```

In this method, we first get all the files in a specific directory using the Storage Facade. Then, for each file, we check its extension to identify the ones with .jpg. Finally, we delete those found with .jpg. This technique is useful when you need to delete files based on their extensions or specific names.

Method 2: Deleting All Files in a Directory with Wildcards

Another approach is using wildcards to quickly delete all files in a directory without checking their extension. Here's how it can be done:

```php
use Illuminate\Support\Facades\Storage;

// Delete all files in 'backgrounds' directory using wildcards
Storage::delete('backgrounds\*.*'); // This will delete all files and subdirectories under 'backgrounds'
Storage::delete('backgrounds\*\*'); // This will delete only the files with names starting with '**' from 'backgrounds' (such as ***_cover.jpg)
```

In this method, we use wildcards to delete all or specific types of files in a directory. The first command deletes all files and subdirectories under the specified directory, while the second one removes files that start with two asterisks from the given path. However, be cautious when using wildcards as they might unintentionally delete essential files if not used correctly.

Conclusion

In conclusion, deleting all files in a specific Laravel storage directory can be done efficiently using either one of these methods or their combinations based on your requirements. Always ensure you have a backup copy of those crucial files before proceeding with any file operations. For more information on Laravel's File System API and other tips for efficient file management, visit our blog at https://laravelcompany.com/blog/.
