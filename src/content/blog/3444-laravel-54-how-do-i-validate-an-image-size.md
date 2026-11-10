---
title: "Laravel 5.4: How do I validate an image size?"
description: "Laravel 5.4: How do I Validate an Image Size Before Storing it? When dealing with file uploads in a web application, especially when storing media on..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

When dealing with file uploads in a web application, especially when storing media on services like Amazon S3, security and data integrity become paramount. You are right to prioritize validating image dimensions before saving them—it prevents abuse, saves storage space, and ensures your assets meet design specifications.

However, as many developers encounter, the standard Laravel validation mechanism often fails when dealing with raw file uploads. Let's dive into why this happens and outline the correct, robust way to validate image dimensions in a Laravel application, even when you are not saving the file immediately.

## The Pitfall of Basic Request Validation

You have correctly identified the issue: attempting to validate file dimensions solely through standard request validation rules, like `dimensions:max_width:300`, fails.

This failure occurs because the standard input validation system checks the data sent in the HTTP request body (form fields). When a user uploads an image via a `<input type="file">`, the actual image binary data is handled separately from the basic form fields. The request data does not inherently contain the pixel dimensions of the uploaded file; it only contains the file handle or path provided by the browser. Therefore, Laravel’s validator has nothing to check against for the file's actual size.

## The Correct Approach: Post-Upload Image Manipulation

To validate the actual physical dimensions of an uploaded image, you must perform checks *after* the file has been successfully received but *before* it is persisted to storage. This requires reading the temporary uploaded file and using PHP’s built-in image manipulation libraries (like GD or Imagick) to inspect its metadata.

This process involves three critical steps: receiving the file, validating the input fields, and then inspecting the file itself.

### Step 1: Receiving and Validating Input Fields

First, ensure your basic form data (if any) is validated as you intended. This handles non-file related constraints.

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate form fields (if any)
        $validator = Validator::make($request->all(), [
            'logo_name' => 'required|string', // Example of validating a text field
            // Note: We remove the dimension check here, as it won't work on file data directly.
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withInput()->withErrors($validator);
        }

        // Proceed to file validation...
    }
}
```

### Step 2: Validating the Actual Image Dimensions

Now, we focus on the uploaded file. We must check if the file exists and then use GD functions (or Imagick) to get its dimensions. This is a crucial step for ensuring file integrity before moving data to S3.

Here is how you integrate dimension checking:

```php
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $file = $request->file('logo');

        if (!$file) {
            return redirect()->back()->withErrors('No file uploaded.');
        }

        // 2. Check the actual dimensions of the uploaded file using GD
        $image = imagecreatefromresource($file->getRealPath());

        if ($image === false) {
             return redirect()->back()->withErrors('Could not read image file.');
        }

        $width = imagesx($image);
        $height = imagesy($image);
        imagedestroy($image); // Important: Free up memory immediately

        // 3. Apply the size validation logic
        $max_width = 300;
        $max_height = 200;

        if ($width > $max_width || $height > $max_height) {
            // Validation failed: Image is too large
            return redirect()->back()->withInput()->withErrors([
                'logo' => 'The uploaded image dimensions are too large. Max allowed: ' . $max_width . 'x' . $max_height,
            ]);
        }

        // If validation passes, proceed to save the file to S3...
        // ... (S3 logic here)

        return redirect()->route('dashboard')->with('success', 'Image uploaded successfully!');
    }
}
```

## Best Practices for File Handling in Laravel

When handling large files or complex media uploads within a Laravel application, it is vital to remember that file operations are often outside the scope of standard Eloquent/Request validation. For advanced file processing and asset management, leveraging dedicated packages can streamline this work. For instance, when managing assets stored on cloud services like Amazon S3, understanding how your application interacts with external storage layers is key—a concept deeply rooted in modern Laravel architecture like that promoted by the team at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Validating file dimensions requires moving beyond simple request validation. By implementing post-upload processing using PHP's image libraries, you gain the necessary control to inspect the actual data before committing it to your storage system (like S3). This ensures that your application is secure, efficient, and compliant with your design rules, providing a much more robust solution than relying on input field checks alone.
