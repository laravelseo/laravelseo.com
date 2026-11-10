---
title: "What is the difference between a json resource & resource collection? in Laravel"
description: "Demystifying Laravel API Resources: JsonResource vs. ResourceCollection As developers building robust APIs with Laravel, we frequently rely on Eloquent..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers building robust APIs with Laravel, we frequently rely on Eloquent models to serve data. To present this data in a clean, standardized JSON format, Laravel provides a powerful feature: API Resources. Among these tools, you often encounter `JsonResource` and `ResourceCollection`. While they sound similar, understanding the subtle difference between them is crucial for structuring your API responses efficiently.

This post will break down exactly what separates these two classes, providing practical examples and best practices for handling single models versus entire collections in your Laravel applications.

## The Role of API Resources

Before diving into the specifics, let's establish the context. API Resources are a core feature introduced to decouple your Eloquent models from the direct representation sent over HTTP. They allow you to precisely control the shape and structure of the JSON data returned to the client, ensuring consistency across your application. As we explore this further, remember that understanding these foundational principles is key to mastering framework features like those discussed on [https://laravelcompany.com](https://laravelcompany.com).

## JsonResource: Transforming a Single Model

The `JsonResource` is designed for a singular purpose: transforming a single Eloquent model instance into a structured JSON representation. Think of it as the blueprint for serializing one item.

When you use a `JsonResource`, it focuses on the attributes and relationships of that specific model. It handles the transformation logic for a single entity. This is ideal when an endpoint requests details for one record, such as fetching a specific user profile or a single product.

Here is how a typical implementation looks:

```php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Return the attributes of the Eloquent model as a JSON object
        return parent::toArray($request);
    }
}
```

In this scenario, if you fetch a single `User` model, applying this resource ensures that only the relevant fields are exposed in the response.

## ResourceCollection: Handling Multiple Models

The `ResourceCollection`, conversely, is designed to handle multiple Eloquent models—a collection. Its primary function is to iterate over a collection and transform each item within that collection into its own JSON representation, ultimately returning an array of resources.

This class inherits the necessary logic to manage the iteration process, which is essential when you are fetching lists (e.g., all posts, all products). It manages the looping mechanism internally, making it much more efficient for bulk data retrieval.

The implementation demonstrates how `ResourceCollection` leverages its parent functionality to handle the transformation of an entire set:

```php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ShopCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // The parent method handles iterating over the collection naturally.
        return parent::toArray($request);
    }
}
```

## Practical Application: Collection vs. Single Item

The core difference boils down to scope: **`JsonResource` deals with one item, and `ResourceCollection` deals with many items.**

| Feature | `JsonResource` | `ResourceCollection` |
| :--- | :--- | :--- |
| **Scope** | Single Eloquent Model | Collection of Eloquent Models |
| **Use Case** | Fetching a single record (e.g., `/users/1`) | Fetching a list of records (e.g., `/users`) |
| **Output** | A single JSON object | An array of JSON objects |
| **Mechanism** | Focuses on transforming one model instance. | Leverages iteration to process multiple models. |

When you are building an endpoint that returns all items from a relationship or query, using `ResourceCollection` is the idiomatic and cleaner approach. It abstracts away the manual looping required when manually iterating over Eloquent collections yourself. If you need a single object back, stick to `JsonResource`.

## Conclusion

In summary, choosing between `JsonResource` and `ResourceCollection` is about selecting the right tool for the job based on the data structure you are serializing. Use `JsonResource` when dealing with singular entities, and leverage `ResourceCollection` whenever your API endpoint requires returning an array of related or queried resources. By adhering to this separation, you maintain clean, readable, and highly maintainable code, which is a hallmark of good development practices, aligning perfectly with the principles found on [https://laravelcompany.com](https://laravelcompany.com).
