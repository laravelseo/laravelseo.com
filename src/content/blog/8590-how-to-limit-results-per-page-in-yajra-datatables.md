---
title: "How to limit results per page in Yajra datatables"
description: "Mastering Server Side Pagination in Yajra DataTables: The Performance Fix As a senior developer working with Laravel applications, dealing with large..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "JavaScript"]
featured: false
---

As a senior developer working with Laravel applications, dealing with large datasets is a common challenge. When integrating DataTables with server-side processing, the goal is always to push the heavy lifting—the filtering and pagination logic—to the database server rather than overloading the client-side JavaScript.

You’ve hit a very common performance bottleneck when implementing server-side data loading with Yajra DataTables. The issue you are facing stems from a misunderstanding of where the true limiting mechanism needs to reside: on the client side versus the server side.

This post will dive into why your current setup isn't achieving optimal performance and show you the correct, robust way to limit results per page using Yajra and Laravel.

## The Performance Pitfall: Client-Side vs. Server-Side Control

You are currently setting `pageLength: 10` in your JavaScript configuration:

```javascript
"pageLength": 10,
```

And you are expecting the server to handle the slicing. However, when using server-side processing (where `"serverSide": true` is set), the DataTables library sends requests for specific pages and lengths to the server via AJAX. If your controller simply fetches *all* results (`$results`) and lets the client-side JavaScript try to cut them up, you are still pushing potentially thousands of records over the network unnecessarily. This defeats the entire purpose of server-side processing, which is to minimize data transfer.

The solution lies in ensuring that **the database query itself limits the number of rows returned.** The backend must be responsible for calculating *which* subset of data corresponds to the requested page number.

## The Correct Approach: Limiting Results in the Controller

To achieve true server-side pagination, you must incorporate the `start` (or `page`) and `length` parameters received from the frontend into your Eloquent query within your controller method. This ensures that only the necessary subset of data is retrieved from the database for each request.

Here is how you adjust your backend logic to handle pagination correctly:

### 1. Receiving Pagination Parameters

When DataTables requests data, it sends specific parameters (usually via the `request` object in a server-side handler) indicating which page and how many items are needed. You must access these values in your controller.

### 2. Implementing Limiting Logic

Instead of fetching everything, you will use Eloquent's built-in pagination methods or manual `where` clauses combined with `limit()` and `offset()`.

Let’s assume you are querying a relationship or a model where `$results` is the full collection:

```php
// Example Controller Method (e.g., in your Laravel route handler)

use App\Models\YourModel; // Assuming you have a model

public function index(Request $request)
{
    // 1. Get pagination parameters from the request
    $perPage = $request->input('length', 10); // Default to 10 if not specified
    $page = $request->input('start', 0);      // Start index (often used by Yajra/DataTables)

    // 2. Perform the query with LIMIT and OFFSET
    $results = YourModel::orderBy('created_at', 'desc')
                      ->limit($perPage)
                      ->offset($page)
                      ->get();

    // 3. Format the response for Yajra DataTables
    return Datatables::of($results)->make(true);
}
```

### Integrating with Eloquent Pagination (The Laravel Way)

While manually using `limit()` and `offset()` works, the most idiomatic and often cleanest way in Laravel is to use the built-in `paginate()` method. When you use `paginate()`, Laravel handles all the necessary SQL limiting internally when used within a server-side context.

If your data fetching is based on relationships or standard Eloquent models, you can simplify this significantly:

```php
// Using Eloquent's paginate() method
public function index(Request $request)
{
    $perPage = $request->input('length', 10);

    // Use paginate to handle the limiting automatically
    $results = YourModel::orderBy('created_at', 'desc')
                      ->paginate($perPage); // This handles the LIMIT and OFFSET for you!

    // Return the paginated data structure expected by Yajra
    return Datatables::of($results)->make(true);
}
```

By using `$model->paginate($perPage)`, Laravel generates the correct SQL `LIMIT` and `OFFSET` clauses. This ensures that the database only sends back the 10 or 25 records requested for that specific page, drastically reducing payload size and improving application performance—a core principle of efficient data access in any robust framework like Laravel.

## Conclusion: Efficiency Through Server Control

The key takeaway is this: **never rely solely on client-side JavaScript to manage database limits.** When working with DataTables and server-side processing, the controller must enforce the pagination constraints. By shifting the responsibility for limiting records to the backend using Eloquent's `paginate()` method or explicit `limit()`/`offset()` calls, you ensure data efficiency, scalability, and a much snappier user experience. This practice aligns perfectly with building scalable applications on the Laravel framework.
