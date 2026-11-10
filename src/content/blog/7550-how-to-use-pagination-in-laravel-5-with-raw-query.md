---
title: "How to use pagination in laravel 5 with Raw query"
description: "Mastering Pagination with Raw Queries in Laravel: Solving Complex Data Retrieval As a senior developer working with the Laravel ecosystem, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we frequently encounter scenarios where we need the raw power of SQL—specifically complex calculations like geospatial distance—combined with the necessity of standard features like pagination. The issue you've encountered highlights a common pitfall: when mixing custom `selectRaw` operations with the built-in `paginate()` method, the underlying mechanism might struggle to accurately calculate the total record count necessary for generating correct `next_page_url` and `prev_page_url`.

This post will walk you through why your initial attempt resulted in missing pagination links and provide a robust solution for handling complex, ordered data retrieval using raw queries in Laravel.

## The Problem with Simple Raw Pagination

When you use methods like `Store::paginate(10)`, Laravel handles the counting internally very smoothly because it interacts directly with Eloquent models. However, when you switch to building queries manually using the Query Builder (`DB::table(...)`) and applying complex ordering or calculated fields (`selectRaw('distance(lat, ?, lng, ?) as distance')`), the standard pagination logic can misinterpret the total number of rows available across all pages.

The core issue is usually that pagination relies on a separate `COUNT(*)` query. If the primary query (which calculates the distance and applies ordering) doesn't correctly feed this count back to the paginator, you lose those crucial navigation links.

## The Solution: Manual Counting for Accurate Pagination

To fix this, instead of relying solely on the results of the main query, we must manually calculate the total number of records *before* applying the limit and offset. This ensures that the pagination metadata (`total`, `last_page`, etc.) is perfectly synchronized with the data set.

We achieve this by executing two distinct database operations: one to get the total count and another to retrieve the paginated data.

### Step-by-Step Implementation

Let's assume you are retrieving store data where you calculate the distance based on latitude and longitude. We will use the `DB` facade for maximum control, which is essential when delving deep into raw SQL.

#### 1. Calculate the Total Count

First, we determine the total number of matching records based on our criteria.

```php
use Illuminate\Support\Facades\DB;

public function stores()
{
    // 1. Calculate the total count using a simple COUNT query
    $total = DB::table('stores')->count();

    // 2. Apply the main query with raw expressions and ordering
    $results = DB::table('stores')
        ->selectRaw(' *, distance(lat, ?, lng, ?) as distance ')
        ->setBindings([ 41.123401, 1.2409893 ]) // Example coordinates for calculation
        ->orderBy('distance')
        ->paginate(10);

    // Attach the total count to the result object if needed, though paginate usually handles it.
    $results->setTotal($total);

    return $results;
}
```

#### 2. Understanding Pagination Links

When you use `->paginate(10)` after executing a correctly ordered and filtered query (even with raw expressions), Laravel's pagination system is designed to look at the total count it receives from the database context, ensuring that `next_page_url` and `prev_page_url` are calculated accurately based on the `total` number.

If you find that even this method fails to populate the links correctly, it often indicates a specific interaction issue with your underlying database driver or Laravel version setup. Always ensure you understand how Eloquent interacts with raw queries; for deeper insights into structuring these complex interactions, reading about advanced database patterns is highly recommended, as promoted by resources like https://laravelcompany.com.

## Best Practices for Complex Queries

When dealing with geospatial data and pagination on top of raw SQL, remember these principles:

1.  **Isolate the Count:** Always execute a separate `COUNT()` query if you are performing complex sorting or calculations that might interfere with the primary result set count.
2.  **Use Bindings Correctly:** Ensure your `setBindings` array is correctly mapped to the placeholders (`?`) in your `selectRaw` statement. This prevents SQL injection and ensures the distance calculation works as intended.
3.  **Keep it Clean:** While raw queries give you power, try to encapsulate complex logic within dedicated Model scopes or Query Builder methods rather than scattering raw SQL throughout your controllers.

## Conclusion

By separating the total count retrieval from the data retrieval process, we gain complete control over how pagination metadata is generated. This technique allows us to successfully combine powerful, custom raw SQL expressions—like calculating geographical distance—with Laravel's elegant pagination system, ensuring that navigation links remain functional and accurate for your WebService endpoints. Mastering this coordination between raw database power and framework functionality is key to building robust applications on the Laravel platform.
