---
title: "How to implement / do \"Load more\" or \"See more\" in Laravel"
description: "Mastering Dynamic Loading in Laravel: Implementing \"Load More\" Functionality As a senior developer, I often encounter scenarios where we need to display..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

As a senior developer, I often encounter scenarios where we need to display large datasets to users without overwhelming them immediately. The concept of "Load More" or "See More" functionality—where content dynamically appends itself upon user interaction—is crucial for improving user experience.

If you are currently using Laravel's standard `paginate()` method and find yourself struggling with how to append records dynamically, you are hitting a common architectural hurdle. While pagination is excellent for traditional navigation (Page 1, 2, 3), implementing infinite scrolling requires a slightly different approach involving state management on the backend and asynchronous requests on the frontend.

This guide will walk you through the cleanest, most robust way to implement "Load More" functionality in Laravel using Eloquent and basic AJAX principles.

## Why Standard Pagination Isn't Enough for "Load More"

When you use `$posts->paginate(10)`, Laravel handles the slicing of data perfectly. However, this method is designed to render links for subsequent pages. To achieve a true "Load More" effect where new data appears *without* a full page refresh, we need to manage the state of what has already been loaded and request only the next batch of records from the server upon a click event.

The best way to handle this is by moving away from simple pagination links and embracing **Offset-based Pagination** combined with an API endpoint that serves specific data chunks.

## Step 1: Preparing the Backend (Controller & Eloquent)

Instead of relying solely on `paginate()`, we will manage the starting point for our query using the `offset()` method. This allows us to tell the database exactly where to start fetching the next set of records.

Let's assume you want to load 10 records at a time, and store the current offset in your session or request parameters.

### Controller Implementation

We will create an endpoint that accepts an `offset` parameter and returns only the requested chunk of data.

```php
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function loadPosts(Request $request)
    {
        // Determine the offset. Default to 0 if not provided.
        $offset = $request->input('offset', 0);
        $perPage = 10; // Define how many items to load

        // Fetch the posts using the offset method
        $posts = Post::orderBy('created_at', 'DESC')
                     ->offset($offset)
                     ->take($perPage)
                     ->get();

        // Optionally, you could return the total count for UI purposes
        $total = Post::count();

        return response()->json([
            'posts' => $posts,
            'total' => $total,
        ]);
    }

    public function index()
    {
        // Initial load: Fetch the first batch
        $posts = Post::orderBy('created_at', 'DESC')->take(10)->get();
        return view('post.index', compact('posts'));
    }
}
```

### Route Setup

Ensure you have a route defined to handle this request:

```php
Route::get('/posts/load', [PostController::class, 'loadPosts']);
```

## Step 2: Implementing the Frontend (View & JavaScript)

The view will display the initial set of posts and include a mechanism (a button) that triggers an AJAX call to load the next batch.

### View Implementation (`post.index`)

In your Blade file, you need a container for the posts and a button to trigger the loading.

```blade
<h2>Latest Posts</h2>

<div id="posts-container">
    @foreach($posts as $post)
        {{-- Display the post content --}}
        <div>
            <a href="https://i.sstatic.net/udEEx.png" rel="nofollow noreferrer"><img src="https://i.sstatic.net/udEEx.png" alt="{{ $post->name }}" /></a>
            <p>{{ $post->name }}</p>
        </div>
    @endforeach
</div>

{{-- The "Load More" button --}}
<button id="load-more-btn" 
        data-offset="{{ $posts->count() }}" 
        data-total="{{ $posts->count() + 10 }}">
    See More Posts
</button>
```

### JavaScript Logic (The Magic)

This is where the dynamic loading happens. We use JavaScript (Fetch API) to communicate with our Laravel endpoint whenever the button is clicked.

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const container = document.getElementById('posts-container');
    let currentOffset = 0;
    const perPage = 10; // Must match the logic on the server

    loadMoreBtn.addEventListener('click', function() {
        // Prevent multiple clicks while loading
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading...';

        // Send AJAX request to the Laravel endpoint
        fetch(`/posts/load?offset=${currentOffset}`)
            .then(response => response.json())
            .then(data => {
                if (data.posts && data.posts.length > 0) {
                    // Append new posts to the container
                    data.posts.forEach(post => {
                        const postHtml = `
                            <div>
                                <a href="https://i.sstatic.net/udEEx.png" rel="nofollow noreferrer"><img src="https://i.sstatic.net/udEEx.png" alt="${post.name}" /></a>
                                <p>${post.name}</p>
                            </div>
                        `;
                        container.insertAdjacentHTML('beforeend', postHtml);
                    });

                    // Update the offset for the next request
                    currentOffset += data.posts.length;
                    loadMoreBtn.setAttribute('data-offset', currentOffset);
                    loadMoreMoreBtn.setAttribute('data-total', data.total); // Update total count if needed

                } else {
                    // No more posts to load
                    loadMoreBtn.textContent = 'No more posts found.';
                    loadMoreBtn.disabled = true;
                }
            })
            .catch(error => {
                console.error('Error loading posts:', error);
                loadMoreBtn.textContent = 'Error loading. Try again.';
                loadMoreBtn.disabled = false;
            });
    });
});
```

## Conclusion

Implementing "Load More" functionality in Laravel requires a collaboration between the backend logic (Eloquent and API endpoints) and frontend interactivity (JavaScript/AJAX). By utilizing Eloquent's `offset()` method on a dedicated endpoint, you create a clean, scalable system. This approach separates data retrieval from presentation, which is a core principle of building robust applications, much like adhering to the design principles found in Laravel development. Focus on keeping your API endpoints lean and ensure proper state management, and you will build highly interactive user experiences efficiently.
