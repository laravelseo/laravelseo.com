---
title: "Laravel storage link won't work on production"
description: "Title: Laravel Storage Links in Production Mode Common Issues & Solutions Body: When working with Laravel applications, storage links can sometimes become an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Laravel Storage Links in Production Mode - Common Issues & Solutions

Body: When working with Laravel applications, storage links can sometimes become an issue during production mode. This problem might arise when you're using `storage_path` to store your images and symbolically linking your storage folder to `public_html`. You may encounter this issue on live hosts or in production environments. In this blog post, we'll explore why these problems occur, how to fix them, and best practices for avoiding such issues in the future.

First, it is essential to understand how Laravel handles file system storage. The `config/filesystems.php` configuration file allows you to define the file drivers and their specific configurations. In your `public` folder's configuration, set up the "public" driver with a root at:

```php
'public' => [
  'driver' => 'local',
  'root' => storage_path('app/public/'),
  'url' => env('APP_URL').'/storage',
  'visibility' => 'public',
],
```

Next, you can set up the appropriate environment variables in your `.env` file:

```php
FILESYSTEM_DRIVER=public
```

To store and retrieve images from storage, you might have a controller that uses a sample code like this:

```php
if ($request->hasFile('image')) {
  $image = $request->file('image');
  $filename = 'page' . '-' . time() . '.' . $image->getClientOriginalExtension();
  $location = storage_path('app/public/images/' . $filename);
  Image::make($image)->resize(1200, 600)->save($location);
  if(!empty($page->image)){
    Storage::delete('images/' . $page->image);
  }
  $page->image = $filename;
}
```

However, when working with production environments or live hosts, sometimes these storage links don't work properly. This is generally due to the fact that in production mode, Laravel utilizes a different filesystem driver (typically `faux`, `local`, or `public`) for file operations and storage management. Consequently, your image uploads will be stored within the appropriate storage directory but not reflected in your `public_html/storage` folder, making it hard to access them on the front-end.

To resolve this issue, you can make several adjustments:

1. Ensure that your production environment is properly configured for file system storage and its visibility settings. Make sure the `filesystems.php` and `faux` or other applicable filesystem drivers are set up correctly to match your needs.

2. When moving from local development to live hosts, make sure you update your server's file permissions to allow Laravel to access and manage storage files as necessary (e.g., setting the correct ownership and permissions on directories like `storage`).

3. Try using a symlink for your production environment's `public_html/storage` folder to point directly to your project's storage location, allowing you to access images from this URL in your front-end:

```bash
$ cd /path/to/project/public
$ ln -s ../../storage public_html/storage
```

4. Ensure that the correct `APP_URL` environment variable is set for both your local development and production environments, allowing for proper storage URL generation in both modes.

Remember that while these steps can help you resolve such issues, always ensure best practices when working with Laravel file system management. This includes using appropriate driver configurations, maintaining clean and organized storage directories, and handling image uploading and deletion efficiently through controllers or custom services. For further information on this topic, refer to the Laravel documentation or reach out to a professional Laravel development team like https://laravelcompany.com to guide you in proper implementation.
