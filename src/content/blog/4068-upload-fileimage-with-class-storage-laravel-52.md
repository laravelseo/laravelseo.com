---
title: "Upload File/Image with class Storage Laravel 5.2"
description: "Uploading Files with Laravel Storage: Debugging Your File System Setup As a senior developer, I frequently encounter situations where developers try to map..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer, I frequently encounter situations where developers try to map custom file system configurations in Laravel, only to find that the files simply don't appear where expected. This is a very common hurdle when working with the `Storage` facade. Today, we will diagnose why your file upload isn't saving to the `public/img` directory and explore the most robust ways to handle file management in Laravel.

## Diagnosing the Issue: Why Your Uploads Aren't Saving

The issue you are facing stems from a common point of confusion regarding how Laravel’s Storage system interacts with physical directories, especially when defining custom disks.

You configured your `uploads` disk like this:
```php
'uploads' => [
    'driver' => 'local',
    'root'   => public_path() . '/img',
],
```
And you attempted to save the file using:
```php
Storage::disk('uploads')->put('filename', $filename);
```

The problem lies in how `local` drivers typically operate and how they interact with web-accessible paths. When you define a custom root for a disk, Laravel uses that path as the *base* for all file operations within that disk context. However, when dealing with public assets meant to be directly accessible via a URL (like images), relying on custom disk configurations can introduce complexity.

For simple uploads intended to be served publicly, it is often much cleaner and more straightforward to use Laravel's built-in `public` disk, which is already configured to map correctly to the `public` directory of your application.

## The Recommended Solution: Using the Default Public Disk

If your goal is simply to upload files that you want to be accessible via a web URL (e.g., `/img/my_file.jpg`), the best practice is to leverage Laravel’s default disk setup. This avoids manual path manipulation and ensures proper public access.

### Step 1: Simplify Configuration

You don't need to define a custom `uploads` disk if you are targeting the `public` directory. Ensure your configuration remains standard, focusing on accessibility rather than arbitrary root paths for every single upload location.

### Step 2: Streamline File Upload Logic

Instead of manually using `Input::file()` and then calling `put()`, use the fluent methods provided by the `Storage` facade. This method is designed to handle file movement and storage in a single, atomic operation.

In your controller, you can simplify the saving process significantly:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        // 1. Validate the incoming file
        $request->validate([
            'img' => 'required|image|max:2048'], // Ensure it is an image and has a size limit
        ]);

        // 2. Get the uploaded file instance (using the request object directly)
        $file = $request->file('img');

        if ($file) {
            // 3. Use the store() method to save the file directly.
            // 'public' disk maps directly to storage/app/public
            $path = $file->store('img', 'public'); // 'img' is the folder inside public, 'public' is the disk

            // $path will now be something like: 'img/my_uploaded_image.jpg'

            return response()->json(['message' => 'File uploaded successfully.', 'path' => $path]);
        }

        return response()->json(['error' => 'No file provided.'], 400);
    }
}
```

By using `$file->store('img', 'public')`, Laravel automatically handles the complexity of reading the file stream and saving it to the correct location within the configured disk. This approach aligns perfectly with the principles of clean, maintainable code advocated by teams working on frameworks like [Laravel](https://laravelcompany.com).

## Advanced Scenario: When Custom Disks are Necessary

If you genuinely need separate storage buckets (e.g., one for user uploads, one for media assets), defining custom disks is perfectly valid. If you must use a custom disk, ensure the `root` path points to where you *want* the files physically stored on your server, and understand that accessing these files via HTTP will require adding a route or using a symbolic link (Symlink) to expose that directory publicly—this is a layer of complexity often handled by dedicated file storage services for maximum scalability.

## Conclusion

The failure in your original setup was likely due to the mismatch between how you configured the disk root and how Laravel expects public assets to be accessed. For standard file uploads, sticking to the default `public` disk and utilizing the elegant `store()` method provides a far more robust, readable, and maintainable solution. Always aim for clarity when configuring your storage layers; this is key to building scalable applications on [Laravel](https://laravelcompany.com).
