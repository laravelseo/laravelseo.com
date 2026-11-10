---
title: "Livewire throwing error when using paginated data"
description: "Fixing the Livewire Pagination Headache: Resolving PublicPropertyTypeNotAllowedException As a senior developer working with the Laravel ecosystem, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "JavaScript", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we often encounter subtle but frustrating errors when bridging server-side logic (like Eloquent pagination) with frontend state management (like Livewire). Recently, I ran into a very common issue: attempting to pass a paginated result directly into a public property in a Livewire component resulted in a `Livewire\Exceptions\PublicPropertyTypeNotAllowedException`.

This post will diagnose exactly why this happens and provide the canonical solution for correctly handling pagination within Livewire components, ensuring your application remains robust and adheres to Livewire’s expectations.

## The Diagnosis: Why Pagination Breaks Livewire Reactivity

The error message you encountered is highly specific:
`Livewire component's [user-posts] public property [posts] must be of type: [numeric, string, array, null, or boolean]. Only protected or private properties can be set as other types because JavaScript doesn't need to access them.`

The core issue lies in the data type being assigned to the `$posts` property. When you use Eloquent's `->paginate(5)` method, it does not return a simple array of results; it returns an instance of Laravel's `LengthAwarePaginator` object. This object contains methods for handling links (`links()`), total counts, current page numbers, and the collection itself, making it a complex object rather than a simple array that Livewire expects to serialize to the frontend.

Livewire relies on strict data types when synchronizing properties between the server and the client. When you assign the entire Paginator object to `$this->posts`, Livewire throws an exception because it cannot safely serialize this complex object into a format usable by JavaScript, leading to the type mismatch error.

## The Solution: Extracting the Data Before Passing It

The fix is straightforward: before assigning the data to the public property that feeds your view, you must extract the actual collection of items from the Paginator object into a simple PHP array.

We need to access the `items()` method on the paginator object to retrieve the raw data we want to display in the loop.

### Corrected Livewire Component Implementation

Here is how you should modify your component's `render()` method to correctly handle pagination:

```php
<?php

namespace App\Http\Livewire;

use Livewire\Component;
use App\Models\Post;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Auth; // Ensure Auth is imported if needed

class UserPosts extends Component
{
    use WithPagination;

    public $posts;
    public $type;
    protected $listeners = ['refreshPosts'];

    public function delete($postId)
    {
        $post = Post::find($postId);
        if ($post) {
            $post->delete();
            $this->posts = $this->posts->except($postId);
        }
    }

    public function render()
    {
        if ($this->type == 'all') {
            // 1. Get the paginator object
            $paginatedPosts = Post::latest()->paginate(5);
            
            // 2. Extract ONLY the items into an array for Livewire compatibility
            $postsData = $paginatedPosts->items(); 

            $this->posts = $postsData; // Assign the clean array

        } else if ($this->type == 'user') {
            // Apply the same extraction logic for filtered results
            $paginatedPosts = Post::where('user_id', Auth::id())->latest()->paginate(5);
            $postsData = $paginatedPosts->items();
            
            $this->posts = $postsData; // Assign the clean array
        }

        return view('livewire.user-posts', ['posts' => $this->posts]);
    }
}
```

### Explanation of Changes

By changing:
`$this->posts = Post::latest()->paginate(5);`

to:
`$this->posts = Post::latest()->paginate(5)->items();`

We ensure that the `$posts` property, which is public and exposed to the view layer, holds strictly an `array`, satisfying Livewire’s type requirement. This separation of concerns—where the component handles the Eloquent pagination logic and extracts the required data before exposing it—is a fundamental principle in building maintainable Laravel applications, particularly when utilizing features provided by frameworks like [Laravel](https://laravelcompany.com).

## Best Practices for Livewire Pagination

While extracting the items solves the immediate error, there are other ways to think about pagination in Livewire:

1.  **Use `WithPagination`:** Ensure you use the `use WithPagination;` trait. This trait automatically handles adding necessary methods (like `links()`) if you choose to expose the Paginator object directly, but as we saw, extraction is safer for public properties.
2.  **Pass Links Separately:** If you need to display pagination controls (the "Next" and "Previous" buttons), it is better practice to pass the raw paginator object or its links method separately to the view, rather than trying to inject the entire Paginator into a property intended for data iteration.
3.  **Server-Side Logic First:** Always let your backend (Eloquent/Laravel) handle the heavy lifting of fetching and filtering data *before* you try to expose it via Livewire properties.

By adhering to these principles, you ensure that your Livewire components remain highly reactive, error-free, and performant. Happy coding!
