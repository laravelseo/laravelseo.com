---
title: "How to show image preview before uploading from controller in php laravel"
description: "How to Show Image Preview Before Uploading from Controller in PHP Laravel As a senior developer, I often encounter scenarios where developers aim for a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

As a senior developer, I often encounter scenarios where developers aim for a specific workflow—in this case, seeing a preview before submitting a file—and get stuck trying to force that logic entirely into the backend controller. While controllers are essential for handling file persistence and security, displaying dynamic previews is fundamentally a **client-side operation**.

This post will walk you through the correct architectural approach for achieving an image preview in your Laravel application, explaining why client-side JavaScript is necessary, and how to properly integrate it with your existing form submission process.

## Why Client-Side Preview is Necessary

You asked how to show a preview *before* uploading from the controller. It is important to understand that the controller only processes data sent to it; it doesn't typically interact directly with the user's local file system or browser state in real-time during form filling.

When a user selects a file via an `<input type="file">`, the browser handles reading that file locally. To display this content instantly (a preview), we must use JavaScript, specifically the `FileReader` API. This action happens entirely within the user's browser, making it fast and seamless for the user experience.

The controller’s role is to receive the final, processed data (the file itself) after the user confirms the upload.

## Step 1: Implementing the Client-Side Image Preview (JavaScript)

We will use JavaScript to listen for changes on the file input field. When a file is selected, we read its contents and display it in an `<img>` tag on the fly.

Based on your provided view structure, here is how you would implement this preview logic:

```html
<div class="row">
    <label for="image" class="col-sm-2 col-form-label">Category Image</label>
    <div class="col-sm-7">
        <!-- The file input -->
        <input id="cat_image" type="file" class="form-control" name="cat_image">
        
        <!-- The element where the preview will be shown -->
        <img src="" id="category-img-tag" width="200px" alt="Image Preview" style="max-width: 100%; height: auto; display: none;">
    </div>
</div>

<script>
document.getElementById('cat_image').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const imgTag = document.getElementById('category-img-tag');

    if (file) {
        // 1. Create a FileReader object
        const reader = new FileReader();

        // 2. Define what happens when the file is successfully read
        reader.onload = function(e) {
            // Set the src of the image tag to the file's Data URL
            imgTag.src = e.target.result;
            imgTag.style.display = 'block'; // Make the image visible
        };

        // 3. Read the file as a Data URL (Base64 string)
        reader.readAsDataURL(file);
    } else {
        // If no file is selected, hide the preview
        imgTag.src = '';
        imgTag.style.display = 'none';
    }
});
</script>
```

This script listens for a change on the file input. When a file is selected, it uses `FileReader` to asynchronously read the file content and convert it into a Base64 Data URL (`reader.readAsDataURL(file)`). This Data URL is then set as the `src` of your preview `<img>` tag, giving you an immediate visual feedback.

## Step 2: Refining the Controller for Secure Uploads

Once the user has confirmed the preview and is ready to submit, the browser packages the file data along with other form fields into a `multipart/form-data` request. The controller then receives this package.

Your existing controller logic is functional for moving the file, but we need to ensure we store meaningful information (the filename) rather than just the MIME type if you intend to display it later.

Here is an improved approach for your controller method:

```php
use Illuminate\Http\Request;
use App\Models\Category; // Assuming you have a Category model

public function upload(Request $request)
{
    // 1. Validate the request first (Crucial step!)
    $request->validate([
        'category' => 'required|string',
        'desc' => 'required|string',
        'cat_image' => 'required|file|image|max:2048', // Ensure it is an image and size limit
    ]);

    $cat = new Category;
    $cat->name = $request->input('category');
    $cat->description = $request->input('desc');

    // Handle the file upload securely
    if ($request->hasFile('cat_image')) {
        $categoryFile = $request->file('cat_image');
        
        // Use the storeAs method for easier handling in Laravel, 
        // or stick to move() if you prefer raw path management.
        $path = public_path('storage/category/');
        
        // Generate a unique filename to prevent overwrites and ensure safety
        $fileName = time() . '_' . $categoryFile->getClientOriginalName();
        
        // Move the file
        $categoryFile->move($path, $fileName);

        // Store the path/filename on the model
        $cat->cat_image_path = $fileName; 
    }   

    $cat->save();

    toastr()->success($cat->name . ' added successfully!');

    return redirect('/category');
}
```

## Conclusion: Separation of Concerns

To summarize, achieving a real-time image preview requires separating concerns clearly:

1.  **Client-Side (JavaScript):** Handles the immediate display and user experience (previewing the file before submission). This is where the `FileReader` API shines.
2.  **Server-Side (Laravel Controller):** Handles secure processing, validation, file storage to the disk or cloud, and database persistence.

By implementing the preview via JavaScript, you provide excellent immediate feedback to your user, while the controller remains responsible for robust, secure data handling—a fundamental principle in building scalable applications with Laravel. For more complex file management features, exploring packages available on the official Laravel documentation can further enhance your capabilities.
