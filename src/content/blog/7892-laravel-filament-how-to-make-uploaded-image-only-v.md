---
title: "Laravel Filament - how to make uploaded image only visible inside the filament admin panel"
description: "Laravel Filament: How to Keep Uploaded Images Private within the Admin Panel When building applications with Laravel and Filament, managing file access and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

When building applications with Laravel and Filament, managing file access and privacy is a critical concern. Developers often face the challenge of uploading files through a standard form interface but ensuring those files remain inaccessible to the public internet, visible only to authenticated administrators within the admin panel.

The core question often arises: If I store my files on the `public` disk, they are accessible via a URL. If I store them on the `local` disk, why can’t I see them in Filament? The answer lies not just in where you store the file, but how you manage Laravel's storage layer and enforce access control within your application logic.

This post will dive into the correct, secure way to handle private file uploads for your Filament administration, ensuring that images are strictly confined to authenticated users.

## Understanding File Storage in Laravel

The distinction between disk types (`public`, `local`, `s3`, etc.) primarily dictates *where* the physical files reside on the server's filesystem and how web servers (like Nginx or Apache) are configured to serve them directly. It does not, by itself, enforce application-level security rules.

If you place a file in the `public` disk, it becomes accessible via the web root URL unless you implement specific middleware or access checks. Conversely, storing files on the `local` disk makes them inaccessible via direct HTTP requests, which is often desirable for private data.

The key to securing these uploads within a Filament context is to leverage Laravel's built-in storage mechanisms and ensure that file retrieval is always mediated through an authenticated application request, not a public URL.

## The Secure Approach: Using the Storage Facade

For private files intended solely for admin viewing, the recommended practice is to use the `Illuminate\Support\Facades\Storage` facade exclusively. This method allows you to interact with the files using defined disk configurations and automatically integrates access control when retrieving or manipulating the files within your application context.

### Step 1: Configure Your Disk

Ensure your storage configuration correctly maps private files away from public web access. For most internal admin assets, storing them on a configured `local` disk is the default secure choice.

In your `config/filesystems.php`, ensure that any disk you intend to keep private is not linked directly to the public web root if possible, or rely solely on Laravel's routing for access.

### Step 2: Handling Uploads in Filament

When handling file uploads within a Filament form (like a `FileUpload` field), the uploaded files are stored securely within your application's storage structure. You must ensure that when you retrieve these files later in the admin panel, you do not rely on direct public paths.

Here is a conceptual example of how you might handle saving and retrieving an image for display within a Filament resource:

```php
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class MyResource extends Resource
{
    // ... form setup ...

    public static function getRecord(Model $record): array
    {
        $imagePath = $record->image_path; // Assume you store the path/filename in the DB

        if ($imagePath) {
            // Securely retrieve the file content using the Storage facade
            $fileContents = Storage::disk('local')->get($imagePath);

            return [
                'image_url' => Storage::disk('public')->url($imagePath), // Only expose via public if necessary, but secured by Laravel logic
                'image_data' => $fileContents,
            ];
        }

        return [];
    }
}
```

Notice how we use `Storage::disk('local')->get(...)` to read the file contents. When Filament renders the view or a table, it operates within the context of the authenticated session. By using these facade methods, you bypass direct public URL access entirely, making the files inaccessible unless the user is logged into the application. This adherence to secure coding practices aligns perfectly with the principles advocated by the Laravel team, emphasizing robust architecture across the platform.

## Conclusion

The perceived difference between 'public' and 'local' disks in terms of Filament visibility is less about the disk type itself and more about **how you implement access control**. By relying on the `Storage` facade methods (`get()`, `put()`, etc.) within your authenticated application context, you ensure that uploaded images, regardless of their underlying filesystem location, are treated as private resources. This layered approach—using proper storage drivers combined with strict application-level authorization—is fundamental to building secure and scalable applications on Laravel. Always prioritize application logic over direct filesystem exposure when dealing with sensitive data.
