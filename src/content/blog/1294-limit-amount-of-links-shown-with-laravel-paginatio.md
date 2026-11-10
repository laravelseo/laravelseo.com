---
title: "Limit amount of links shown with Laravel pagination"
description: "Title: Optimizing Laravel Pagination for Mobile Devices: Limiting Link Visibility Introduction: Pagination is a crucial aspect of any application that deals..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Optimizing Laravel Pagination for Mobile Devices: Limiting Link Visibility

Introduction:
Pagination is a crucial aspect of any application that deals with large amounts of data. Laravel provides a robust pagination system that allows developers to present this information in a more manageable manner. However, sometimes the amount of links shown on the page can be overwhelming or take up too much space, particularly on mobile devices. This blog post will guide you through how to limit the number of links displayed with Laravel's pagination.

The First Approach: Modifying the View

A simple solution to this problem is modifying your view file where the paginator instance (`$paginator`) is passed and rendering the pagination. To limit the visible links, you can use Laravel's `simplePaginate()` method instead of the traditional `paginate()`. This will only return a single page with the requested results, hiding all other pages by default. Here's an example:

```php
$posts = Post::whereHas('category', function ($query) {
    $query->whereIn('name', ['news', 'tutorials']);
})->get();

// Use simplePaginate() to show only current page results
$paginator = $posts->simplePaginate(10);

return view('content.index', compact('posts', 'paginator'));
```

In this example, we changed the `paginate()` call with `simplePaginate(10)`. This will limit the visible links to only display 10 at a time. The 10 indicates the number of items per page, which you can change according to your needs. If you want a variable count, you could pass it as an argument to the `simplePaginate()` method.

The Second Approach: Customizing the Paginator Instances

Another approach is customizing the paginator instances with Laravel's collection methods or by extending the `Illuminate\Pagination\AbstractPaginator` class and overriding its necessary methods. In this case, you will need to build a new implementation that limits the number of visible links while still providing the complete results.

Here is an example of creating a custom paginator instance using a collection:

```php
$posts = Post::whereHas('category', function ($query) {
    $query->whereIn('name', ['news', 'tutorials']);
})->get();

// Customize the pagination with limitLinks() and collect() methods
$paginator = $posts->limitLinks(10)->collect();
$paginator = new CustomPaginator($posts, 10); // Create a new instance of your custom class

return view('content.index', compact('posts', 'paginator'));
```

In this example, we used the `limitLinks()` method to limit the number of visible links from 13 (default) down to 10 and then created a new pagination instance using a custom class that extends the Laravel's `AbstractPaginator`. You can create such a custom class in your application:

```php
// In your CustomPaginator class
namespace App\Custom;

class CustomPaginator extends AbstractPaginator
{
    /**
     * Create a new paginator instance.
     *
     * @param Collection $items
     * @param int|null $perPage
     * @return static
     */
    public function __construct(Collection $items, int $perPage = null)
    {
        parent::__construct($items->toArray(), $perPage);
    }

    // Override necessary pagination methods as needed
    protected function getVisibleItemsCount()
    {
        return 10;
    }
}
```

Conclusion:
In conclusion, there are two viable approaches to limiting the number of links shown with Laravel's pagination. The first option involves using `simplePaginate()`, while the second approach requires customizing the paginator instance or extending the `AbstractPaginator` class with further modifications to fit your preferences. Regardless of which method you choose, it is essential to provide a well-organized and optimized user experience for mobile devices. For more information on Laravel's pagination system, visit our blog at https://laravelcompany.com where we offer helpful resources and tutorials.
