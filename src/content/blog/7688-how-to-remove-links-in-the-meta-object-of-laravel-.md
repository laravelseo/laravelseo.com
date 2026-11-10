---
title: "How to remove links in the meta object of Laravel paginate response?"
description: "How to Remove Links in the Meta Object of a Laravel Pagination Response Developing robust APIs with Laravel often involves handling pagination, and while..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

Developing robust APIs with Laravel often involves handling pagination, and while Laravel provides excellent default functionality, customizing the resulting JSON structure for specific use cases—like purely data-driven endpoints—is a common requirement. You are encountering this issue because Laravel's standard `paginate()` method automatically embeds pagination links within the `links` array inside the `meta` object.

As a senior developer, I can tell you that the best approach is not to try and break the core pagination mechanism, but rather to intercept and transform the data *after* it has been retrieved from Eloquent, ensuring your API response aligns perfectly with your application's needs.

Let’s dive into why this happens and how you can clean up your response, especially when using Laravel Resources.

## Understanding the Default Pagination Structure

When you use `Entity::paginate($pageSize)`, Laravel generates a standard pagination structure for navigation (next, previous links) and metadata (current page, total pages). This information is bundled together in the `links` array within the parent `meta` object.

Your current setup uses an `EntityCollection` resource to transform the data:

```php
// EntityCollection example showing the issue
public function toArray($request)
{
    return [
        'data' => $this->collection,
    ];
}
```

When this is combined with the pagination object, Laravel adds the unwanted link structure. To remove these links entirely and provide only the raw data payload, we need to explicitly control what gets returned in your resource transformation layer.

## Solution: Customizing the Resource Transformation

The most effective place to modify the final response structure is within your Resource class, specifically by ensuring you only expose the necessary data fields and discard the pagination metadata.

Since you want *only* the data array (`data`) and not the complex pagination links, you should adjust how you build the output in `toArray()`.

Here is how you can refine your `EntityCollection` to strip away the unwanted structure:

```php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class EntityCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array, excluding pagination links.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Return only the 'data' payload, explicitly ignoring the default 'links' and 'meta'.
        return [
            'data' => $this->collection,
        ];
    }
}
```

By modifying `toArray()` to return only `'data'`, you effectively override Laravel’s default behavior of including pagination links in the response structure. This practice aligns perfectly with modern API design principles, ensuring your endpoints serve exactly what they promise—the data—without unnecessary navigational clutter.

## Best Practice: Controlling Pagination Output

While customizing the Resource is effective for transforming data, another powerful technique involves controlling how pagination data is exposed from the controller level. If you are building a strict API endpoint and do not need the standard Laravel link structure (`links` or `meta`), consider using Laravel's built-in methods to format the response explicitly.

For complex API responses, understanding Eloquent relationships and query builders—as advocated by resources like [laravelcompany.com](https://laravelcompany.com)—is crucial for efficient data retrieval. When dealing with API construction, always aim for clarity and minimal payload size. If you find yourself needing intricate control over the pagination object itself, exploring custom Paginators allows you to completely redefine how links are generated or suppressed before they ever reach the response layer.

## Conclusion

To successfully remove the default links in the `meta` object of your Laravel paginate response, the most practical solution is to customize the output within your Eloquent Resource class's `toArray()` method, ensuring you only expose the desired data payload (the `data` collection). This keeps your resource transformation clean and gives you full control over the final JSON structure. By mastering these transformations, you ensure your API remains lean, predictable, and highly performant.
