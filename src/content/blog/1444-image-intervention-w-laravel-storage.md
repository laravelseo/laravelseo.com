---
title: "Image Intervention w/ Laravel Storage"
description: "Title: Effortlessly Resize Images with Intervention & Laravel Storage Introduction Incorporating images into your web applications can significantly enhance..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Effortlessly Resize Images with Intervention & Laravel Storage

Introduction
Incorporating images into your web applications can significantly enhance their aesthetics and user experience. While the storage facade in Laravel provides a convenient way to store avatars, you may desire to resize them too. Here, we will discuss a practical approach using Intervention Image Manipulation and Laravel Storage.

Prerequisites
This tutorial assumes you have:
- A basic understanding of the Laravel framework.
- A working Laravel application with storage configuration already set up.
- The latest version of Intervention installed via Composer, which provides image manipulation support.

Step 1: Register Intervention Service Provider
To use Intervention with your Laravel app, add the following line to your `config/app.php` file's 'providers' array under "App\Provider" key:

   'Intervention\Image\ImageServiceProvider::class',

This will register Intervention's service provider and make available its related classes for use within your application.

Step 2: Resize Image with Intervention Image Manipulation
To resize an image, you can follow these steps:

  1. Get the uploaded file from the request:
     <pre><code>$path = $request-&gt;file('createcommunityavatar');</code></pre>
    This line gets the path to the uploaded file in the controller, assuming the form field is named "createcommunityavatar".

  2. Create an Image instance from the uploaded file:
     <pre><code>$resize = Image::make($path);</code></pre>
    This line creates a new Image object, representing the image data of the uploaded file.

  3. Resize the image to the desired dimensions using fit() method:
     <pre><code>$resize = $resize->fit(300);</code></pre>
    The 'fit' function will resize the image while maintaining its aspect ratio, ensuring that it doesn't get distorted. In this case, we set the width to 300px. Other available methods like crop or zoom can also be used for custom sizing.

  4. Store the resized image using Laravel Storage:
     <pre><code>$store = Storage::putFile('public/image', $resize);</code></pre>
    This line saves the resized image with the same name as the original file into your storage directory under 'public/image'. The returned 'store' variable holds the path to the newly stored file within the storage directory.

  5. Generate URL for the resized image:
     <pre><code>$url = Storage::url($store);</code></pre>
    This line generates a URL that you can use to access the image from your application or elsewhere.

Step 3: Testing and Error Handling
To test this code, simply insert these lines into your controller's method after handling the image upload logic. To handle possible errors associated with image manipulation or storage operations, add appropriate try-catch blocks around the code snippets above to ensure proper error handling.

Conclusion
With this comprehensive approach, you can successfully resize images in Laravel applications using Intervention and Laravel Storage. By utilizing these tools, you can easily manage and optimize your application's image assets while ensuring an engaging user experience. For more information on Image Manipulation with Intervention and Laravel Storage, visit https://laravelcompany.com/blog/how-to-process-images-in-laravel-using-intervention-and-storage-facade/.
