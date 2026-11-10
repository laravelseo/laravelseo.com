---
title: "How to do filter for products (laravel)"
description: "Mastering Dynamic Product Filtering in Laravel: A Deep Dive Building an e commerce platform requires robust and flexible filtering mechanisms. When you have..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

Building an e-commerce platform requires robust and flexible filtering mechanisms. When you have multiple views—like a main catalog page, parent category pages, and nested children category pages—the challenge isn't just filtering the data; it’s ensuring that these filters apply correctly based on the context of the current navigation path.

The core question you are asking is: How do we efficiently translate dynamic `GET` request parameters (like `price_from=10&color=red`) into complex database queries in Laravel? Should this logic live primarily in the Model, or should it reside in the Controller? As a senior developer, I can guide you toward the most maintainable and scalable solution.

## The Philosophy of Filtering: Where Should the Logic Live?

A common initial thought is to place filtering logic directly inside the Eloquent Model, as you suggested: `Product::filter($model, $request)`. While this keeps the data manipulation close to the data source, it often leads to tightly coupled models that violate the Single Responsibility Principle (SRP).

In Laravel, the preferred approach for complex query building is usually a combination of **Controller logic** and **Eloquent Query Scopes**.

1.  **Controllers:** Are responsible for handling HTTP requests, validating input, and determining *what* data needs to be fetched based on user intent. This keeps the presentation layer clean.
2.  **Models (Scopes):** Are responsible for defining reusable, encapsulated ways to query the model. Query Scopes allow you to define common filtering patterns that can be easily applied anywhere in your application.

For dynamic filters based purely on request parameters, applying the logic directly within the controller or using dedicated scopes is generally cleaner than forcing the core Eloquent Model to handle every possible external request permutation.

## Implementing Flexible Filtering with Query Scopes

Instead of a monolithic `filter` method in the model, we can leverage Laravel's ability to dynamically build queries. This allows us to chain conditions based on what parameters are present in the request.

Let's assume you have a `Product` model and want to implement filtering for price and color. We will use the Request object provided by Laravel to inspect the incoming data.

### Step 1: Define Scopes for Reusability

We define scopes within the model that handle specific filtering logic. This keeps the Model focused on data relationships, not request handling.

```php
// app/Models/Product.php

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class Product extends Model
{
    /**
     * Scope a query to filter by price range.
     */
    public function scopePriceRange(Builder $query, Request $request)
    {
        if ($request->has('price_from') && $request->has('price_to')) {
            $query->whereBetween('price', [$request->input('price_from'), $request->input('price_to')]);
        }
        return $query;
    }

    /**
     * Scope a query to filter by color.
     */
    public function scopeColor(Builder $query, Request $request)
    {
        if ($request->has('color')) {
            $query->where('color', $request->input('color'));
        }
        return $query;
    }
}
```

### Step 2: Applying the Filters in the Controller

Now, in your controller, you simply chain these scopes onto the base query. This pattern is highly effective for building complex queries efficiently and is a core concept when working with Eloquent and related services on platforms like [Laravel](https://laravelcompany.com).

```php
// app/Http/Controllers/CatalogController.php

use App\Models\Product;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->priceRange($request) // Apply the price filter logic
            ->color($request)       // Apply the color filter logic
            ->paginate(20);

        return view('catalog.index', compact('products'));
    }
}
```

Notice how we didn't need a custom `filter` method on the model; instead, we created reusable scopes that know how to interact with the query builder based on the incoming `$request`. This separation of concerns makes your code far more readable and easier to maintain.

## Conclusion: The Power of Eloquent Query Building

The key takeaway is that for dynamic filtering in Laravel, prioritize building sophisticated queries using Eloquent's fluent interface rather than trying to cram all conditional logic into a single method on the model. By utilizing **Query Scopes**, you achieve a clean separation between your request handling (Controller) and your data definition (Model), resulting in highly flexible, testable, and scalable e-commerce filtering functionality. Embrace these powerful features of [Laravel](https://laravelcompany.com) to build robust applications.
