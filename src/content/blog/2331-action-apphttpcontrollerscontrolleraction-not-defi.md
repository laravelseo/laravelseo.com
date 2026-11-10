---
title: "Action App\\Http\\Controllers\\Controller@action not defined"
description: "Fixing the Dilemma: Why Action App\\Http\\Controllers\\About@show not defined Occurs in Laravel Forms As a senior developer, I often encounter situations..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I often encounter situations where the code *looks* correct, but the application throws an error. The error you are seeing—`Action App\Http\Controllers\About@show not defined`—is a classic symptom of a misunderstanding between how a form submits data and how Laravel handles routing.

This post will walk you through exactly what is going wrong with your form submission attempt, explain the core concept of Laravel routing, and provide the correct, robust solution. We'll ensure your application follows best practices for handling HTTP requests.

## The Problem: Controller Methods vs. URL Routes

You have correctly defined a controller method named `show()` within your `AboutController`:

```php
class AboutController extends Controller
{
    public function show()
    {
        return view('about.contactshow');
    }
    // ... other methods
}
```

And you are trying to link your form action using the syntax: `'action' => 'About@show'`.

The issue lies in this mismatch: **`About@show` is not a valid URL path.** It is a string describing a relationship between a Controller class and a method name. When the browser attempts to navigate to this address, Laravel doesn't know how to map that string to an actual entry point in your application.

In essence, you are telling the form where to go (`action="About@show"`), but you haven't told Laravel **how** to get there (the route definition).

## The Solution: Implementing Proper Routing

In Laravel, every external request (like a form submission) must pass through the routing system defined in your `routes/web.php` file. This file is the map that tells the framework which controller method should handle a specific URL.

To fix this, you need to define a route that points to your `AboutController@show` method.

### Step 1: Define the Route

Open your `routes/web.php` file and add a route definition. Since you are likely using a standard resource or named route structure for an "About" page, defining a simple POST route is sufficient for this example:

```php
// routes/web.php

use App\Http\Controllers\AboutController;
use Illuminate\Support\Facades\Route;

// Define the route that handles the POST request to update or process the 'show' action
Route::post('/about/contact', [AboutController::class, 'show'])->name('about.show');
```

**Explanation:**
1.  `Route::post(...)`: We specify that this route only responds to HTTP `POST` requests (which is essential for form submissions).
2.  `'/about/contact'`: This is the actual URL path your form will submit data to.
3.  `[AboutController::class, 'show']`: This tells Laravel: "When a request hits this URL, execute the `show` method inside the `AboutController` class."
4.  `->name('about.show')`: We assign a unique name to this route, which is excellent practice for using named routes throughout your application (as seen in your original attempt).

### Step 2: Update Your Blade Form

Now that you have a valid route defined, you must update your form to point directly to the URL path you just created. You no longer need to use the complex string notation within the `action` attribute; you simply use the actual URI.

Your updated blade file (`about/contact.blade.php`) should look like this:

```html
{{-- Notice the action points to the defined URL route --}}
{!! Form::open(array('action' => '/about/contact', 'method' => 'post')) !!}

    {!! Form::label('username','Username',array('id' => 'user','class' => '')) !!}
    {!! Form::text('username','user 1',array('id' => 'user','class' => 'string', 'placeholder' => 'user 1')) !!}

    {!! Form::submit('Click Me!') !!}


{!! Form::close() !!}
```

By using the actual URL (`/about/contact`), you ensure that when the form
