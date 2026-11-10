---
title: "LARAVEL - Displaying images from the storage folder"
description: "Laravel Image Display: How to Show Files from the Storage Folder Without Symbolic Links Welcome to the world of file management in Laravel! It’s a very..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Welcome to the world of file management in Laravel! It’s a very common point of confusion for developers, especially when dealing with deployment environments. You have successfully uploaded your files to the disk system, but now you need to bridge the gap between that internal storage location and what your web browser can actually see. As a senior developer, I can tell you that while the `php artisan storage:link` command is the most common solution for public assets, there are ways to handle file display within your application logic itself, which gives you more control over the process—especially when dealing with restricted server environments.

This post will walk you through exactly how to correctly reference and display images stored in your Laravel `storage` directory without relying on symbolic links, focusing on using Laravel's built-in storage facade.

## Understanding Laravel Storage Disks

When you use methods like `$file->storeAs('avatars/' . auth()->id(), 'avatar.jpg')`, Laravel saves that file into the designated disk, which by default is the `local` disk within the `storage/app` directory. The key to accessing these files is understanding how Laravel manages file paths versus public web paths.

The standard setup involves creating a symbolic link from `storage/app/public` to `public/storage`. This link tells the web server (like Apache or Nginx) that anything inside the `public/storage` directory should be accessible via a URL. When you skip this step, you bypass the public symlink mechanism entirely and must use Laravel's internal file handling methods instead.

## Solution: Using the Storage Facade for Display

Instead of attempting to create a manual link (which is often server-dependent), the most robust solution is to let the `Storage` facade handle the path generation on the backend, and then use that generated path when rendering your view. This keeps the file management entirely within Laravel's control.

### Step 1: Ensure the File Path is Correct

Your controller logic for saving the file is correct:

```php
if (request()->hasFile('avatar')) {
    $file = request()->file('avatar');

    // Save the file to the 'avatars' directory within the storage disk
    $path = 'avatars/' . auth()->id() . '/avatar.jpg';
    $file->storeAs($path, $file->getFilename());
}
```

Notice that we are storing the path *relative* to the configured disk (e.g., `local`).

### Step 2: Generating the Public URL in Your Controller

To display this image on a view, you need to generate a URL that points to the file. You can use the `Storage` facade for this purpose. Although we are avoiding the symlink for public access, we still leverage the facade to correctly resolve the internal path into a usable string:

```php
use Illuminate\Support\Facades\Storage;

// Inside your controller method where you fetch the user data:
$userId = auth()->id();
$imagePath = "avatars/{$userId}/avatar.jpg"; // The path saved internally

// Generate the public URL for the image
$imageUrl = Storage::disk('local')->url($imagePath);

// Pass $imageUrl to your view
return view('profile', ['user' => $user, 'avatarUrl' => $imageUrl]);
```

### Step 3: Displaying the Image in the Blade View

Finally, you can display this generated URL directly in your HTML using the standard `<img>` tag.

```html
<!-- In your profile blade file -->
<img src="{{ $avatarUrl }}" alt="User Avatar" width="100">
```

## Why This Approach is Better

By using `$imagePath` and the `Storage::url()` method, you are decoupling the file access from the server's public configuration. You are not relying on a specific symlink existing in the web root; instead, you are asking the Laravel framework, which knows exactly where the files are stored internally, to construct the correct external path for display. This makes your application significantly more portable and resilient across different deployment scenarios, adhering to modern Laravel best practices found on the official platform like https://laravelcompany.com.

## Conclusion

Displaying files stored in the `storage` directory without using symbolic links is achievable by bypassing the public linking mechanism and instead utilizing the powerful file management tools provided by the `Storage` facade. By generating the URL directly within your application code, you ensure that your image display logic remains consistent, regardless of how your server is configured. Always favor framework methods over manual file system interactions when dealing with Laravel assets!
