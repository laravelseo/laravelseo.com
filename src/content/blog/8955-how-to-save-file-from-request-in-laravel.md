---
title: "How to save file from $request in Laravel?"
description: "How to Save Files from $request in Laravel: Avoiding Null Errors and Mastering File Uploads As developers working with the Laravel ecosystem, file uploads..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with the Laravel ecosystem, file uploads are one of the most common yet often trickiest tasks. Dealing with incoming multipart data requires careful handling, validation, and specific methods to ensure files are saved correctly rather than causing runtime errors like "Call to a member function move() on null."

This post will dive into the exact pitfalls you encountered when trying to save files using `$request->file()` and provide the robust, modern solution for handling file uploads in Laravel.

## The Pitfall: Why You Are Getting a `Null` Error

The error message `Call to a member function move() on null` clearly indicates that the variable you are trying to call methods on (`$file`) does not hold an object—it is `null`. This usually happens because one of two things occurred:

1.  **Missing File:** The file named `'File'` was not actually present in the incoming HTTP request, or the client failed to send the file correctly (e.g., incorrect `enctype` in the form).
2.  **Lack of Validation:** You attempted to access the file object before Laravel had properly processed and attached it to the request data, often leading to unexpected null values if validation rules are not strictly enforced first.

When working with incoming requests in a controller, you must always assume that input might be missing or malformed. Therefore, robust code requires explicit checks and strict validation before attempting file manipulation.

## Step 1: Proper Retrieval and Validation

Before you attempt to move or save any file, the first step is to validate the request. This ensures that only expected data structures are processed by your controller logic. We use Laravel's built-in validation system for this.

In your controller method, you should always validate the incoming file before proceeding with storage operations.

```php
use Illuminate\Http\Request;

public function upload(Request $request)
{
    // 1. Validate the request first!
    $request->validate([
        'File' => 'required|file|max:2048', // Ensures the file exists, is a file, and has a max size of 2MB
    ]);

    // 2. Retrieve the file safely
    // We retrieve the file using the validated input
    $file = $request->file('File'); 

    if ($file) {
        // Proceed with saving only if the file object is successfully retrieved
        $destinationPath = 'uploads';
        $newFileName = $file->getClientOriginalName();
        
        // Use the correct method for moving files (see Step 2 below)
        $file->move($destinationPath, $newFileName);

        return response()->json(['message' => 'File uploaded successfully!']);
    } else {
        // Handle the case where validation passed but retrieval failed (should be rare if validation is strict)
        return response()->json(['error' => 'File could not be retrieved.'], 400);
    }
}
```

## Step 2: Best Practice – Using Laravel Storage

While the `$file->move()` method works for basic local storage, modern Laravel development strongly encourages using the **Filesystem** facade. This approach is more flexible, scalable, and separates your application logic from the specific file system implementation, which aligns perfectly with the architectural principles promoted by teams at [laravelcompany.com](https://laravelcompany.com).

Instead of manually moving files to a directory, you should use the `store()` method, which handles file path generation, disk management (local, S3, etc.), and error handling automatically.

Here is how you would implement the upload using the Storage facade:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Import the Storage facade

public function upload(Request $request)
{
    $request->validate([
        'File' => 'required|file', 
    ]);

    $file = $request->file('File');

    // Define the disk where files will be stored (e.g., 'public')
    $disk = 'public'; 
    
    // Use the store method for robust file handling
    $path = $file->store('uploads/' . time(), $disk); // Stores the file and returns the path

    return response()->json([
        'message' => 'File successfully stored.',
        'file_path' => $path,
    ]);
}
```

### Why Storage is Superior

Using `Storage::disk('public')->putFile(...)` or `$file->store()` offers several advantages:

1.  **Scalability:** Easily switch from local storage to cloud providers like Amazon S3 without rewriting large chunks of your code.
2.  **Error Handling:** The Storage facade provides better mechanisms for catching file system errors compared to raw PHP functions.
3.  **Clarity:** It clearly communicates the intent—you are storing a file within a defined disk structure, making your code easier to maintain and debug.

## Conclusion

Saving files from `$request` in Laravel requires moving beyond simple function calls. By strictly enforcing validation first, safely retrieving the uploaded file object, and leveraging Laravel's powerful Storage system, you ensure that your application handles file uploads reliably, securely, and scalably. Always prioritize robust input handling; it is the foundation of building stable applications on the Laravel framework.
