---
title: "Laravel 8: File Upload with Original File Name and Extension"
description: "Laravel File Uploads: Retaining Original Filenames and Extensions in Your Database As developers building feature rich applications with Laravel, file..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

As developers building feature-rich applications with Laravel, file uploads are a common requirement. Often, when we handle user-uploaded content like images or documents, we need to store them securely on the server and link them back to our database records. A frequent pitfall is how we manage the filenames—whether we hash them for security or rename them entirely.

The problem you are facing is very common: you want to retain the original file name and extension in your database rather than replacing it with a generated hash or a UUID. This ensures better traceability and avoids potential issues when managing older files or debugging purposes.

This post will walk you through the correct, robust way to handle file uploads in Laravel 8, ensuring that you keep the original filenames while still adhering to best practices for storage and security.

## Understanding the Challenge

Your current implementation seems focused on replacing the original filename with a hashed version: `$lesson->lesson_image = $request->file->hashName();`. While hashing is excellent for preventing path traversal attacks or dealing with specific naming conventions, it loses the direct link to the user's original file.

If your goal is to preserve the original name, you need to capture that information *before* any renaming or storage operations take place and store it directly into your Eloquent model.

## The Solution: Capturing and Storing Metadata

The key to solving this lies in accessing the metadata provided by the incoming request object. When a file is uploaded via a form, Laravel makes the file data accessible through the `$request->file()` method. We can extract the original filename directly from this object before we use the `store()` method of the Storage facade.

We will modify your controller to capture the original name and save it alongside the file itself.

### Refactoring the Controller Logic

Here is how you can refactor your `FileUpload` method to achieve the desired outcome. We will focus on saving the filename directly into your database model instead of relying solely on a hashed value for the relationship field.

```php
namespace App\Http\Controllers;

use App\Models\LessonIMG;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // Import Storage facade

class LessonIMGController extends Controller
{
    public function FileUpload(Request $request, $id)
    {
        $rules = [  
            'file' => 'required|image|mimes:jpeg,png,jpg,gif', // Added validation for image files
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        
        // 1. Get the original filename from the uploaded file instance
        $originalFileName = $request->file('file')->getClientOriginalName();

        // 2. Store the file using the original name (or a sanitized version if necessary for public access)
        // We store it in a specific disk (e.g., 'public')
        $storedPath = $request->file('file')->store('public/uploads/', 'public');
        
        $lesson = LessonIMG::find($id);

        if (!$lesson) {
            return response()->json(['result' => 'Lesson not found'], 404);
        }

        // 3. Update the database record with the ORIGINAL filename
        $lesson->lesson_image = $originalFileName;

        $results = $lesson->save();
        if ($results) {
            return ['result' => 'Image Added'];
        } else {
            return ['result' => 'Image Not Added'];
        }

        return ['result' => $storedPath];
    }

    public function DeleteIMG($id)
    {
        $lesson = LessonIMG::find($id);
        if (is_null($lesson)) {
            return response()->json('Record not found!', 401);
        }

        // When deleting, you might store the path, but if you want to delete the file too:
        $filePath = $lesson->lesson_image;
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
        
        $lesson->update(['lesson_image' => null]);

        return response('Image Deleted', 200);
    }
}
```

## Best Practices for File Management in Laravel

When dealing with file uploads, simply retaining the name is not enough; you must also manage storage paths securely. Here are a few critical best practices:

1.  **Use the Storage Facade:** Always use `Illuminate\Support\Facades\Storage` to interact with your files. This abstracts away the specifics of your configured disk (local, S3, etc.), making your code portable. As you can see in this example, using `$request->file('file')->store(...)` is the Laravel way to handle storage.
2.  **Sanitize Filenames:** While retaining the original name is your goal, never trust user input completely. Always sanitize filenames before saving them to the database or making them accessible publicly to prevent security vulnerabilities like path traversal attacks. For public-facing files, generating a unique, UUID-based filename (e.g., `a1b2c3d4.jpg`) and storing the original name in a separate metadata field is often the safest approach.
3.  **Eloquent Relationships:** Ensure your Eloquent model (`LessonIMG`) has appropriate casting and relationships defined to easily retrieve and manage these file paths later on. This adherence to structured code is fundamental to building scalable applications, which is why leveraging Laravel's powerful features, as promoted by the [Laravel Company](https://laravelcompany.com), is so beneficial.

## Conclusion

By shifting your focus from hashing the filename to capturing and storing the original name directly within your Eloquent model, you achieve better data integrity and traceability. The refactored controller demonstrates how to extract this crucial metadata from the request, save the file using Laravel's Storage system, and link the original reference back to your database record. Remember, mastering these fundamentals of file handling is essential for building reliable and secure applications with Laravel.
