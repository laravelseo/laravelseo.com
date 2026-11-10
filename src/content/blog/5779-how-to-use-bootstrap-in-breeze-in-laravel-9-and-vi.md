---
title: "How to use Bootstrap in Breeze in Laravel 9 and Vite"
description: "How to Seamlessly Integrate Bootstrap with Laravel Breeze using Vite Setting up a new project with Laravel Breeze is an excellent starting point for modern..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "PHP"]
featured: false
---

Setting up a new project with Laravel Breeze is an excellent starting point for modern web development. It provides a clean scaffolding for authentication and basic UI components, typically leveraging Vue or Livewire. However, many developers encounter a common hurdle: integrating a familiar framework like Bootstrap without completely overhauling the framework's structure.

If you are looking for a simple, non-destructive way to add Bootstrap styling to your Breeze application built with Laravel 9 and Vite, this guide provides the exact solution. We will focus on leveraging the standard asset pipeline that Laravel provides, ensuring your project remains clean, maintainable, and adheres to best practices.

## The Recommended Approach: Leveraging Vite for Asset Management

The key to using Bootstrap effectively in a modern Laravel setup is understanding how Vite handles assets. Instead of manually linking external CSS files everywhere, we should integrate the framework's styles directly into your main Blade layout, allowing Vite to manage the compilation and delivery process efficiently.

Since Breeze generates a standard Blade layout, adding Bootstrap classes to this base template is the most straightforward path. We will use the Content Delivery Network (CDN) approach for simplicity in this initial setup, while keeping an eye on how you might transition to local asset bundling later. This ensures immediate visual results without complex configuration changes.

## Step-by-Step Implementation

Follow these simple steps to get Bootstrap integrated into your Breeze project:

### 1. Locate the Main Layout File

Navigate to your primary Blade layout file, which is typically located at `resources/views/layouts/app.blade.php`. This is the master template that all your views will extend.

### 2. Add the Bootstrap CSS Link

Inside the `<head>` section of your `app.blade.php` file, add the standard link tag pointing to the Bootstrap CDN. This ensures that every page rendered by Breeze will inherit the necessary styling.

Here is what the updated section should look like:

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel Breeze App</title>

        <!-- *** ADD BOOTSTRAP LINK HERE *** -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QExpWz3Y12bT7L7m6tGgR6sD0H9f0UjXqS3kC+gE5A1oW4nF2vPqK7yBw/rJ9c" crossorigin="anonymous">

    </head>
    <body>
        <!-- Your application content goes here -->
```

### 3. Include the JavaScript Bundle

For Bootstrap components (like modals, carousels, or form validation features) to function correctly, you also need to include the necessary JavaScript bundle provided by Bootstrap. Place this script just before the closing `</body>` tag:

```html
    <!-- ... rest of your HTML content -->

    <!-- *** ADD BOOTSTRAP JS BUNDLE HERE *** -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60a47m5tcW1cM2jzLpU9yKqCgB6v2NnJdDkEwHhO0xQeR/oT" crossorigin="anonymous"></script>
</body>
</html>
```

## Why This Approach is Superior

This method is highly recommended because it keeps your Laravel application decoupled from specific CSS dependencies. When you are exploring the robust ecosystem of Laravel, understanding how assets are managed is critical—whether you are using standard Laravel features or diving into more complex setups like those discussed on the official [Laravel Company](https://laravelcompany.com) documentation regarding framework architecture.

By using CDN links initially, you achieve immediate integration with zero configuration overhead. As your project grows and you require custom styling or performance optimization, you can transition to a more advanced setup where you compile Bootstrap locally using Vite, ensuring better caching and control over the entire asset pipeline. This approach is flexible, easy to maintain, and perfectly suited for rapid development within the Laravel ecosystem.

## Conclusion

Integrating Bootstrap into your Laravel Breeze project with Vite is straightforward. By modifying your main layout file (`app.blade.php`) to include the necessary CDN links for CSS and JavaScript, you achieve a fully styled interface immediately. This method avoids complex framework replacements like Jetstrap, allowing you to maintain the clean structure provided by Breeze while gaining access to powerful, pre-built styling. Happy coding!
