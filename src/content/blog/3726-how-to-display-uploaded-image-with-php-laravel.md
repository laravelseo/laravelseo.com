---
title: "How to display uploaded image with php laravel"
description: "How to Display Uploaded Images with PHP Laravel: Mastering File Handling and Naming Conventions Uploading files is one of the most common tasks in web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Uploading files is one of the most common tasks in web development, but handling the resulting file names and storage locations can quickly become a source of bugs. As a senior developer working with frameworks like Laravel, understanding how to correctly manage file uploads—from the client request to the database—is crucial for building scalable and maintainable applications.

This post will walk you through the common pitfalls in file uploading and provide a robust, best-practice method for saving, naming, and displaying uploaded images within a Laravel environment.

## The Pitfall of Relying on Temporary Filenames

The snippets provided illustrate a very common mistake: relying solely on the filename provided by the user or the system's temporary location during the upload process.

When you use methods like `$img->move('public/img', $name)`, if `$name` is derived directly from `getClientOriginalName()`, you are saving files with names that are often cryptic, contain system artifacts (like `.tmp`), or are easily duplicated across different uploads. As you correctly observed, this method does not reliably save the *original* user-intended name in a persistent, traceable way for your database records.

In a production environment, relying on these temporary names leads to two major problems:
1. **Collision Risk:** Two users uploading a file named `photo.jpg` will overwrite each other or cause conflicts.
2. **Poor Traceability:** If you need to reference the original uploaded file later (e.g., for deletion or displaying metadata), the temporary name is insufficient.

## The Robust Solution: Generating Unique and Safe Filenames

The professional approach in Laravel is to *never* trust the client-provided filename directly for storage. Instead, we generate a unique identifier on the server side and use that identifier as the official file name. This ensures uniqueness and control over the file structure.

### Step 1: Handling the Upload in the Controller

Instead of moving the file using the original name, we should generate a secure, unique filename. Laravel provides excellent tools for this, often leveraging UUIDs or hashing functions to ensure uniqueness.

Here is how you would refine your upload logic within your Laravel controller:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function uploadImage(Request $request)
    {
        // 1. Validate the request first
        $request->validate([
            'Picture' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);

        // 2. Get the uploaded file instance
        $file = $request->file('Picture');

        // 3. Generate a secure, unique filename
        // We use the original extension but prepend a UUID for uniqueness.
        $extension = $file->getClientOriginalExtension();
        $uniqueName = time() . '_' . uniqid() . '.' . $extension;

        // 4. Store the file using Laravel's Storage facade (Best Practice)
        // This moves the file to the 'public/images' directory by default in Laravel setup.
        $path = $file->storeAs('images', $uniqueName, 'public');

        // 5. Save the unique name to your database
        // Example: Photo::create(['filename' => $uniqueName, 'path' => $path]);

        return response()->json(['message' => 'Image uploaded successfully', 'path' => $path]);
    }
}
```

Notice how we use `storeAs()`. This method handles the file movement and naming internally, placing the file in the configured disk (in this case, the `public` disk). This is much safer than manually managing the temporary move operation.

## Step 2: Displaying the Image in Blade

Once the image is stored on the filesystem (which Laravel manages beautifully), displaying it in your view becomes straightforward by referencing the stored path.

If you stored the file in the `public/images` directory, you can reference it directly in your blade file as follows:

```html
{{-- Assuming $imagePath holds the path saved from the database or controller --}}
<img src="{{ asset('images/' . $imagePath) }}" alt="Uploaded Image" style="max-width: 300px;">
```

This method ensures that when a user views the page, they are pulling the file directly from the public storage path, which is efficient and secure. For more complex scenarios involving file manipulation or serving assets, leveraging Laravel's **Storage** facade (as shown above) provides a powerful abstraction layer.

## Conclusion

Displaying uploaded images successfully in a Laravel application hinges on shifting your focus from manipulating temporary client-side filenames to using server-side, unique identifiers for storage and database linkage. By utilizing the built-in file handling methods provided by Laravel, such as `storeAs()`, you ensure that your image assets are stored reliably, uniquely, and are correctly linked across your application, providing a solid foundation for any project you build with **[laravelcompany.com](https://laravelcompany.com)**.
