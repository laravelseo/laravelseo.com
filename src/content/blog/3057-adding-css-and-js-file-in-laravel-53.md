---
title: "adding css and js file in laravel 5.3"
description: "Centralizing Assets: How to Include CSS and JS Files in Laravel Master Layouts As developers working within the Laravel ecosystem, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

As developers working within the Laravel ecosystem, one of the most common challenges we face when building multi-page applications is managing assets like CSS and JavaScript. You want consistency, efficiency, and minimal repetition. The scenario you described—including Bootstrap files separately in every view file—is a classic example of poor structure that leads to maintenance headaches.

This post will guide you through the professional, Laravel-centric method of centralizing your stylesheets and scripts into a master layout, ensuring they load correctly and efficiently across your entire application. We’ll move beyond simple inclusion and discuss best practices for scalable front-end development.

## The Problem with Duplication

When you place asset links directly inside every Blade file (like `welcome.blade.php` and `second.blade.php`), you create redundancy. If you decide to update the path, change a class name, or switch from Bootstrap to Tailwind CSS later on, you would have to hunt down and modify dozens of files. This violates the principle of DRY (Don't Repeat Yourself), which is crucial for maintainable codebases.

Your goal—loading assets once in a "master page"—is exactly the right approach. In Laravel, this is achieved through **Blade Layouts**.

## The Solution: Implementing Master Layouts with `@extends`

The core mechanism for solving this problem in Laravel is utilizing Blade's layout inheritance feature using the `@extends` directive. This allows you to define a master structure (the layout) that other pages will inherit, only needing to fill in their unique content using `@section`.

### Step 1: Create the Master Layout File

Create a file, typically located in the `resources/views/layouts/` directory, which will serve as your main template. This file will contain the essential HTML structure and, crucially, the links to your external CSS and JS files.

For example, create `resources/views/layouts/app.blade.php`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel Master Layout</title>
    <!-- Centralized CSS Inclusion -->
    <link href="{{ asset('css/bootstrap.css') }}" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>

    <header>
        <h2>My Application Header</h2>
    </header>

    <main>
        {{-- This is where the content of child pages will be injected --}}
        @yield('content')
    </main>

    <footer>
        <p>&copy; 2024 My Laravel App</p>
    </footer>

    <!-- Centralized JS Inclusion -->
    <script src="{{ asset('js/bootstrap.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>

</body>
</html>
```

Notice how we use `@yield('content')`. This placeholder is where any child view will paste its unique content. The CSS and JS links are now defined only once, at the top level of the master file.

### Step 2: Extend the Layout in Child Views

Now, in your specific pages (like `welcome.blade.php` or any other view), you simply extend this master layout and provide the content for the designated section.

For `welcome.blade.php`:

```html
{{-- Importing the Master Layout --}}
@extends('layouts.app')

{{-- Defining the content for the 'content' section --}}
@section('content')
    <h2>Welcome to the Homepage!</h2>
    <p>This content is unique to the welcome page.</p>
@endsection
```

When Laravel renders `welcome.blade.php`, it pulls in everything from `layouts.app.blade.php` and replaces the `@yield('content')` placeholder with the content defined in the `@section('content')` block.

## Best Practices for Asset Management in Laravel

Centralizing assets is just the first step. For larger applications, consider these advanced practices:

1.  **Use Asset Helper:** Always use the `asset()` helper (as shown above) instead of raw string paths. This ensures your links are relative to the public directory and respect the application's configuration.
2.  **Separate Concerns:** Keep CSS and JS in separate directories (e.g., `public/css` and `public/js`). This makes it easy for build tools or future front-end frameworks to manage these assets efficiently, a concept central to good architecture, similar to how modern packages on **laravelcompany.com** are designed.
3.  **Consider Vite:** For modern Laravel projects (especially those using Laravel 9+), integrating asset bundling via Vite is highly recommended over manually managing individual files. Vite handles compiling, minifying, and injecting
