---
title: "How to access image from /storage -laravel- from SPA with vuejs"
description: "How to Access Images from /storage in an SPA with Vue.js: Bridging the Backend and Frontend Gap As a senior developer working with modern full stack..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

As a senior developer working with modern full-stack frameworks like Laravel and Vue.js, one of the most common stumbling blocks is bridging the gap between server-side file storage and client-side rendering in a Single Page Application (SPA). Specifically, when dealing with assets stored in Laravel's `storage` directory, developers often run into issues where the file exists on the server but cannot be loaded by the frontend.

This post will walk you through the correct, robust methods to serve images from your Laravel storage into your Vue components, ensuring that your SPA operates seamlessly and securely.

***

## The Problem: File System Paths vs. Web URLs in SPAs

Let's address the scenario you encountered. You have placed an image at `storage/app/public/img/logo.png` and executed the linking command:

```bash
php artisan storage:link
```

You then attempt to reference it directly in your Vue component like this:

```html
<img src="storage/app/public/img/logo.png">
```

While the file system link works on the server, this approach fails in an SPA context for several reasons:

1.  **Public Access:** The path you are using (`storage/app/public/...`) is a **local file system path**, not a publicly accessible **web URL**. Browsers cannot access files directly from your local application structure unless they are explicitly mapped to the web root (which is what `storage:link` does, but the resulting URL must still be correctly formatted).
2.  **SPA Routing:** SPAs rely on client-side routing (like Vue Router) for navigation. When requesting an image, the request is handled by the browser, which expects a standard HTTP path starting from your domain root (`http://yourdomain.com/`).

Simply pointing to the file system structure will result in a 404 error because the browser is looking for a resource relative to the application base, not a direct asset URL.

## Solution 1: The Recommended Approach – Serving Assets via Laravel Routes (API Endpoints)

The most secure and maintainable way to handle assets in a modern Laravel application is to treat them as resources managed by your backend. Instead of exposing raw file paths, you create an API endpoint that dynamically serves the image data. This leverages Laravel's powerful routing system and security controls.

### Step 1: Configure the Route

Define a route that points to a controller method responsible for reading the file from the disk.

```php
// routes/web.php or routes/api.php

use App\Http\Controllers\ImageController;

Route::get('/images/{filename}', [ImageController::class, 'show'])->name('images.show');
```

### Step 2: Create the Controller Logic

In your controller, you use the `Storage` facade to locate and return the file response.

```php
// app/Http/Controllers/ImageController.php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function show($filename)
    {
        // Ensure the file exists before attempting to read it
        if (!Storage::disk('public')->exists($filename)) {
            abort(404, 'Image not found.');
        }

        // Return the file content as a response
        return response(Storage::disk('public')->get($filename), 200, [
            'ContentType' => 'image/png', // Important for browser rendering
            'Content-Type' => 'image/png'
        ]);
    }
}
```

### Step 3: Access the Image in Vue.js

Now, instead of linking a local path, you construct a full URL pointing to your Laravel route. This is how you treat the image as a proper web asset within your SPA.

```html
<template>
  <div>
    <!-- Construct the URL using the defined route -->
    <img :src="`/images/${logoName}`" alt="Logo">
  </div>
</template>

<script setup>
import { ref } from 'vue';

const logoName = 'logo.png'; //
