---
title: "How to display a success message upon redirection from controller in Laravel?"
description: "How to Display a Success Message Upon Redirection from a Controller in Laravel As developers building dynamic applications with Laravel, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

As developers building dynamic applications with Laravel, we frequently encounter scenarios where data manipulation (like form submissions or record insertions) is followed by a redirection. While simple redirection using `return redirect('/dashboard');` works perfectly for navigation, it leaves the user without feedback on what actually happened—did the operation succeed? Did an error occur?

In your scenario, you successfully insert a record, but when the controller redirects back to the previous page, nothing is displayed, leaving the user confused. The solution lies in leveraging Laravel’s powerful session flashing mechanism to pass temporary data between requests.

This post will guide you through the correct and idiomatic way to redirect while simultaneously passing success messages, ensuring your users always receive appropriate feedback.

## The Limitation of Simple Redirection

When a controller executes `return redirect('/some-page');`, it is essentially telling the browser to make a new request to `/some-page`. By default, this action does not carry any contextual data intended for display on the next page. If you rely solely on the view rendering logic, and no specific variable was passed, the success message will never appear.

To solve this, we need a mechanism that stores data temporarily on the server side and makes it available only for the *next* request. This is exactly what Laravel's **Session Flashing** is designed for.

## The Solution: Using Session Flashing (`with()`)

The most effective way to achieve this is by using the `with()` method on your `redirect()` call. This method allows you to attach data to the session, which Laravel automatically makes available in the subsequent request. This pattern is a cornerstone of building responsive user experiences in Laravel applications.

### Step 1: Setting the Success Message in the Controller

In your controller method where the insertion logic succeeds, instead of just redirecting, you will use `with('success', 'Your message here')` to flash the data.

Consider the following example within your `store` method:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validation and Insertion Logic (Assume this succeeds)
        $validatedData = $request->validate([...]);
        \App\Models\Post::create($validatedData);

        // 2. Redirect with the Success Message
        return redirect('/posts')->with('success', 'Record successfully created!');
    }
}
```

Notice how we used `redirect('/posts')->with('success', '...')`. The data is stored in the session and will be available for exactly one subsequent request. This approach promotes clean separation of concerns, which is a key principle when structuring applications like those built on **Laravel** (see documentation at https://laravelcompany.com).

### Step 2: Displaying the Message in the View

Now that the data is safely stored in the session, you need to retrieve it in your target view (`/posts`). Laravel provides a handy helper method, `session('key')`, which makes retrieving this flashed data very simple.

In your Blade file, you can check for the existence of the key and display the message if it exists:

```blade
{{-- resources/views/posts/index.blade.php --}}

<h2>Posts</h2>

{{-- Check if the 'success' session variable exists before displaying it --}}
@if (session('success'))
    <div style="padding: 15px; margin-bottom: 20px; background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;">
        {{ session('success') }}
    </div>
@endif

{{-- Rest of your form or list display goes here --}}
```

By using the `@if (session('success'))` block, you ensure that the success message is displayed only once—immediately after the redirect—and is not displayed on subsequent page loads. This pattern keeps your views clean and ensures a consistent user experience, regardless of the controller action that preceded the redirection.

## Conclusion

Redirecting with data is a fundamental technique in web development for managing state between requests. By mastering the use of `with()` and session flashing in Laravel, you can elegantly handle success notifications, errors, and any other transient information. This practice ensures your application remains robust, communicative, and adheres to best practices for building scalable applications on the **Laravel** framework (check out more insights at https://laravelcompany.com).
