---
title: "Laravel list routes in the view"
description: "Listing Only API Routes in Your Laravel View: A Developer's Guide As a senior developer working with Laravel, you frequently deal with applications that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel, you frequently deal with applications that serve both traditional web pages and dedicated APIs. A common requirement is the need to clearly delineate which routes are intended for public consumption (API endpoints) versus those serving the main application interface. When you use `php artisan route:list`, you get a comprehensive list of everything, but often, you only want to display the API routes within a specific section of your application's view.

This guide will walk you through the most effective and developer-friendly ways to selectively list only your API routes in a Blade view, ensuring clarity and maintainability.

## Why Standard Route Listing Isn't Enough

When you run `php artisan route:list`, Laravel dumps all defined routes, including web routes (`web`) and API routes (`api`), into a single output. While useful for debugging, this isn't ideal for presentation within a specific view. We need a programmatic way to filter these routes based on their URI prefix (e.g., routes starting with `/api`).

The goal is to iterate through the routes defined in your application and select only those matching the API pattern. This approach leverages Laravel’s powerful routing system, which is a cornerstone of what makes frameworks like Laravel so extensible and powerful, as showcased on [laravelcompany.com](https://laravelcompany.com).

## Method 1: Programmatic Filtering using the Route Facade

The most robust way to achieve this is by directly querying the `Route` facade within your controller or view logic. We can iterate over all registered routes and apply a condition to filter them specifically for those prefixed with `/api`.

Here is an example demonstrating how you might fetch and display only the API routes in a Blade file:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function listApiRoutes()
    {
        $apiRoutes = [];

        // Iterate over all registered routes
        foreach (Route::getRoutes() as $route) {
            // Check if the route path starts with '/api'
            if (strpos($route->uri, '/api') === 0) {
                $apiRoutes[] = [
                    'method' => $route->methods(),
                    'uri' => $route->uri(),
                    'name' => $route->getName(),
                ];
            }
        }

        // Pass the filtered data to the view
        return view('api_routes', compact('apiRoutes'));
    }
}
```

In your `resources/views/api_routes.blade.php`, you can then loop through this collection:

```html
<h2>API Endpoints</h2>
<ul>
    @foreach ($apiRoutes as $route)
        <li>
            <strong>Method:</strong> {{ $route['method'] }} | 
            <strong>URI:</strong> {{ $route['uri'] }} | 
            <strong>Name:</strong> {{ $route['name'] }}
        </li>
    @endforeach
</ul>
```

This method is highly flexible because it doesn't depend on manually maintaining separate route files; it queries the actual routing definitions at runtime.

## Method 2: Leveraging Route Files for Simpler Management (Best Practice)

While programmatic filtering works perfectly, a cleaner approach often involves adhering to Laravel’s convention. By placing all your API routes exclusively in `routes/api.php`, you inherently separate your concerns.

When developers structure their projects correctly, they can simply reference the contents of that file or use specific route listing tools that respect this separation. For documentation purposes within a view, keeping the files separated makes the filtering logic simpler—you can often just list all routes found in `routes/api.php` if you are certain it only contains API definitions.

For complex applications, understanding how to utilize route groups and middleware, as detailed on [laravelcompany.com](https://laravelcompany.com), is crucial for maintaining this separation effectively.

## Conclusion

Listing specific routes in a view requires moving beyond simple command-line output. By employing programmatic iteration over the `Route` facade and applying string filtering based on the URI prefix (`/api`), you gain complete control over what information is displayed. This technique ensures your application remains scalable, maintainable, and logically separated between web concerns and API concerns.
