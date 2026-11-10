---
title: "Laravel pagination with API resources"
description: "Laravel Pagination with API Resources: Achieving Consistent JSON Responses As developers building APIs with Laravel, managing how pagination data is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As developers building APIs with Laravel, managing how pagination data is structured is a common hurdle. We often find that the raw output from Eloquent's `paginate()` method looks very different depending on whether it’s returned directly or wrapped within an API Resource. This inconsistency can lead to messy client-side handling and maintenance issues.

The core issue isn't necessarily what Laravel does, but how we choose to format that data for consumption by external services. As a senior developer, my goal is always to enforce a predictable contract. Let’s dive into the differences and, more importantly, how to unify these structures so your API responses are clean, consistent, and easy to consume.

## The Two Forms of Pagination Data

Laravel provides two primary ways to handle pagination data: returning the raw Paginator object, or wrapping it within an API Resource. These methods yield fundamentally different JSON structures.

### 1. Raw Paginator Output (The Default)

When you return the paginator directly from a controller method, Laravel provides detailed navigation information directly in the response payload. This is useful for full-stack applications where the frontend needs to manage navigation explicitly.

```php
// Controller Example
public function index(Request $request)
{
    $query = User::where('status', 'active');
    return $query->paginate(request('per_page'));
}
```

**Returned Structure (Raw Paginator):**
This structure contains all the links, current state, and total counts directly:

```json
{
    "current_page": 1,
    "data":[...],
    "first_page_url": "http://user-service.test/api/users?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://user-service.test/api/users?page=1",
    "next_page_url": null,
    "path": "http://user-service.test/api/users",
    "per_page": 15,
    "prev_page_url": null,
    "to": 10,
    "total": 10
}
```

### 2. Paginator Output via API Resource (The Preferred API Way)

When you wrap the paginator inside an API Resource (like a `UserCollection`), the output is typically formatted to adhere to RESTful principles, embedding navigation links under a standardized key like `links` and metadata under `meta`.

```php
// Controller Example using API Resource
public function index(Request $request)
{
    $paginator = User::where('status', 'active')->paginate(request('per_page'));
    return new UserCollection($paginator); // Assuming UserCollection handles the formatting
}
```

**Returned Structure (API Resource):**
This structure separates the data from the navigation links:

```json
{
    "data":[...],
    "links": {
        "first": "http://user-service.test/api/users/searches?page=1",
        "last": "http://user-service.test/api/users/searches?page=6",
        "prev": null,
        "next": "http://user-service.test/api/users/searches?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 6,
        "path": "http://user-service.test/api/users/searches",
        "per_page": "1",
        "to": 1,
        "total": 6
    }
}
```

## Achieving Consistent Pagination Structure

You are right to want the same structure for both scenarios. The solution is to move the responsibility of formatting the pagination data into a dedicated layer—the API Resource. This forces consistency and separates concerns: the controller handles data fetching, and the Resource handles data presentation.

Instead of letting the paginator object dictate the final JSON shape, you must manually map the necessary pagination properties into your desired structure within the Resource.

### Best Practice: Customizing the API Resource

To achieve a unified response, create or modify your API Resource to explicitly construct the `links` and `meta` objects from the underlying paginator data instead of relying on Laravel's default serialization. This pattern is fundamental when building robust APIs with Laravel.

Here is a conceptual example of how you would ensure consistency within your Resource:

```php
// app/Http/Resources/UserCollection.php

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;

class UserCollection extends Resource
{
    public function toArray($request)
    {
        $paginator = $this->whenLoaded('paginator', $this->paginator); // Access the paginator data

        // 1. Extract Data
        $data = $paginator->items();

        // 2. Manually Construct Links (Mapping for consistency)
        $links = [
            'first' => $paginator->links()->first,
            'last' => $paginator->links()->last,
            'prev' => $paginator->links()->previous,
            'next' => $paginator->links()->next,
        ];

        // 3. Manually Construct Meta (Mapping for consistency)
        $meta = [
            'current_page' => $paginator->currentPage(),
            'from' => $paginator->firstItem(),
            'last_page' => $paginator->lastItem(),
            'path' => $paginator->path(),
            'per_page' => $paginator->perPage(),
            'to' => $paginator->lastItem(),
            'total' => $paginator->total(),
        ];

        return [
            'data' => $data,
            'links' => $links,
            'meta' => $meta,
        ];
    }
}
```

By implementing this explicit mapping within the Resource, you ensure that regardless of whether the data originated from a raw query or an API collection method, the final JSON response adheres to your exact specification. This approach keeps your code clean and makes your API contract predictable—a key principle when developing scalable applications on the Laravel framework.

## Conclusion

The disparity in pagination structure stems from using two different architectural approaches: direct data return versus resource-based presentation. To resolve this, avoid relying on default serialization. Instead, leverage the power of Laravel's Eloquent paginator and use your API Resources as a controlled transformation layer. By explicitly building the `links` and `meta` structures within your Resource, you gain complete control over the final JSON output, ensuring consistency across all endpoints. This practice is essential for building maintainable and predictable APIs.
