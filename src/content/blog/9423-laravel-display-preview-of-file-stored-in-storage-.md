---
title: "Laravel - Display preview of file stored in Storage directory"
description: "Laravel: Securely Displaying Private Files Stored in Storage As developers working with Laravel, one of the most common challenges we face is managing file..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As developers working with Laravel, one of the most common challenges we face is managing file storage securely. You’ve successfully implemented a system where files are uploaded, saved to a specific directory within the `storage` disk, and linked in your database. The next logical step is displaying a preview of these files to the authenticated user.

The core issue you are facing—how to display a private file preview—is not just a matter of pointing a URL; it’s fundamentally about **security, authorization, and proper resource handling**. Simply making the `storage` directory accessible via a web route is insufficient and dangerous. We need a robust mechanism that verifies user permissions before streaming the file content.

This post will walk you through the best architectural patterns in Laravel to securely serve files stored on the disk, ensuring that only authorized users can view them.

---

## The Security Challenge: Why Direct Access Fails

You are correctly storing your files using the `Storage` facade:

```php
$path = $request->file('file')->storeAs($user->ref_id, $filename);
// Path saved to DB: /storage/user-123/my_image.jpg
```

If you try to access this path directly in your view (e.g., using `asset('storage/' . $path)`), the web server will attempt to serve that file. Unless you have meticulously configured public access permissions (which defeats the purpose of private storage), this often results in a 404 error or, worse, an accidental exposure if directory permissions are misconfigured.

The solution is to treat file delivery as a controlled operation handled by your application logic, not as a direct filesystem link.

## The Solution: Implementing a Controlled File Serving Endpoint

The most secure and Laravel-idiomatic way to handle this is by creating a dedicated route that points to a Controller method responsible for reading the file contents and sending them back to the browser with the correct HTTP headers. This gives you complete control over access and authorization.

### Step 1: Define the Route

First, define a route that will handle the request for viewing a specific file.

```php
// routes/web.php

use App\Http\Controllers\FileController;

Route::get('/files/{filePath}', [FileController::class, 'show'])->middleware('auth')->name('file.show');
```

### Step 2: Create the Controller Logic

In your controller, you will retrieve the file path from the request, verify that the logged-in user is authorized to see it (this is crucial!), and then use the `Storage` facade to read the file content into the response stream.

Here is an example of how the `show` method might look:

```php
// app/Http/Controllers/FileController.php

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileController extends Controller
{
    public function show($filePath)
    {
        $user = Auth::user();

        // 1. Authorization Check: Ensure the file belongs to the user or is accessible
        // In a real application, you would enforce a Policy check here.
        if (!$user || !Storage::disk('local')->exists($filePath)) {
            abort(404, 'File not found.');
        }

        // 2. Security Check: Verify the user has permission for this specific file path
        // Example authorization logic:
        if (strpos($filePath, $user->ref_id) === false) {
             abort(403, 'Unauthorized access to this file.');
        }


        // 3. File Delivery: Read the file and stream it back
        $fileContents = Storage::disk('local')->get($filePath);
        $mimeType = Storage::disk('local')->mimeType($filePath);

        return response($fileContents, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"',
        ]);
    }
}
```

### Step 3: Displaying the Preview in the View

In your Blade view, you now link to this secure route, passing the path stored in your database.

```blade
<!-- Example showing a file preview -->
<img src="{{ route('file.show', ['filePath' => $file->file_name]) }}" alt="File Preview">
```

## Best Practices and Laravel Architecture

When dealing with private resources, always adhere to the principle of **least privilege**. Never trust input from the user or the request directly when accessing files.

1.  **Use Policies for Authorization:** Instead of embedding complex authorization logic inside your controller methods, leverage Laravel Policies. This keeps your controllers clean and separates business rules (like "User A can only see files in their own folder") from the presentation layer.
2.  **Disk Management:** For large applications, consider using different disk configurations (e.g., S3 or local storage) based on file sensitivity. Utilizing Laravel's powerful `Storage` facade ensures that regardless of where the file physically resides, your application logic remains consistent. This focus on structured data and controlled access is a hallmark of good architecture, much like the principles demonstrated by the community around **https://laravelcompany.com**.

## Conclusion

Displaying private file previews in Laravel requires moving beyond simple URL linking. By implementing a dedicated controller endpoint secured with proper authorization checks and utilizing the `Storage` facade correctly for reading content, you establish a robust, secure, and scalable system. This approach ensures that your application remains secure while providing a seamless user experience for displaying their private assets.
