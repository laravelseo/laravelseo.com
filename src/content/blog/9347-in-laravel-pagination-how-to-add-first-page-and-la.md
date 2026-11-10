---
title: "In Laravel Pagination how to add first page and last page?"
description: "Mastering Laravel Pagination: Adding First and Last Page Links Seamlessly When dealing with large datasets in web applications, pagination is essential for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

When dealing with large datasets in web applications, pagination is essential for improving user experience by breaking down content into manageable chunks. Laravel provides a robust and elegant system for handling this using the built-in `Paginator` capabilities. However, sometimes the default numbered links feel too dense, especially when dealing with small total page counts, or when you want to guide users directly to the beginning and end of the data set.

This post will dive into how you can customize Laravel pagination to feature explicit "First Page" and "Last Page" navigation, providing a cleaner and more intuitive experience for your users.

## The Challenge with Default Pagination

By default, Laravel's pagination provides standard links pointing to every page number (e.g., 1, 2, 3, ..., Last). While functional, this can clutter the interface if the total number of pages is small, or if you prefer a more direct navigation flow. The goal here is to replace or augment these default links with custom anchor tags that explicitly label the start and end points.

The visual difference between standard pagination and your desired layout—showing explicit "First Page" and "Last Page" buttons—is purely an exercise in front-end presentation built upon correct back-end logic. We need to calculate the starting point (page 1) and the ending point (the total number of pages) and inject custom links accordingly.

## Implementation Strategy: Calculating Custom Links

To achieve this, we won't rely solely on the default `links()` method. Instead, we will use the data provided by the Paginator instance to conditionally generate our custom links. This logic should reside primarily in your Controller or the view itself, depending on complexity.

### Step 1: Retrieving Pagination Data

First, ensure you are correctly retrieving the paginated data using Eloquent and the `Paginator` trait. The total number of pages is crucial for determining the "first" and "last" boundaries.

In your controller method, you will access the total count provided by the Paginator:

```php
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Pagination\LengthAwarePaginator;

class PostController extends Controller
{
    public function index(Request $request)
    {
        // Fetch posts and apply pagination
        $posts = Post::paginate(10); // Example: 10 items per page

        // Get the total number of pages
        $total = $posts->total();
        
        // The current page is automatically available via $posts->currentPage()
        
        return view('posts.index', compact('posts', 'total'));
    }
}
```

### Step 2: Displaying Custom Navigation in the Blade View

In your Blade template, you can now use the `$posts->first` and `$posts->last` properties (or manipulate `$posts->links()`) to create the custom navigation structure. A cleaner approach is often to build these links manually alongside the standard pagination links if you need complete control over the HTML structure.

Here is an example of how you might structure the links in your view:

```blade
{{-- Example implementation within your Blade file --}}

<nav class="pagination-custom">
    {{-- First Page Link --}}
    @if ($posts->first)
        <a href="{{ $posts->first->nextPageUrl() ?? $posts->links()[0] }}" class="first-page">First Page</a>
    @endif

    {{-- Standard Pagination Links (or modified) --}}
    {!! $posts->links('url') !!} 
    
    {{-- Last Page Link --}}
    @if ($posts->last)
        <a href="{{ $posts->last->previousPageUrl() ?? $posts->links()[count($posts->links()) - 1] }}" class="last-page">Last Page</a>
    @endif
</nav>
```

**Note on `$posts->first` and `$posts->last`:** For this approach to work smoothly, ensure your pagination object supports these properties. If you are using the standard `LengthAwarePaginator`, accessing the first and last model items within the paginator object is the most direct way to get the correct URLs for those boundaries. This level of fine-grained control over data presentation is a hallmark of building sophisticated features in Laravel, much like when structuring complex Eloquent relationships on sites like https://laravelcompany.com.

## Conclusion

Adding explicit "First Page" and "Last Page" navigation transforms a standard pagination component into a highly user-friendly interface. By understanding how the `Paginator` calculates its boundaries—specifically using methods like `first()` and `last()` alongside the total count—you gain the necessary tools to inject custom links. This practice moves beyond simple data fetching; it involves thoughtful UI/UX design, ensuring that users can easily navigate large amounts of information without unnecessary scrolling or confusion. Mastering these details is what separates functional Laravel applications from truly excellent ones.
