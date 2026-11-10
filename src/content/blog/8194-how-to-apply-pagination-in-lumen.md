---
title: "How to apply pagination in Lumen?"
description: "How to Apply Pagination in Lumen: A Developer's Guide As a senior developer transitioning projects or working within the lightweight environment of Lumen,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

As a senior developer transitioning projects or working within the lightweight environment of Lumen, you often find that familiar features from Laravel need slight adjustments. If you are accustomed to using Eloquent pagination in full Laravel applications and are now trying to implement it in Lumen, you might be wondering where the magic happens.

The good news is that Lumen inherits the core power of the Laravel ecosystem, including Eloquent ORM, which means the principles of pagination remain exactly the same. The difference lies primarily in how you structure your routes and controllers within Lumen’s more minimal framework setup.

This guide will walk you through the exact process of implementing clean, efficient pagination—showing 10 records per page—in a Lumen application.

---

## Understanding Pagination in Lumen

Pagination is essential for handling large datasets efficiently. Instead of loading thousands of records at once, we load them in manageable "pages." In Lumen, as with Laravel, this functionality relies entirely on Eloquent's built-in methods. The key differentiator is ensuring your controller correctly fetches the paginated result and passes it to the view.

### Prerequisites

Before diving into the code, ensure you have:
1. A working Lumen installation.
2. An Eloquent Model (e.g., `Post` model) mapped to a database table.
3. A defined route pointing to your controller method.

## Step-by-Step Implementation

Let's assume we want to list all blog posts, showing 10 items per page.

### 1. Define the Controller Logic

In Lumen, you typically handle the logic within a dedicated controller file. The magic happens when you use the Eloquent `paginate()` method instead of simply using `limit()` and manually calculating offsets.

Here is how your controller method would look:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post; // Assuming you set up your models properly in Lumen
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        // 1. Retrieve the data, applying pagination directly via Eloquent
        $posts = Post::paginate(10); // Requesting 10 items per page

        // 2. Pass the paginated collection to the view
        return view('posts.index', compact('posts'));
    }
}
```

**Developer Insight:** Notice that we used `$posts = Post::paginate(10);`. This single method call handles all the complex database logic—calculating the `LIMIT` and `OFFSET` clauses—which is significantly cleaner than manually writing raw SQL for pagination, adhering to best practices seen across frameworks like Laravel.

### 2. Define the Route

Ensure your route points correctly to this controller method:

```php
// routes/web.php (or wherever you define your Lumen routes)
$router->get('/posts', 'PostController@index');
```

### 3. Displaying Pagination in the View

The final, crucial step is iterating over the results and displaying the pagination links provided by Eloquent. When you pass a paginated object to the view, it contains methods like `links()` which render the necessary `next`, `prev`, and page number navigation.

In your Blade file (`resources/views/posts/index.blade.php`), you can display the results:

```html
<h2>All Blog Posts</h2>

<ul>
    @foreach ($posts as $post)
        <li>{{ $post->title }}</li>
    @endforeach
</ul>

{{-- Display the pagination links provided by Eloquent --}}
<div class="pagination">
    {{ $posts->links() }}
</div>
```

## Conclusion

Implementing pagination in Lumen is straightforward once you understand that you are leveraging the power of Eloquent. By utilizing the built-in `paginate(X)` method within your controller, you delegate the complex database querying to the ORM, keeping your code clean, readable, and highly maintainable. As you continue building applications, remember that adhering to these data access patterns ensures you are following solid architectural principles, just as highlighted in resources like [laravelcompany.com](https://laravelcompany.com) regarding robust application structure.
