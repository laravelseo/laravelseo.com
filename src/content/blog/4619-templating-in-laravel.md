---
title: "Templating in Laravel"
description: "Mastering Layouts: Templating Effectively in Laravel Migrating from older MVC frameworks, like CodeIgniter with its custom template system, often brings a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Migrating from older MVC frameworks, like CodeIgniter with its custom template system, often brings a familiar but sometimes confusing set of concepts when moving to a modern framework like Laravel. You are essentially trying to replicate layout inheritance and partial inclusion. While the *goal* is the same—creating reusable UI structures—Laravel achieves this through a powerful, elegant system called **Blade templating**.

This post will walk you through the idiomatic Laravel way to handle layouts, content injection, and partial views, addressing the concepts demonstrated in your example and showing you how to structure cleaner, more maintainable code.

## The Foundation: Blade Layouts and Inheritance

In Laravel, layout management is handled directly within the Blade templating engine using directives like `@extends` and `@section`. This system allows you to define a main skeleton (the layout) and then specify where dynamic content should be injected into that skeleton.

Your approach of manually passing `$layout` and referencing files via `@include` works, but it bypasses Laravel's built-in inheritance mechanism. The true power lies in using layouts for defining the overall structure and sections for defining the variable parts.

### Anatomy of a Layout File

Let’s look at how you would define a master layout file, which acts as your `default.blade.php`:

```html
{{-- resources/views/layouts/default.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $title ?? 'Laravel App' }}</title>
    {{-- Link to CSS, etc. --}}
</head>
<body>
    <header>
        <!-- Header content goes here -->
    </header>

    <main>
        {{-- THIS IS WHERE THE CHILD VIEW CONTENT WILL BE INJECTED --}}
        @yield('content') 
    </main>

    <footer>
        <!-- Footer content goes here -->
    </footer>
</body>
</html>
```

Notice the use of `@yield('content')`. This directive creates a placeholder. Any view that extends this layout can provide the content for that specific block, ensuring consistency across your application structure.

## Injecting Content: Extending and Sectioning Views

Now, let's see how a specific page (like `home.blade.php`) utilizes this master layout. Instead of manually including header and footer partials, we use `@extends` to hook into the layout and `@section` to fill the required parts.

```html
{{-- resources/views/home.blade.php --}}
@extends('layouts.default')

{{-- Define the content for the 'content' section defined in the layout --}}
@section('content')
    <h2>Welcome to the Home Page!</h2>
    <p>This content is dynamically injected into the main body of the default layout.</p>
@endsection
```

By using this structure, you eliminate the need for manual `@include` statements for basic header/footer inclusion within every view. This makes maintenance significantly easier; if you change the HTML structure in `layouts/default.blade.php`, all views automatically inherit the change. This adherence to structure is a core principle of robust application architecture, much like the principles espoused by the Laravel community found at https://laravelcompany.com.

## Controller Logic: Passing Data to the View

The controller's job shifts from manually constructing HTML strings (as seen in your example) to simply preparing data and passing it to the view. The controller should focus on business logic, while Blade focuses purely on presentation.

For a simple route mapping that loads a view with data, your controller action would look much cleaner:

```php
// app/Http/Controllers/HomeController.php

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // Prepare the data to be passed to the view
        $data = [
            'title' => 'Home Dashboard',
            'page_content' => 'This is the dynamic content for the page.'
        ];

        // Pass the array of data to the view engine
        return view('home', $data);
    }
}
```

And finally, your `home.blade.php` would access this data directly:

```html
{{-- resources/views/home.blade.php --}}
@extends('layouts.default')

@section('content')
    <h2>{{ $title }}</h2> 
    <p>{{ $page_content }}</p>
@endsection
```

## Conclusion

The transition from template systems like CodeIgniter's to Laravel's Blade system is a shift from procedural inclusion to object-oriented inheritance. By mastering `@extends` and `@section`, you leverage Laravel’s powerful templating engine to build highly reusable, maintainable, and scalable user interfaces. Instead of manually managing partials, focus on defining the structure once in your layout files and use sections to dynamically populate the content across your entire application. For more advanced details on structuring your applications using these core concepts, always refer to the official documentation at https://laravelcompany.com.
