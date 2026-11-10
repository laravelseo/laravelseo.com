---
title: "how to store upload files in public folder in laravel 8"
description: "How to Store Uploaded Files in the Public Folder in Laravel 8 Under Hosting Restrictions As developers working with shared hosting environments, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with shared hosting environments, we frequently encounter limitations imposed by providers, such as restrictions on functions like `symlink()`. When these restrictions prevent us from using symbolic links—which is a common way Laravel manages file storage via the default `storage` directory—we need an alternative strategy to ensure uploaded files are accessible in the web-accessible `public` folder.

This guide details a robust, developer-focused method to reconfigure Laravel’s filesystem to store user uploads directly within your public directory structure, bypassing the standard storage mechanism when necessary. We will address the pathing confusion you encountered and provide a complete, working solution.

## The Challenge: Storage vs. Public Directory

By default, Laravel is designed to store user-uploaded files in the `storage` directory, which is kept outside the web root for security reasons. When deploying on restricted hosting where symlinks are disabled, this standard setup breaks down because you cannot easily create the necessary links between `storage` and `public`.

Your goal is to map the storage mechanism directly to your web-accessible `/public_html/uploads` folder. This requires manually defining a custom filesystem disk that points to the correct physical location on the server.

## Step 1: Redefining the Filesystem Disk

The key to this solution lies in configuring Laravel’s filesystem settings to recognize a new "disk" named `uploads` that points specifically to your desired public folder location, rather than relying on the default storage paths.

You need to modify your configuration file, typically located at `config/filesystem.php`. Within the `disks` array, you will define your custom disk:

```php
// config/filesystem.php

'disks' => [
    // ... other disks

    'uploads' => [
        'driver' => 'local',
        // Crucially, set the root to point to the public path() function.
        // This tells Laravel that anything stored on this disk should resolve to the public directory.
        'root'   => public_path(), 
    ],
],
```

By setting `'root' => public_path()`, we are instructing Laravel’s storage abstraction layer that when it interacts with the `uploads` disk, it will operate within the web-accessible structure. This aligns perfectly with how files need to be served directly from your hosting environment without symlinks. For more advanced filesystem management in Laravel projects, understanding these concepts is vital, as detailed by resources like those found on [laravelcompany.com](https://laravelcompany.com).

## Step 2: Implementing the Upload Logic Correctly

Once the disk is defined, you must update your controller logic to explicitly use this new `uploads` disk instead of the default `local` or `storage` disks for file operations. This ensures that when a file is saved using methods like `put()` or `storeAs()`, it targets the custom location we just configured.

Here is how you would adjust your upload method in your controller:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

public function uploadVideo(Request $request)
{
    $target = $request->input('target');

    // Get necessary file information
    $fileNameWithExt = $request->file($target)->getClientOriginalName();
    $filename = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
    $extension = $request->file($target)->getClientOriginalExtension();
    $fileNameToStore = $filename . '_' . time() . '.' . $extension;

    // Use the custom 'uploads' disk for storage operations
    // The path relative to the root ('public_path()') will be managed by this disk.
    $path = Storage::disk('uploads')->put($target, $fileNameToStore);
    
    return 'uploads/' . $target . '/' . $fileNameToStore;
}
```

Notice how we explicitly call `Storage::disk('uploads')`. This directs the operation away from Laravel’s default storage configuration and into our custom path defined in `config/filesystem.php`. This method ensures that files are written directly where the web server can access them, solving the issue of creating an isolated folder within the framework's internal structure.

## Conclusion

Dealing with hosting limitations often requires moving beyond the default conventions. By understanding how Laravel’s filesystem abstraction works—specifically by redefining custom disks and explicitly targeting those disks in your code—you gain full control over where files are stored. This approach is practical, secure, and ensures that your user uploads reside directly within your public directory structure, regardless of server-side restrictions on symbolic links. For a deeper dive into managing application architecture and file handling in Laravel, always refer to the comprehensive documentation available at [laravelcompany.com](https://laravelcompany.com).
