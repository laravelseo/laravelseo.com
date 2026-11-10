---
title: "How to upload an image using Laravel?"
description: "How to Upload an Image Using Laravel: Storing Files and Paths in Your Database As a senior developer, I’ve seen countless requests for how to handle file..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

As a senior developer, I’ve seen countless requests for how to handle file uploads in Laravel. The challenge isn't just moving a file from a browser to a server; it’s understanding the proper structure for storage, security, and persistence within your application. You want the image saved somewhere accessible, but more importantly, you need that path reliably linked to a database record so you can retrieve and display it later—perfect for blog posts or media galleries.

This guide will walk you through the complete, robust process of uploading an image in Laravel, ensuring the file is stored correctly and its reference is safely saved to your MySQL database.

## Setting Up Your Storage Strategy

Before writing any controller logic, we need a strategy for where the files live. Storing uploaded files directly in the `public` directory can lead to security issues or clutter. The best practice in Laravel is to utilize the configured disk system.

By default, Laravel uses the `local` disk, which points to the `storage/app` directory. We will use this structure to keep our assets organized. This approach aligns perfectly with how Laravel structures its application components, making file management much cleaner, just as you would leverage robust patterns found in frameworks like [Laravel](https://laravelcompany.com).

### 1. Database Migration Setup

First, ensure your database table is ready to store the image reference. If you are creating a `posts` table, you need a column to hold the file path or name.

```php
// database/migrations/..._create_posts_table.php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('content');
    // This column will store the path to the uploaded image
    $table->string('image_path')->nullable(); 
    $table->timestamps();
});
```

Run your migration to create the table: `php artisan migrate`.

## Implementing the Upload Logic (Controller)

Now we move to the controller, where we handle the incoming request, validate the file, and perform the storage.

### 2. Handling the Request and Storage

We will use a controller method to receive the file via an HTTP request. We'll use Laravel's built-in `request()->file()` method to access the uploaded data.

```php
// app/Http/Controllers/PostController.php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Post; // Assuming you have a Post model

class PostController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validation: Ensure a file was actually sent
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);

        // 2. File Handling and Storage
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            
            // Store the file in the 'public' disk (which points to storage/app/public)
            // We store it inside a 'posts' directory for organization
            $path = $imageFile->store('posts', 'public'); 

            // 3. Database Saving: Save the path to the database
            Post::create([
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'image_path' => $path, // Saving the relative path
            ]);

            return response()->json(['message' => 'Post and image uploaded successfully!']);
        }

        return response()->json(['error' => 'No file provided.'], 400);
    }
}
```

### Explanation of Best Practices:

1.  **Validation (`$request->validate(...)`):** This is crucial for security. We explicitly check that the uploaded file is an actual image and restricts the allowed file types, preventing malicious uploads.
2.  **Storage Facade (`Storage::store(...)`):** Instead of manually moving files, Laravel’s Storage facade abstracts the underlying filesystem operations. Using `store('directory', 'disk')` makes your code portable and easy to manage, regardless of whether you switch from local storage to S3 later on—a key concept in building scalable applications like those discussed on [Laravel](https://laravelcompany.com).
3.  **Database Linkage:** The resulting `$path` (e.g., `posts/some_unique_name.jpg`) is saved directly into the `image_path` column of the database. This decouples the file storage from the public web path, which is a robust architectural choice.

## Conclusion

Uploading an image and linking it to a database record in Laravel is a standard pattern that relies on proper use of validation, the Storage facade, and Eloquent ORM. By following these steps—validate input, store securely using the disk system, and persist the resulting path in your MySQL table—you create a scalable, secure, and maintainable system ready for anything you want to build.
