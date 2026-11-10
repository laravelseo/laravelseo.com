---
title: "How i get width and height of a image in Laravel Framework?"
description: "Title: Getting the Width and Height of an Image Before Uploading in Laravel Framework Introduction: In today's digital world, images play a vital role in web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

Title: Getting the Width and Height of an Image Before Uploading in Laravel Framework

Introduction:
In today's digital world, images play a vital role in web applications. While Laravel provides various ways to handle images, getting the width and height of an image before uploading can be crucial for many reasons like optimizing storage or displaying thumbnails. This blog post will guide you through the process of retrieving these dimensions with code examples and best practices.

Step 1: Use JavaScript on the Client Side
For front-end applications, you can use HTML, CSS, and JavaScript to get the width and height of an image without needing Laravel's backend functionality. Here's a simple example:

```html
<p>Select an Image:</p>
<input type="file" id="imageInput" name="image" onchange="previewImage(event)">
<div class="preview">
    <img src="" alt="Previewed Image" width="500" height="375">
</div>
```

```javascript
function previewImage(e) {
  const reader = new FileReader();
  const imageFile = e.target.files[0];
  reader.onload = function (event) {
    const img = document.querySelector("img");
    img.src = event.target.result;
    img.width = imageFile.width;
    img.height = imageFile.height;
  };
  reader.readAsDataURL(imageFile);
}
```

However, this approach is limited to front-end apps and doesn't guarantee the correct dimensions for all images.

Step 2: Use Laravel's File Storage System
Laravel provides a convenient way to handle files using its file storage system. You can upload an image and get the necessary information about it at the same time. Here's a simple example:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class UploadController extends Controller {
    public function store(Request $request) {
        // Get the uploaded image
        $image = $request->file('image');

        // Store the image in Laravel's storage system and get the URL
        $path = Storage::disk('public')->putFile('uploads/' . $request->input('filename'), $image);
        $url = Storage::url($path);

        // Get the dimensions from the stored image
        list($width, $height) = getimagesize($path);

        // Return the response with the URL and dimensions
        return $this->respondWithImageDetails($url, $width, $height);
    }

    private function respondWithImageDetails($url, $width, $height) {
        return response()->json([
            'imageUrl' => $url,
            'width' => $width,
            'height' => $height
        ]);
    }
}
```

In this example, you are uploading the image file and storing it in Laravel's storage system. Afterwards, you can get the filename, path, URL, width, and height of the image from the stored location using the getimagesize function. You can then return these details as a JSON response for further processing or display.

Conclusion:
With these techniques, you now know how to get the dimensions of an image before uploading on the Laravel framework. By combining JavaScript-based client-side solutions and Laravel's file storage system, you have ensured a versatile approach that works well for both frontend and backend applications. Happy coding!
