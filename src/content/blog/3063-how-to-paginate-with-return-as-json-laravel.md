---
title: "How to paginate with return as json laravel"
description: "How to Paginate with JSON Response in Laravel: Solving the links does not exist Error As a senior developer working with Laravel, building robust APIs..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "Errors"]
featured: false
---

As a senior developer working with Laravel, building robust APIs often involves handling pagination alongside JSON responses. The scenario you've described—getting an error like `Method links does not exist` when trying to use pagination links in a JSON response—is extremely common. It highlights a mismatch between how Laravel renders views (Blade) and how it structures data for API consumption (JSON).

This post will walk you through the correct way to implement pagination in Laravel when returning a JSON response, ensuring your controller logic is clean and your data structure is consumable by both APIs and views.

## Understanding the Conflict: Paginator vs. JSON

The error you are encountering stems from how Eloquent paginators interact with the view layer versus the API layer.

When you use `$model->paginate(5)`, you retrieve a `LengthAwarePaginator` object. This object is designed to be used within a Blade template, where methods like `links()` are available to generate the HTML pagination links. However, when you wrap this entire paginator object directly into a JSON response using `response()->json([...])`, the framework doesn't automatically translate that paginator object into a format that the browser understands as actionable navigation links.

The core issue is: **You should separate the data payload from the pagination metadata when building an API.**

## Solution 1: Structuring the API Response Correctly

For API development, the best practice is to return only the requested data and explicitly provide the necessary navigation information (the URLs) separately, or structure the response to include the pagination links directly within the JSON object.

Let's refactor your controller method to achieve this separation. Instead of returning the full paginator object directly, we will extract the items and the links.

### Refactored Controller Code

We can leverage the `->toArray()` method on the paginator object to get an array representation that is easier to handle in JSON.

```php
use App\Models\Customer;
use Illuminate\Http\Request;

public function getcustomer($id)
{
    // 1. Find the customer and paginate them
    $customer = Customer::find($id)->paginate(5);

    // 2. Format the data for JSON response
    $data = $customer->toArray();

    // 3. Return the structured response, including links
    return response()->json([
        'data' => $data,
        'links' => $customer->links()->toArray() // Extract the links separately
    ], 200);
}
```

### Explanation of Changes

1.  **`$customer->toArray()`**: This converts the paginator object into a standard PHP array, which serializes perfectly into JSON.
2.  **`$customer->links()->toArray()`**: We explicitly call `links()` to get the pagination structure and then convert it to an array. This ensures that the response contains the actual page URLs that the frontend needs to build navigation, rather than trying to execute Blade-specific methods on a raw paginator object.

## Solution 2: Handling Pagination in Blade Views (The Standard Path)

If you are building a standard web application view (not purely an API), the original approach is generally correct, provided the controller is returning the full Eloquent result set or paginator directly to the view. The error usually happens when mixing these concerns improperly.

In your Blade file:
```html
{{-- This works correctly if $customer is a valid Paginator object --}}
<div class="pagination">
    {{ $customer->links('vendor.pagination.pagination') }}
</div>
```
The key here is that the `$customer` variable *must* be the paginator object returned by the controller, allowing the `links()` method to execute correctly within the Blade context.

## Conclusion: API Design vs. View Rendering

When dealing with Laravel and JSON responses, remember the distinction between building a **View** and building an **API**.

1.  **For Views:** Return the full Eloquent model or paginator object, allowing Blade to handle the rendering of HTML elements like pagination links.
2.  **For APIs (JSON):** Always structure your response explicitly. Extract the data payload (`data`) and the navigation metadata (`links` or `meta`). This separation makes your API predictable, easier for frontends to
