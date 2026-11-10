---
title: "What is the difference between a JsonResource & ResourceCollection? in Laravel v6 or v7"
description: "What is the Difference Between a JsonResource and ResourceCollection in Laravel? As developers working with Laravel APIs, one of the most powerful tools for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel APIs, one of the most powerful tools for structuring your data responses is the Eloquent Resource system. When you start building APIs, you quickly realize that simply returning an Eloquent model often results in verbose, unnecessary data exposure. Laravel Resources solve this by allowing you to transform your models into clean, specific JSON structures.

However, when dealing with collections of data versus single records, you encounter two distinct classes: `JsonResource` and `ResourceCollection`. Understanding the subtle but important difference between these two is crucial for building efficient, readable, and maintainable API layers.

## The Foundation: Laravel Resource Classes

Before diving into the specifics, let’s establish the context. Both `JsonResource` and `ResourceCollection` extend a base class designed to handle data transformation. Their primary function is to intercept an Eloquent model (or collection) and format it exactly how your API expects it—typically as a clean array suitable for JSON serialization.

The core mechanism they both rely on is the `toArray()` method, which dictates how the final data structure is built. The difference lies in *what* they process: one handles a single item, and the other handles an entire set.

## Deep Dive: JsonResource (For Single Models)

The `JsonResource` is designed to handle the transformation of a **single Eloquent model** into a JSON-friendly format. It is your go-to tool when you are fetching or displaying one record at a time.

### Use Case
Use `JsonResource` when your controller method is retrieving a single resource (e.g., fetching a user by ID) and you want to shape that single model into a specific response format.

**Example:** Transforming a single `Shop` model.

```php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Shop extends JsonResource
{
    /**
     * Transform the resource into an array.
     * This method formats the single model data for the API response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Return the data from the model, formatted according to your needs.
        return parent::toArray($request);
    }
}
```

When you use this resource in a controller, it ensures that only the necessary fields from that one shop object are exposed in the final JSON output. This promotes strong separation of concerns, which is a core principle when architecting robust APIs, much like the principles emphasized on sites like [laravelcompany.com](https://laravelcompany.com).

## Deep Dive: ResourceCollection (For Multiple Models)

The `ResourceCollection`, conversely, is built specifically to handle **collections**—an Eloquent collection of multiple models. This class extends the functionality of `JsonResource` but adapts it to iterate over an entire set of data.

### Use Case
Use `ResourceCollection` when your controller method retrieves a list of resources (e.g., fetching all products, paginated results), and you need to transform that entire collection into a structured array suitable for an API response.

**Example:** Transforming a collection of `Shop` models.

```php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ShopCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array of resources.
     * This method iterates over all items in the collection.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Use the parent method to handle the iteration over the collection.
        return parent::toArray($request);
    }
}
```

This class is essential for handling pagination or listing endpoints. Instead of manually looping through 50 models in your controller, `ResourceCollection` handles the iteration efficiently within the resource layer. This approach keeps your business logic clean and adheres to SOLID principles by keeping presentation logic separate from data access.

## Summary: JsonResource vs. ResourceCollection

| Feature | `JsonResource` | `ResourceCollection` |
| :--- | :--- | :--- |
| **Purpose** | Transforms a **single** Eloquent Model. | Transforms an entire **Eloquent Collection**. |
| **Input** | A single model instance. | An array or collection of model instances. |
| **Output Format** | A single structured object/array response. | An array containing multiple resource objects/arrays. |
| **Typical Use** | `GET /shops/{id}` (Single Item) | `GET /shops` or `GET /shops?page=2` (List/Collection) |

In essence, think of it this way: if you are dealing with one item, use `JsonResource`. If you are dealing with a list of items, use `ResourceCollection`. By mastering these two classes, you elevate your Laravel API development from simple data retrieval to sophisticated, scalable data presentation. Start leveraging these tools today to build cleaner APIs!
