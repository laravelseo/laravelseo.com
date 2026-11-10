---
title: "How to show public images on Laravel 11 with Inertia and React"
description: "How to Show Public Images on Laravel 11 with Inertia and React: Solving the File Access Mystery Dealing with file uploads and serving static assets in a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

Dealing with file uploads and serving static assets in a modern full-stack framework like Laravel, Inertia, and React often introduces subtle hurdles. You've successfully stored your files in the expected location (`storage/app/public`), but when trying to display them in the frontend, you hit a wall. This is an extremely common issue rooted not in the code itself, but in how Laravel interacts with the underlying operating system and web server configuration.

As a senior developer, I can tell you that the problem you are facing—where files exist locally but are inaccessible via the browser or React—is almost always related to missing symbolic links or incorrect public disk configurations. Let's walk through the exact steps required to bridge this gap and get your beautiful product images displayed correctly.

## Understanding Laravel's Public Disk Mechanism

When you upload a file in Laravel, it lands in the `storage` directory. For these files to be accessible via a URL (e.g., `/storage/filename.jpg`), Laravel needs an explicit instruction telling the web server where to look for those files. This is achieved using symbolic links.

The core issue stems from not executing the necessary command to expose the `storage/public` directory to the public web root. Even if your `filesystems.php` configuration is correct, the physical link must be established on the server level.

### Step 1: Creating the Symbolic Link (The Essential Fix)

Before any frontend code can successfully reference these images, you must create a symbolic link from the storage directory to the public disk. This command tells the operating system that anything placed in `storage/app/public` should be accessible via the web server's public path.

Run this command in your terminal from your project root:

```bash
php artisan storage:link
```

This command creates a symbolic link, typically pointing `public/storage` to `storage/app/public`. Once this is executed, your web server (Apache or Nginx) knows exactly where to find the public assets when a request hits that URL. This is a fundamental step in leveraging Laravel's file system capabilities effectively, as discussed in guides related to robust asset management on platforms like [laravelcompany.com](https://laravelcompany.com).

## Step 2: Ensuring Correct Data Retrieval in Laravel

Once the link is established, your backend must provide the correct public path to the frontend. When you save an image, do not store the internal path (`storage/app/public/...`). Instead, store the publicly accessible path that the web server can resolve.

When saving files using the Laravel Filesystem, ensure you are utilizing the `public` disk:

```php
use Illuminate\Support\Facades\Storage;

// ... inside your controller method
$path = $request->file('image')->store('product_images', 'public'); // Stores in storage/app/public/product_images/filename.ext

// Retrieve the public URL for display
$imageUrl = Storage::disk('public')->url($path);
```

By using `Storage::disk('public')->url($path)`, you instruct Laravel to generate the correct, publicly accessible URL that the browser can request, which is exactly what your React component needs.

## Step 3: Updating the Inertia/React Frontend Logic

With the backend now correctly serving public URLs, we can fix the frontend logic in your React component. Forget trying to use `URL.createObjectURL()` for already uploaded files; that method is for handling local file inputs, not server-stored assets. You need to rely entirely on the URL provided by your Laravel backend.

Here is how you should structure your data flow:

```jsx
// Assuming 'images' array comes from Inertia props (e.g., from a controller response)

<div className="mt-4">
  {images.map((image, index) => (
    <div key={image.id || index} className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        {/* Use the URL provided by the backend */}
        <img
          src={image.url || '/images/default.png'} // Ensure this is a full, public URL
          alt={image.name || 'Image'}
          className="w-16 h-16 object-cover mr-4"
        />
      </div>
      <button
        type="button"
        className="text-red-500 hover:text-red-700 focus:outline-none"
        onClick={() => handleImageRemove(index)}
      >
        Delete
      </button>
    </div>
  ))}
</div>
```

By ensuring the symbolic link is in place and your backend provides a properly formatted public URL, your Inertia/React application will seamlessly display the images. Remember, mastering the interaction between the Laravel application layer and the operating system layer is key to building robust applications on platforms like [laravelcompany.com](https://laravelcompany.com).

## Conclusion

The mystery of inaccessible files in a Laravel setup is almost always a simple configuration or linking error at the filesystem level rather than a complex coding flaw. By correctly implementing `php artisan storage:link` and ensuring your Eloquent models store the public disk URLs, you establish a reliable pipeline for serving assets. Focus on this foundational step, and your Inertia/React application will be able to display those product images flawlessly.
