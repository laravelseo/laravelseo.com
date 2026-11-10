---
title: "Laravel Public url for storage files"
description: "Title: Effortlessly Retrieving Public URLs for Stored Files in Laravel Body: When working with Laravel's file management utilities, it is crucial to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Effortlessly Retrieving Public URLs for Stored Files in Laravel

Body:

When working with Laravel's file management utilities, it is crucial to understand how to generate public access URLs for the files stored within your application. In this blog post, we will discuss several methods that can help you accomplish this task efficiently and effectively. We will use the storage::putFile() method and storage::files() method as examples.

Firstly, let's break down each of these methods:

1. `storage::putFile('public/spares');`
This method stores one or more files in a specified directory within Laravel's storage system. The first argument represents the path where you want to save the file. In your case, it is 'public/spares.' This command would create a directory named "spares" under the public folder and store the uploaded file within it.

2. `storage::files('public/spares');`
This method returns all files in the specified directory path. Here, the path argument passed through is 'public/spares.' It returns an array with information about each of the stored files under that specific directory. However, these file paths are relative to Laravel's storage directory and not the public URL you would use to access them from your website.

Now, let us discuss how to generate the required public URLs for these files:

1. Use the asset() helper function:
The simplest way to generate public URLs is by using the asset() PHP helper function. Here's an example of how you can access the URLs within a Blade template or controller code:

```php
$docs = File::files('storage/document');
$lastmodified = [];
foreach ($docs as $key => $value) {
   $docs[$key] = asset($value);
   $lastmodified[$key] = File::lastmodified($value);
}
return view('stock.document', compact('docs', 'lastmodified'));
```

The asset() function will generate the correct public URL for each of the stored files based on your application's configuration within Laravel.

2. Manually construct URLs:
If you have a specific need to manually construct the public URLs, you can use the following code snippet:

```php
$docs = File::files('storage/document');
foreach ($docs as $key => $value) {
   $docs[$key] = url('/') . '/' . config('app.url'). 'storage/' . ltrim(str_replace(config('filesystems.disks.local.root'), '', $value), '/');
   $lastmodified[$key] = File::lastmodified($value);
}
return view('stock.document', compact('docs', 'lastmodified'));
```

Here, we use the url() helper function to generate the base URL for your application and concatenate it with the appropriate storage path for each file. Additionally, we use ltrim() to remove any leading '/' characters from the original filename.

In conclusion, Laravel offers various ways to retrieve public URLs for stored files, such as using the asset() helper function or manually constructing them. By following these methods, you can easily provide access to your users while maintaining a well-organized storage structure in your Laravel application.
