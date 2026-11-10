---
title: "Laravel : How to send image or file to API"
description: "Laravel: The Definitive Guide to Sending Images and Files to Your API Sending files, especially images, from a client application to a server via an API is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

Sending files, especially images, from a client application to a server via an API is one of the most common tasks in modern web development. While tools like Postman make testing simple, bridging the gap between the frontend (browser) and the backend (Laravel/Lumen) requires understanding how HTTP requests handle binary data.

If you are encountering issues where your request works perfectly in Postman but fails on the client side, it almost always boils down to the request format—specifically, ensuring you are sending the data as `multipart/form-data`. Let’s dive into the best practices for handling file uploads in a Laravel environment.

## Diagnosing the File Upload Problem

You mentioned that your API code seems functional when tested with Postman, yet it fails on the client side. This discrepancy is extremely common and usually points to a mismatch in how the data is packaged during transmission.

When you upload a file using a standard HTML form, the browser automatically sets the request header to `multipart/form-data`, which allows the server to parse both regular form fields and binary file content. If your client-side code is sending the file data incorrectly (e.g., as raw JSON or incorrect encoding), your Lumen endpoint will never see the file stream, leading to errors like `$request->hasFile('image')` returning false.

## Best Practice: Client-Side Implementation with JavaScript

To successfully send a file, you must use the `FormData` object in JavaScript along with an HTTP client like Axios or the native `fetch` API. This object correctly encodes the data for multipart uploads.

Here is how you structure the request on the client side:

```javascript
// Assume 'fileInput' is your actual <input type="file"> element
const fileInput = document.getElementById('imageUpload');
const file = fileInput.files[0]; // Get the selected file

if (file) {
    // 1. Create a FormData object
    const formData = new FormData();
    
    // 2. Append the file data under the key expected by your API ('image')
    formData.append('image', file); 

    // 3. Send the request using fetch or Axios
    fetch('/api/upload', {
        method: 'POST',
        // IMPORTANT: Do NOT manually set the Content-Type header when using FormData. 
        // The browser handles setting the correct boundary automatically.
        body: formData 
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error during upload:', error));
} else {
    console.error("No file selected.");
}
```

## Server-Side Validation and Storage (Lumen/Laravel)

Your server-side code for receiving the file looks generally correct for Lumen or Laravel. The key is ensuring that the request body is correctly parsed as multipart data, which framework handles automatically when you use methods like `request()->file()`.

Here is a slightly refined view of your controller logic:

```php
// In your Lumen/Laravel Controller method
if ($request->hasFile('image')) {
    $image = $request->file('image'); // This retrieves the uploaded file object

    // Security check: Ensure the file is valid before moving it
    if ($image->isValid()) {
        $fileName = $image->getClientOriginalName();
        // Use Storage facade for better organization, which aligns with Laravel best practices.
        $path = $image->storeAs('public/uploads/images/product/' . $fileName, $fileName, 'public');

        $attributes['image'] = $fileName;
        return response()->json(['message' => 'File uploaded successfully', 'path' => $path], 200);
    } else {
        return response()->json(['error' => 'Invalid file provided.'], 400);
    }
} else {
    return response()->json(['error' => 'No image file found in the request
