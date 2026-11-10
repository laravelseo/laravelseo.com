---
title: "How to upload files with inertia js and laravel 8.0"
description: "Mastering File Uploads in Inertia and Laravel: Solving the Multipart Mystery File uploads are one of the most common, yet often trickiest, features when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "PHP"]
featured: false
---

File uploads are one of the most common, yet often trickiest, features when building modern web applications. When integrating a frontend framework like Inertia.js with a backend like Laravel, handling binary data (files) requires precise understanding of HTTP request encoding. The issue you are facing—where file data seems to disappear or get misinterpreted during an update operation—is a classic symptom of a mismatch between how the client sends the data and how the server expects to receive it.

As senior developers, we know that simply setting a `Content-Type` header isn't enough; the structure of the payload must be correct. This post will dissect why your file uploads fail during an Inertia patch request and provide the robust solution for handling multi-file updates in Laravel.

## The Anatomy of the Problem: Multipart Data Misinterpretation

You are attempting to upload a single featured image and an array of gallery images, which necessitates using `multipart/form-data`. When you use standard form submissions or even Inertia's form methods, this data must be packaged correctly.

The error messages ("featured\_image must be an image") and the resulting empty arrays strongly suggest that while the request is technically being sent as `multipart/form-data`, Laravel is failing to parse the file streams into usable PHP objects. This usually happens when the frontend fails to construct the `FormData` object correctly, or when the server-side controller logic isn't specifically designed to ingest these complex structures.

The specific code snippet you provided shows:
```javascript
updatePhotoPreview(event) {
   this.featuredImagePreview = URL.createObjectURL(event.target.files[0])
   this.updateProductForm.featured_image = event.target.files[0] // Sending the File object directly?
},
```
Sending a raw `File` object directly into a form submission context often fails because the browser needs it wrapped within a specific container to properly encode it for HTTP transport.

## The Solution: Mastering FormData in Inertia Submissions

The universally accepted best practice for sending files via HTML forms or modern API requests is to use the native JavaScript `FormData` object. This object correctly encodes the data, including binary file content, into the necessary multipart format that Laravel expects.

Here is how you should restructure your frontend logic within your Inertia component to ensure successful file uploads:

### 1. Correct Frontend Implementation (Vue/JavaScript)

Instead of trying to map raw file objects directly into a form structure, gather all files and text fields into a single `FormData` instance before submitting the request.

```javascript
// In your Inertia component method that handles the update
async handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();

    // 1. Append regular text/field data
    formData.append('product_name', this.productForm.name);
    
    // 2. Handle the single featured image
    if (this.featuredFile) {
        formData.append('featured_image', this.featuredFile);
    }

    // 3. Handle the gallery array (Crucial step for multiple files)
    if (this.galleryFiles && this.galleryFiles.length > 0) {
        this.galleryFiles.forEach((file, index) => {
            formData.append(`gallery_images[${index}]`, file); // Use indexed keys for arrays
        });
    }

    try {
        // Submit the FormData object directly to your Inertia route
        await this.$router.patch(this.route('products.update', this.productId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // While often automatic, explicitly setting it helps clarity.
            }
        });
    } catch (error) {
        console.error("File upload failed:", error);
    }
}
```

### 2. Backend Handling in Laravel

On the Laravel side, ensure your controller method is set up to handle these complex inputs correctly. When using Eloquent relationships for file uploads, Laravel makes this very straightforward. If you are updating a model that has an `image` relationship (for the featured image) and a `galleryImages` relationship (for the array), you can use mass assignment and the request object's file handling methods.

For example, in your controller:

```php
use Illuminate\Http\Request;
use App\Models\Product;

public function update(Request $request, Product $product)
{
    // Validate the input first! This is essential for robustness.
    $request->validate([
        'featured_image' => 'required|image', // Ensures it's actually an image file
        'gallery_images.*' => 'required|image', // Validates every item in the array
    ]);

    // Update the main product data
    $product->update($request->only('name', 'description'));

    // Handle Featured Image Upload
    if ($request->hasFile('featured_image')) {
        $path = $request->file('featured_image')->store('products', 'public');
        $product->featured_image_path = $path;
    }

    // Handle Gallery Images Upload (Handling the array)
    $galleryPaths = [];
    if ($request->hasFile('gallery_images')) {
        foreach ($request->file('gallery_images') as $file) {
            $path = $file->store('products/gallery', 'public');
            $galleryPaths[] = $path;
        }
        $product->gallery_image_paths = $galleryPaths;
    }

    $product->save();

    return back()->with('success', 'Product updated successfully!');
}
```

## Conclusion

The discrepancy you observed is almost always rooted in the packaging of the data on the frontend. By consistently using the `FormData` object to bundle all files and fields before submission, you ensure that the entire request payload adheres precisely to the `multipart/form-data` specification that Laravel requires. Always prioritize validation on the backend, as demonstrated above, to catch any malformed or missing file inputs early in the process. For more advanced guidance on data handling within your application, explore the comprehensive documentation provided by [Laravel Company](https://laravelcompany.com).
