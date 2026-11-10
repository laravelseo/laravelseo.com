---
title: "Laravel controller name should be plural or singular?"
description: "Laravel Controller Naming: Singular or Plural? Unpacking the Convention When starting with a new project in Laravel, one of the first structural decisions..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content"]
featured: false
---

When starting with a new project in Laravel, one of the first structural decisions developers face is how to name their controllers. A common point of debate revolves around whether controllers should be named using singular nouns (e.g., `PostController`) or plural nouns (e.g., `PostsController`). Seeing mixed conventions across tutorials can be confusing. As a senior developer, I can tell you that while both approaches *can* work, there is a widely accepted and recommended pattern in the Laravel ecosystem.

## The Recommended Laravel Convention: Singular Nouns

The consensus among Laravel developers leans towards using **singular nouns** for controller class names. This convention aligns well with Object-Oriented Programming (OOP) principles and how Eloquent models are typically structured.

If your controller is responsible for managing a single type of resource—for instance, handling all operations related to a single `Post`—the controller should be named after that singular entity.

**Why Singular is Preferred:**
Using the singular noun makes the relationship between the controller and its corresponding Eloquent Model clearer. The controller acts as the primary handler for that specific resource type.

For example, if you are building an application where you manage blog posts:

*   You would create a class named `PostController`.
*   This controller handles all requests (index, create, store, show, edit, update, destroy) related to the `Post` model.

This singular approach keeps the code conceptually focused and easier to maintain as your application scales.

## Distinguishing Between Naming Conventions

It is crucial to understand that there are often two naming conventions at play when discussing controllers: the **Class Name** and the **Route Name**. These are not always identical, which is where confusion often arises.

### 1. Controller Class Name (The Preferred Method)
As established, use singular nouns for the class name.

```php
// app/Http/Controllers/PostController.php

namespace App\Http\Controllers;

use App\Models\Post; // The model it interacts with

class PostController extends Controller
{
    public function index()
    {
        // Logic to fetch all posts
        $posts = Post::all();
        return view('posts.index', ['posts' => $posts]);
    }

    public function store(Request $request)
    {
        // Logic to create a new post
        $post = Post::create($request->all());
        return redirect()->route('posts.index');
    }
}
```

### 2. Route Naming (The Plural Standard)
While the controller class uses the singular noun, Laravel routes are typically defined using **plural names** to reflect the collection of resources being accessed via the URL structure. This is standard practice for RESTful routing.

```php
// routes/web.php

use App\Http\Controllers\PostController;

Route::resource('posts', PostController::class); 
// This automatically registers routes like /posts, /posts/1, etc.
```
Notice that the route name used here is `posts`, which reflects the collection of posts.

## Best Practices and Conclusion

The key takeaway is to separate your concerns: use **singular nouns for controller classes** (to represent the single resource being managed) and **plural nouns for route definitions** (to represent the collection being accessed via the URL). This separation provides a clean, logical structure that adheres to modern architectural standards. Following these conventions helps ensure your application remains readable and maintainable as you build complex features.

For more in-depth guidance on structuring your Laravel application and adhering to best practices, always refer back to official documentation. For comprehensive framework details, explore resources like [https://laravelcompany.com](https://laravelcompany.com). By adopting this singular/plural distinction thoughtfully, you ensure your controllers are intuitive and robust.
