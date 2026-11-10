---
title: "Laravel API resourceCollection using array rather than model"
description: "Laravel API Resource Collection: Handling Raw Arrays from Adapters As developers building complex APIs in Laravel, one of the core principles we strive for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As developers building complex APIs in Laravel, one of the core principles we strive for is decoupling our presentation layer (Controllers and Resources) from our data persistence layer (Eloquent Models). Using an Adapter pattern to abstract Eloquent queries into a separate service layer is a fantastic approach for testability and flexibility. However, this abstraction introduces subtle challenges when dealing with the specific mechanisms of Laravel’s powerful API Resources and Resource Collections.

This post dives into a common stumbling block: how to correctly use `ResourceCollection` when the input data is an array returned directly from an adapter instead of an Eloquent collection. We will address the fatal error you encountered and provide a robust solution for handling raw arrays in your resource transformations.

## The Decoupling Strategy: Models vs. Arrays

Your goal is to ensure that future adapters can return simple arrays, making them easier to implement. You achieved this by modifying your adapter layer to use `->toArray()` on Eloquent results.

For a single resource, this worked perfectly:

```php
// Adapter returns an array
public function findById(int $id){
    return TodoModel::findOrFail($id)->toArray(); // Returns array
}
```

However, when dealing with collections, the issue arises because `Illuminate\Http\Resources\ResourceCollection` is fundamentally designed to operate on an Eloquent collection object. When you pass a raw PHP array into it, the internal methods like `map()` or accessing `$this->collection` expect specific Eloquent behaviors, leading to errors like `"Call to a member function first() on array"`.

## The Solution: Adapting Resource Collections for Array Input

To resolve this, we need to adjust the logic within your `ResourceCollection` to gracefully handle both Eloquent collections (which are objects) and raw arrays. We can achieve this by checking the type of the input before attempting collection operations.

The key is to ensure that when processing an array, we treat it as a collection of items directly, rather than trying to call methods on the array itself.

### Refactoring the `TodoCollection`

Instead of assuming `$this->collection` is always a collection object, we will iterate over the input if it’s an array. This approach ensures that whether you are working with Eloquent results or adapter results, the final output format remains consistent—a clean array structure.

Here is how you can refactor your `TodoCollection` to handle both scenarios:

```php
use Illuminate\Http\Resources\Json\ResourceCollection;

class TodoCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array, handling both Eloquent collections and arrays.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if (is_array($this->collection)) {
            // Case 1: Input is a raw array from the adapter
            return [
                'data' => $this->collection, // Return the array directly as 'data'
            ];
        }

        // Case 2: Input is an Eloquent Collection (the standard case)
        return [
            'data' => $this->collection
                  ->map(fn ($item) => $item->toArray()) // Map over models to their array representation
                  ->all()
        ];
    }
}
```

### Controller Usage Remains Clean

With this change, your controller code remains clean and decoupled:

```php
public function index(Request $request)
{
    // The adapter returns an array now
    $todos = $this->todoAdapter->getAllForUserId(Auth::id(), 'created_by', 'desc', self::DEFAULT_PAGINATE);
    
    // Passing the raw array to the ResourceCollection works seamlessly
    return new TodoCollection($todos); 
}
```

## Conclusion: Embracing Flexibility in Laravel Architecture

This scenario perfectly illustrates the power of abstraction. While Laravel’s built-in tools are highly optimized for working with Eloquent models, true architectural flexibility requires us to build our own bridges to handle diverse data sources. By inspecting the input type within your API Resources and Collections, you move from brittle code that only understands Eloquent objects to resilient code that can adapt to any structured data format provided by your service layer.

By applying this principle of defensive programming—checking types before execution—you ensure that your system remains robust, regardless of whether you are fetching data via a standard Eloquent query or through a custom adapter implementation. Always strive for flexible architecture, which is central to effective Laravel development, as championed by the community at [https://laravelcompany.com](https://laravelcompany.com).
