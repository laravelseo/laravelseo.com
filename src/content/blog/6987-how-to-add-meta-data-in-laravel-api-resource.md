---
title: "How to add meta data in laravel api resource"
description: "Mastering API Metadata: How to Structure Counts and Custom Data in Laravel Resources As developers building modern front end applications with Laravel APIs,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Keywords", "HTML"]
featured: false
---

As developers building modern front-end applications with Laravel APIs, structuring your responses efficiently is just as important as optimizing your database queries. When dealing with pagination, it’s common to need more context than just the current page items; you often need the total count, summary statistics, or other calculated metadata.

This post dives deep into how you can effectively add comprehensive metadata—like query counts and custom metrics—to your Laravel API resources, moving beyond simple pagination links to deliver a richer experience for your front-end.

## The Challenge: Beyond Basic Pagination

You are using Laravel API Resources to shape your JSON response, which is the correct approach. Your current structure handles standard pagination well: `data`, `links`, and `meta`. However, you need to introduce the total query count and allow for custom metrics like 'conversion rate' within this unified structure.

The goal is to evolve your response from:
```json
{
    "data": [...],
    "links": [...],
    "meta": [...] 
}
```
to a more comprehensive format that includes global statistics.

## Step 1: Calculating the Total Count Efficiently

To include the total number of results without counting the paginated subset, you must perform the count operation directly on the Eloquent query *before* applying any `paginate()` limits. This ensures you get the true total record count from the database.

In your controller method, you can easily retrieve this count:

```php
use App\Models\YourModel;
use Illuminate\Http\Request;

class YourController extends Controller
{
    public function index(Request $request)
    {
        // 1. Get the total count BEFORE pagination
        $totalCount = YourModel::count();

        // 2. Apply standard pagination
        $items = YourModel::paginate(30);

        // 3. Return the data along with the calculated count
        return response()->json([
            'data' => $items->items(),
            'total_count' => $totalCount, // The total result count
            'links' => $items->links(),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $totalCount, // Reusing the total count here for consistency
            ]
        ]);
    }
}
```

By calculating `$totalCount` separately, you ensure that this number is accurate regardless of which page the user is viewing. This practice aligns perfectly with best practices in building robust APIs, a core principle emphasized by Laravel’s philosophy on clean code and efficient data handling found at [https://laravelcompany.com](https://laravelcompany.com).

## Step 2: Restructuring the API Resource for Metadata

Now, we integrate this count into your API Resource. Instead of cluttering the main `meta` array with pagination info, we can create a dedicated `metadata` object to house all supplementary data. This makes the response significantly cleaner and easier for front-end consumers to parse.

Let's assume you are using an API Resource named `YourModelResource`.

```php
// app/Http/Resources/YourModelResource.php

public function toArray($request)
{
    // Get the base data from the item being iterated over
    $data = parent::toArray($request); 

    return [
        'data' => $data,
        'metadata' => [
            'count' => $request->total_count, // Injecting the total count
            'pagination' => [
                'current_page' => $request->current_page ?? null,
                'last_page' => $request->last_page ?? null,
                'per_page' => $request->per_page ?? null,
            ],
            // You can add other global stats here later
        ],
        'links' => $request->links(),
    ];
}
```

## Step 3: Adding Custom Metrics (e.g., Conversion Rate)

To add arbitrary data like `conversion_rate` alongside the count and pagination, you simply pass these values from your controller into the resource. If the conversion rate is a calculated field based on the total data set, calculate it in the controller before passing it to the resource.

For example, if you calculate the overall conversion rate in the controller:

```php
// Inside YourController::index() method...
$totalCount = YourModel::count();
$conversionRate = $totalCount > 0 ? (float) ($totalCount / 100) : 0.0; // Example calculation

return response()->json([
    'data' => $items->items(),
    'total_count' => $totalCount,
    'overall_conversion_rate' => $conversionRate, // New custom metric
    // ... rest of the pagination data
]);
```

And then, in your API Resource, you simply include this new field:

```php
public function toArray($request)
{
    return [
        'data' => parent::toArray($request),
        'metadata' => [
            'count' => $request->total_count,
            'pagination' => [ /* ... pagination details ... */ ],
            'summary' => [
                'conversion_rate' => $request->overall_conversion_rate, // Adding the custom metric
            ]
        ],
        'links' => $request->links(),
    ];
}
```

## Conclusion

By separating your concerns—calculating database totals in the controller, formatting navigation data using built-in pagination methods, and structuring all associated metrics within a dedicated `metadata` object in your API Resource—you achieve a clean, predictable, and highly efficient API contract. This layered approach ensures that your front-end receives exactly the context it needs, whether it’s just the current page items or comprehensive statistics like total counts and conversion rates. Keep leveraging Laravel's ecosystem to build powerful backends!
