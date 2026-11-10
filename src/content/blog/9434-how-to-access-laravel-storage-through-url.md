---
title: "How to access Laravel storage through URL?"
description: "How to Access Laravel Storage Through URL: Solving the 404 Mystery As a developer working with the Laravel framework, managing file storage is a fundamental..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a developer working with the Laravel framework, managing file storage is a fundamental task. You correctly use methods like `Storage::disk('public')->put(...)` to save files, but when you try to access those files via a standard web URL and receive a 404 error, it signals a common misunderstanding about how Laravel structures its public assets versus its internal storage system.

This guide will walk you through the exact steps required to correctly link your application's file storage to the public web directory, ensuring that your files are accessible via a clean, predictable URL structure.

## The Root of the Problem: Storage vs. Public

When you use `Storage::disk('public')`, Laravel stores the actual files within the `storage/app/public` directory (or whatever disk configuration you set up). However, this internal storage directory is **not** directly accessible via the web server (like Apache or Nginx) for security reasons. The web root (`public/`) is what the public can see.

The issue arises because simply placing files in `storage/app/public` does not automatically create the necessary symbolic link that maps this internal storage path to the publicly accessible `/storage` URL.

## The Solution: Creating the Symbolic Link

To bridge this gap, you must explicitly tell the operating system to create a symbolic link (symlink) from your public directory into the storage directory. This is the crucial step that allows the web server to recognize the contents of `storage/app/public` as accessible via the `/storage` URL prefix.

Follow these steps precisely:

### Step 1: Ensure Public Disk Configuration

First, ensure your configuration points to the correct disk. In a fresh Laravel installation, this is usually set up by default, but it’s good practice to verify your `config/filesystems.php`:

```php
// config/filesystems.php

'disks' => [
    // ... other disks
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'), // This is the internal path
        'url' => env('APP_URL').'/storage',  // Defines the public URL prefix
    ],
],
```

### Step 2: Execute the Storage Link Command

Next, execute the Artisan command that creates the necessary symbolic link. This command links the contents of your storage directory into the public folder:

```bash
php artisan storage:link
```

This single command creates the necessary link, directing traffic from `public/storage` to `storage/app/public`. Once this command is run, any file you put into `storage/app/public` can be accessed via the URL structure Laravel expects.

## Accessing Files Through the Correct URL

After executing the link command, your file access will follow the convention defined in your filesystem configuration. If you followed the standard setup outlined above, links to your files will look like this:

```
http://your-domain.com/storage/your_file_name.pdf
```

Notice that the base path is `/storage`, not `/public/storage` or just `/storage`. This structure adheres to Laravel's convention and ensures better security separation between application code and public assets, which aligns with best practices recommended by the official documentation at [laravelcompany.com](https://laravelcompany.com).

### Example Workflow

Let’s put this into practice with a concrete example:

1.  **Saving the File (Controller/Service):**
    ```php
    use Illuminate\Support\Facades\Storage;

    class FileController extends Controller
    {
        public function uploadFile(Request $request)
        {
            $file = $request->file('document');
            // Stores the file in storage/app/public/documents/my_report.pdf
            $path = Storage::disk('public')->put('documents', $file);

            return response()->json(['message' => 'File uploaded successfully. Path: ' . $path]);
        }
    }
    ```

2.  **Accessing the File (Web Browser):**
    After running `php artisan storage:link`, you can now access it directly:
    ```
    http://localhost/storage/documents/my_report.pdf
    ```

## Conclusion

The 404 error when accessing Laravel storage is almost always a configuration issue related to the symbolic link setup, not an issue with the file itself. By understanding that `php artisan storage:link` establishes the necessary pathway between your application's internal storage and the public web root, you can reliably serve files using the elegant, secure URL structure provided by Laravel. Always prioritize these foundational steps when dealing with file management in a modern framework like Laravel.
