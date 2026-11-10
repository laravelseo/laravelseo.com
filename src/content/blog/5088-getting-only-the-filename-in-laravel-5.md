---
title: "Getting only the filename in laravel 5"
description: "Getting Only the Filename When Listing Files in Laravel As developers working with file systems, one of the most common tasks is listing files within a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As developers working with file systems, one of the most common tasks is listing files within a directory structure. While built-in functions like PHP's `File::allFiles()` are powerful for retrieving paths, they often return more information than necessary. In your scenario, you are correctly pulling full directory paths, but you only desire the actual filenames.

This post will walk you through the most straightforward and efficient way to process these file paths in a Laravel application to extract just the filename, ensuring clean data presentation for your users.

## The Problem: Full Paths vs. Filenames

Let's first look at the scenario you presented. When using methods like `File::allFiles($storagePath)`, the resulting array contains absolute or relative paths to every file within that directory.

If you have a storage path like `/xampp/htdocs/systeembeheer/public/download`, the result for a file named `test.txt` is:
`/xampp/htdocs/systeembeheer/public/download/test.txt`

As you noted, this full path is verbose and usually not what the user needs when displaying a simple file list. You only want the component that names the actual file (`test.txt`).

## The Solution: Using PHP's `basename()` Function

The key to solving this problem lies in leveraging fundamental PHP string manipulation functions. For extracting the final component of a file path, the perfect tool is the built-in `basename()` function. This function takes a full path as input and returns the final component of that path, which is exactly the filename you are looking for.

We can apply this logic directly to the array returned by Laravel’s file methods.

### Implementation Example

Here is how you would modify your controller or service logic to achieve the desired result:

```php
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;

class FileController extends Controller
{
    public function index()
    {
        // 1. Define the storage path
        $storagePath = '/xampp/htdocs/systeembeheer/public/download';

        // 2. Get all file paths (as you did before)
        $files = File::allFiles($storagePath);

        // 3. Process the array to extract only the filenames
        $filenames = [];
        foreach ($files as $filePath) {
            // Use basename() to extract just the filename from the full path
            $filenames[] = basename($filePath);
        }

        // 4. Return the result to the view
        return View::make('documentatie.overzicht')
            ->with('files', $filenames);
    }
}
```

### Refactoring for Efficiency (Laravel Best Practice)

While the `foreach` loop above is perfectly clear, modern PHP and Laravel development often favor more concise array functions when dealing with collections. You can achieve the same result using the `array_map()` function, which applies a callback to every element in an array:

```php
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;

// ... inside your method

$storagePath = '/xampp/htdocs/systeembeheer/public/download';
$files = File::allFiles($storagePath);

// Use array_map to apply basename() to every element efficiently
$filenames = array_map('basename', $files);

return View::make('documentatie.overzicht')
    ->with('files', $filenames);
```

This approach is cleaner, more idiomatic for PHP, and reduces the amount of boilerplate code, which aligns with the principles advocated by modern frameworks like [Laravel](https://laravelcompany.com).

## Conclusion

By understanding how to manipulate file paths using native PHP functions like `basename()`, you can transform raw system data into clean, user-friendly information. Whether you are listing files, generating reports, or managing storage within a Laravel application, mastering these underlying PHP concepts is crucial for writing robust and efficient code. Always strive to use the most direct tool for the job; in this case, `basename()` provides the simplest and most reliable solution for extracting filenames from full paths.
