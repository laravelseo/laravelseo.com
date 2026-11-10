---
title: "How To Add Title For Each Page In Laravel"
description: "How To Add Dynamic Titles For Each Page In Laravel: Mastering SEO and Blade Templating As developers building web applications with Laravel, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "SEO", "Content", "HTML"]
featured: false
---

As developers building web applications with Laravel, one of the most common hurdles we face is ensuring that every page has a unique, relevant title. If all your pages share the same static `<title>` tag, not only does this hurt user experience, but it severely damages your Search Engine Optimization (SEO) potential. You've correctly identified the need for dynamic titles, and while your current attempt using settings is a good start, we can make this process more robust, scalable, and aligned with Laravel's principles of separation of concerns.

This post will walk you through the professional, developer-approved way to dynamically generate unique page titles in a Laravel application.

## The Problem with Static Titles

When you use a single, hardcoded title across your entire application, search engines (like Google) see a monolithic site rather than distinct content. This lack of differentiation makes it difficult for crawlers to understand the specific focus of each URL, leading to lower click-through rates and poor ranking.

Your provided code snippet in `layouts/app.blade.php`:
```html
<title>{{setting('site.title')}} | {{setting('site.description')}}  @if(isset($data->title)) {{$data->title}} @endif</title>
```
This approach is fine for a global site title, but it falls short when you need page-specific content (e.g., the title of a specific blog post or product page). The key to dynamic titles lies not just in the Blade view, but in the data you pass from your controller.

## The Laravel Solution: Dynamic Data Flow

The fundamental principle in Laravel development is that the **Controller** handles the logic and data retrieval, and the **View (Blade)** handles only the presentation of that data. To get a unique title for every page, the title must be calculated *before* it reaches the Blade file.

### Step 1: Determine the Title in the Controller

In your route or controller method, you need to fetch the specific title associated with the current request. If you are displaying a blog post, you would fetch that post's title from the database using Eloquent.

Let's assume you have a `Post` model and you are fetching a single post:

```php
// app/Http/Controllers/PostController.php

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function show(Post $post)
    {
        // 1. Retrieve the specific data for this page
        $pageTitle = $post->title;
        $siteTitle = config('site.title'); // Using Laravel configuration files is best practice

        // 2. Pass all necessary variables to the view
        return view('posts.show', [
            'post' => $post,
            'page_title' => $pageTitle,
            'site_description' => config('site.description'),
        ]);
    }
}
```

### Step 2: Display Dynamic Data in the Blade View

Now, instead of relying on potentially missing or generic settings, you simply echo the specific data passed to the view. This makes your layout highly flexible and ensures every page has a unique title derived directly from its content.

In your `layouts/app.blade.php`, you would modify the `<title>` tag to prioritize the dynamic content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    {{-- Dynamic Title Implementation --}}
    <title>{{ $page_title }} | {{ $site_description ?? config('site.title') }}</title>

    {{-- Other meta tags and CSS links go here --}}
</head>
<body>
    {{-- Page content --}}
</body>
</html>
```

By passing `$page_title` from the controller, you achieve true dynamic title generation. This pattern is a cornerstone of building scalable applications within the Laravel ecosystem, allowing your views to remain clean and focused on presentation rather than complex business logic. For more advanced insights into structuring large-scale applications, exploring patterns found on platforms like [Laravel Company](https://laravelcompany.com) will be invaluable.

## Conclusion

Adding dynamic titles is not just a cosmetic change; it's a crucial SEO and user experience enhancement. By strictly adhering to the MVC pattern—calculating page-specific data in your controller and passing only necessary variables to the Blade view—you ensure that your application is maintainable, scalable, and perfectly optimized for search engines. Embrace this separation of concerns, and watch your Laravel application shine!
