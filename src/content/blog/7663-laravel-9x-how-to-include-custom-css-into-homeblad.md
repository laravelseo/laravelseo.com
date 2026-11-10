---
title: "Laravel 9.x how to include custom css into home.blade.php"
description: "Laravel 9.x: The Definitive Guide to Including Custom CSS with Vite Welcome to the world of Laravel! It’s completely normal to feel overwhelmed when starting..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

Welcome to the world of Laravel! It’s completely normal to feel overwhelmed when starting out with a new framework, especially when dealing with asset bundling and compilation. You are not alone in facing issues trying to connect your frontend styles to your Blade templates. As a senior developer, I can assure you that this is one of the most common stumbling blocks for newcomers.

This post will walk you through exactly how modern Laravel applications, utilizing Vite (Laravel's default asset bundler), handle CSS and JavaScript inclusion, resolving the 404 errors you are encountering. We will move beyond manual pathing and establish the best practice for integrating your assets smoothly into your application structure.

## Understanding the Asset Pipeline: Vite vs. Manual Linking

Your confusion stems from the difference between traditional asset linking and how modern Laravel projects manage compiled frontend files. When you run `npm run build`, Vite compiles your source files (like `style.css`) and places them into the `public/build` directory, often with hashed filenames (e.g., `style.0327f7a6.css`).

When you try to link directly using a manual path like `{{ assets('css/style.css') }}`, you are telling Laravel to look for a static, uncompiled file in the public folder. Since Vite manages the compilation process, this direct approach usually fails because the file structure has changed during the build step.

The core concept is that instead of manually managing the compiled filenames, we should leverage Laravel's built-in tools designed specifically for asset management.

## The Modern Solution: Using the `@vite` Blade Directive

For any modern Laravel project (including 9.x), the recommended and most robust way to include assets bundled by Vite is by using the `@vite` Blade directive. This directive automatically handles pointing to the correct entry points, resolves the necessary paths, and manages asset loading efficiently, ensuring that your CSS and JavaScript are loaded correctly regardless of how Vite names the compiled files.

### Step-by-Step Implementation

To use this method effectively, ensure you have the standard Vite setup in place (which usually involves setting up `vite.config.js` and running the build command). Then, in your main layout file (like `resources/views/layouts/app.blade.php` or your `home.blade.php`), simply add the following directive:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Laravel App</title>
    
    {{-- This single line handles linking all your compiled assets --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
</head>
<body>
    <!-- Your content goes here -->
</body>
</html>
```

**Why this works:**

1.  **Automatic Resolution:** The `@vite` directive abstracts away the complexity of knowing exactly which hashed file to link. It looks at your `vite.config.js` and knows precisely where to find the entry points for CSS and JS.
2.  **Performance:** Vite is highly optimized for asset delivery, ensuring that your assets are served efficiently. This approach aligns perfectly with the philosophy of building scalable applications, much like the robust architecture promoted by the [Laravel Company](https://laravelcompany.com).
3.  **Consistency:** It ensures consistency across your entire application, preventing pathing errors that plague manual linking methods.

## Conclusion: Embrace Laravel's Ecosystem

Don't let initial setup hurdles discourage you. The journey into the Laravel ecosystem involves learning its tools, and understanding how modern tools like Vite integrate is a crucial step. By embracing directives like `@vite` instead of trying to manually construct public file paths, you adopt the intended, most stable, and most powerful way to manage assets in Laravel 9.x and beyond.

If you continue to explore deeper into framework architecture and best practices, I highly recommend diving into the official documentation provided by the [Laravel Company](https://laravelcompany.com) for comprehensive guides on asset management and Eloquent relationships. Happy coding!
