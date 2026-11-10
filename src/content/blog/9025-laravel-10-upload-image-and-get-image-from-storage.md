---
title: "Laravel 10 upload image and get image from storage"
description: "Laravel 10: Mastering Image Uploads and Accessing Files from Storage As a senior developer, I’ve seen countless developers get stuck on file management in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer, I’ve seen countless developers get stuck on file management in Laravel. The frustration you are feeling—where tutorials seem to contradict the actual behavior of symlinks and storage paths—is extremely common. It usually stems from misunderstanding how Laravel’s filesystem abstraction layers interact with the operating system.

The goal here is simple: upload an image, ensure it’s accessible via a public URL, and understand the backend mechanism that makes this work. Let's break down the precise, modern way to handle image uploads in Laravel 10 using the `storage` disk.

## Understanding Laravel Storage Disks

Before diving into code, we must understand where Laravel actually stores files. Laravel uses a concept called "Disks" defined in `config/filesystems.php` to abstract storage locations (local, S3, etc.). When you use the `storage` disk, by default, it points to the `storage/app` directory on your server.

The confusion often arises because we don't want files stored deep within `storage/app`, but rather in a publicly accessible location. This is where symlinks and the `public` disk come into play.

## Step 1: Configuring the Public Link (The Essential Step)

The most common roadblock for uploading and viewing public assets is not the upload itself, but the linking mechanism. When you use Laravel's storage features, you need to explicitly tell the system how to map your internal storage path to the web-accessible `public` folder.

Laravel provides a dedicated command for this:

```bash
php artisan storage:link
```

This command creates a symbolic link from `storage/app/public` to the `public/storage` directory. This is crucial because it exposes the contents of your application's storage directly through the web server’s public root, making them accessible via URLs. If you skip this step, your files exist on the server but are completely inaccessible via the web.

## Step 2: Uploading the Image Correctly

When uploading files, we use the `Storage` facade and specify which disk to use. For public assets, we typically target the `public` disk configured in our filesystem settings.

Here is how you handle the upload process within a controller or service:

```php
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PhotoController extends Controller
{
    public function upload(Request $request)
    {
        // 1. Validate the incoming file
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg',
        ]);

        // 2. Handle the upload and save the file to the 'public' disk
        // The path passed here ('profilephotos/filename.jpg') becomes the folder structure inside storage/app/public
        $path = $request->file('image')->store('profilephotos', 'public');

        // $path now contains the relative path, e.g., profilephotos/12345.jpg
        
        return response()->json(['message' => 'Image uploaded successfully.', 'path' => $path]);
    }
}
```

**Why this works:** By specifying `'public'` as the second argument to `store()`, Laravel automatically uses the configured public disk, which is linked by our `storage:link` command. This ensures the file lands in a publicly accessible location. For more detailed information on filesystem management and best practices within the framework, exploring documentation from [laravelcompany.com](https://laravelcompany.com) is always beneficial.

## Step 3: Retrieving the Image via URL

Once the file is correctly stored and linked, retrieving it for display in a Blade view is straightforward using the `asset()` helper function, pointing to the public storage path.

If you saved the image under the folder `profilephotos` with the filename `12345.jpg`, the URL structure will be:

```blade
<img src="{{ asset('storage/profilephotos/12345.jpg') }}" alt="Profile Photo">
```

This works because the `asset()` helper correctly prepends the public web root (`public/storage`) to construct the final URL, perfectly bridging the gap between your internal storage logic and the public front end.

## Conclusion: The Complete Workflow Summary

The process isn't about manually managing symlinks in the controller; it’s about trusting Laravel’s abstraction layer.

1.  **Configure:** Ensure `config/filesystems.php` is set up correctly, defining disks like `public`.
2.  **Link:** Run `php artisan storage:link` to establish the bridge between `/storage` and `/public`.
3.  **Upload:** Use `Storage::disk('public')->put(...)` or simply `Storage::put(filename, content)` if you are using the default disk setup correctly.
4.  **Access:** Use `asset('storage/your_folder/image.ext')` in your views.

By following this standardized approach, you eliminate the confusion caused by manual path manipulation and ensure your image uploads and retrieval are robust, scalable, and follow Laravel best practices.
