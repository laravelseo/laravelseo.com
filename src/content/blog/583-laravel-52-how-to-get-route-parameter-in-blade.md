---
title: "laravel 5.2 How to get route parameter in blade?"
description: "Title: Mastering Laravel 5.2 Route Parameters in Blade Templates Body: In Laravel, route parameters allow you to pass dynamic data through URLs to your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Mastering Laravel 5.2 Route Parameters in Blade Templates

Body:
In Laravel, route parameters allow you to pass dynamic data through URLs to your application's routes. These variables help tailor the user experience by showing specific content based on the request made. In this blog post, we will explore how to retrieve route parameters in Laravel 5.2 and utilize them within Blade templates.

First, let us create an example URL: `http://project.dev/blogs/image-with-article`. In this case, the parameter of interest is `image-with-article`, which appears after `blogs` in our route path. To handle this route in your application, you need to define a route with a corresponding controller method.

Here's how we can create the route for handling blog posts by their slug:

```php
Route::get('/blogs/{slug}', ['as' => 'blog.by.slug', 'uses' => 'CmsController@show']);
```

In this example, we are using the get() method to map the route for any HTTP GET requests. The path to our blog posts takes slug as a parameter and is accessible through the `{slug}` placeholder in the URL. We then define the route with an 'as' key followed by a unique name ('blog.by.slug') to identify it later within your application code. Finally, we specify the controller method that will handle this route using the 'uses' key, pointing to the CmsController@show action.

Now, let us retrieve this parameter in our Blade templates:

Inside the `CmsController` class, you can access the route parameters through a method called `request()`. The request object has various methods that provide information about the current HTTP request. To fetch the value of the slug passed through the URL, use the 'route' property and its related 'parameter' key:

```php
public function show(){
    $slug = request()->route('slug');
}
```

After retrieving the parameter in your controller, pass it to a view for display. In our case, we will show the article with the specific image on that post. To do this, simply create a new Blade template and include the slug:

```blade
@extends('layouts.master')

@section('title', 'Blog Page')

@section('content')
    {{ $slug }} // Displays "image-with-article" from our example URL
    // Fetch the article with this slug from your database or other storage system
    @if ($article)
        <img src="{{ asset('images/example.jpg') }}" alt="Example Image">
        {{ $article->title }}
        {{ $article->content }}
    @endif
@endsection
```

In this example, we display the slug from our route within a template while also fetching the article associated with it from your database or other storage. This allows us to show the appropriate content based on the user's request and provide a more personalized experience. By combining Laravel's powerful routing capabilities with its flexible Blade templating system, you can create engaging and dynamic applications while keeping code clean and easy to maintain.

To wrap up, we have covered how to define route parameters in Laravel 5.2, handle them within our controllers, and display the values in our Blade templates. By following these steps, you will be able to efficiently manage your application's data and provide a better user experience. Remember to incorporate best practices throughout your coding process for optimal performance and simplicity.
