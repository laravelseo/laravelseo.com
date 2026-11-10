---
title: "Laravel 5.3 - How to log all queries on a page?"
description: "Laravel 5.3: How to Log All Queries on a Page for Performance Tracking Dealing with scattered database queries across controllers, view composers, and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance"]
featured: false
---

Dealing with scattered database queries across controllers, view composers, and services is a common challenge in large-scale applications. As you've experienced, when tracking performance and debugging slow load times, knowing exactly which queries are running where is essential. In Laravel, the way you approach logging query execution depends entirely on *when* you need the data.

This guide will walk you through the correct architectural approach to capturing every executed query in a single request lifecycle, ensuring you can diagnose bottlenecks effectively.

## Understanding the Query Logging Mechanism

The core mechanism Laravel provides for tracking queries is the `DB::enableQueryLog()` method. This method doesn't log the queries immediately; rather, it activates a logging mechanism that records all subsequent database interactions performed during that request.

To retrieve these recorded queries, you use the corresponding method, `DB::getQueryLog()`. The key is understanding the scope: enabling the log must happen *before* any query runs, and retrieving the data must happen *after* all queries have completed execution but before the response is sent to the user.

## Where to Place the Logging Logic

The placement of this code dictates whether you capture only the queries executed by a specific action or the entire request's history. For logging **all** queries on a page, the best place is within the request handling scope—typically in your controller or an initiating service.

### Strategy 1: Request-Scoped Logging (The Recommended Approach)

Since you want to track everything happening during a single page load, you should initiate the log at the very beginning of the process and retrieve the results at the end. This ensures that any query initiated by controllers, view composers accessing models, or lazy loading within views is captured.

Here is a conceptual example for a controller method:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PerformanceController extends Controller
{
    public function index(Request $request)
    {
        // 1. Enable Query Logging immediately at the start of the request scope.
        DB::enableQueryLog();

        // --- All your application logic, controllers, and view rendering happens here ---
        $data = \App\Models\Post::with('comments')->get();
        
        // Simulate some lazy loading work that might trigger more queries
        $post1 = $data[0];
        $post1->comments; 

        // ... render the view ...
        return view('dashboard', ['posts' => $data]);
    }

    public function showQueries()
    {
        // This endpoint would be used to expose the logged data.
        $queries = DB::getQueryLog();
        return response()->json($queries);
    }
}
```

**Why this placement works:** By calling `DB::enableQueryLog()` early, you establish a context for the entire request. When the framework executes subsequent database calls (whether in the controller, middleware, or even within Eloquent relationships called by view composers), those queries are automatically recorded in the log buffer.

## Handling Scattered Queries and Performance

While enabling logging at the start captures everything, it doesn't solve the problem of *where* the query originated. If you are tracking performance across deeply nested components (like lazy loading in views or complex service calls), simply dumping the logs might result in overwhelming output.

### Strategy 2: Contextual Logging with Eloquent Events

For truly granular tracking, especially when dealing with services and composers, consider using Eloquent Model Events or custom Service Providers to wrap critical data access points. This allows you to log specific queries tied directly to a business operation rather than just dumping raw SQL strings. Furthermore, for large projects, adopting best practices outlined by the Laravel team, such as leveraging dedicated monitoring tools alongside logging, provides a more robust solution for long-term performance management.

For instance, if a specific service method is known to be slow, you can wrap that method with custom timing logic:

```php
// Example within a Service class
public function findPostsAndComments()
{
    $startTime = microtime(true);
    
    DB::enableQueryLog(); // Enable logging for this specific operation
