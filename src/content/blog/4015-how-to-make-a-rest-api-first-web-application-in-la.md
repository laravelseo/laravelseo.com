---
title: "How to make a REST API first web application in Laravel"
description: "How to Build a True API First Web Application in Laravel: A Server Side Rendering Approach As a senior developer, I often encounter the desire to build..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML"]
featured: false
---

As a senior developer, I often encounter the desire to build applications that lean into the "API-first" philosophy—decoupling data from presentation. However, when you decide that your Laravel application should handle the full rendering of HTML views on the server, the architecture shifts slightly. The challenge lies in harmonizing the separation between API endpoints (JSON responses) and traditional web routes (HTML views) without losing control over HTTP response details like status codes and headers.

The approach you outlined—creating separate controllers for API and Web logic—is a valid starting point based on decoupling concerns. However, mixing JSON response handling with view rendering within the same controller hierarchy often leads to complexity, as you correctly noted regarding accessing response metadata.

This post will explore the best architectural patterns in Laravel for achieving an "API-first" feel while prioritizing server-side rendering (SSR), providing a robust alternative to your proposed structure.

## The Philosophy of API First vs. Full Stack Rendering

The term "API first" means treating data as the primary resource, accessible via structured endpoints (like `/api/users`), regardless of how that data will eventually be consumed (JSON for an SPA or HTML for a traditional site). When you opt for server-side rendering, you are essentially asking Laravel to act as both a backend API provider *and* a view engine.

The key is to ensure your routing and controller logic clearly define the intent: Is this route serving data for machine consumption (API) or content for human consumption (Web)?

## A Better Approach: Controller Specialization and View Services

Instead of relying on inheritance where one controller tries to manage both JSON responses and view calls, a cleaner approach is to strictly separate responsibilities. We can achieve your goal by keeping the API routes purely focused on data delivery and using standard Blade rendering for web routes.

### 1. Dedicated API Controllers

Your `UserController` should remain focused solely on fetching Eloquent models and returning structured JSON responses. This adheres perfectly to the API-first principle.

```php
// app/Http/Controllers/UserController.php (API Focus)
class UserController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);
        // Return a pure JSON response for consumption by external clients
        return response()->json([
            'success' => true,
            'user' => $user->toArray(),
        ]);
    }
}
```

### 2. Dedicated Web Controllers (The View Layer)

The web controller should handle the presentation logic. When a web request comes in, it fetches the necessary data (either directly or by calling the API layer) and hands it off to the Blade view. This eliminates the need for controllers to manage `JsonResponse` objects directly.

For fetching user details for a webpage:

```php
// app/Http/Controllers/WebUserController.php (Web Focus)
class WebUserController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);

        // Fetch data needed for the view
        $data = $user->toArray();

        // Return a standard Blade view, which handles all response headers automatically
        return view('user.view', ['data' => $data]);
    }
}
```

### 3. Routing Separation

By separating the routes clearly, Laravel manages the request flow naturally:

```php
// routes/web.php (For HTML rendering)
Route::get('/user/{id}', 'WebUserController@show');

// routes/api.php (For JSON data delivery)
Route::prefix('api')->group(function () {
    Route::resource('user', 'UserController');
});
```

## Why This Design Solves the Problem

By separating the concerns, you achieve clarity and avoid the pitfalls of mixing response types:

1.  **Clear Responsibility:** The `UserController` is an API provider (JSON). The `WebUserController` is a presentation layer handler (HTML). This separation makes debugging easier.
2.  **Correct Response Handling:** When the `WebUserController` returns a `view()`, Laravel automatically handles setting the correct `Content-Type: text/html` header and status code (200 OK). You are no longer wrestling with the internal properties of `JsonResponse`.
3.  **Scalability:** If you later decide to serve this data via a mobile app, you reuse the existing `UserController` logic directly for the `/api/user` route. The web layer remains focused purely on rendering the interface.

## Conclusion

The notion of an "API-first" application in Laravel does not require forcing all logic into one monolithic controller or relying on complex response object manipulation. Instead, it requires disciplined separation of concerns: use dedicated routes and controllers for their specific job—data delivery via JSON (API) and content rendering via Blade (Web). This pattern keeps your application clean, maintainable, and fully leverages Laravel's strengths in handling both backend logic and presentation seamlessly. Remember that mastering Eloquent relationships and routing structure is fundamental to building powerful applications on the Laravel framework.
