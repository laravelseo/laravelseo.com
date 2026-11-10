---
title: "How to determine where a request is coming from in a REST api"
description: "How to Determine Where a Request is Coming From in a REST API Building a flexible RESTful API often requires serving different types of clients—mobile..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

Building a flexible RESTful API often requires serving different types of clients—mobile applications, web browsers, third-party services, and internal scripts. A common challenge developers face is determining the *context* of the request so the API can return the appropriate format (JSON for machines vs. HTML/Views for browsers).

If you are using Laravel, this differentiation often boils down to inspecting the incoming HTTP request headers or the client's IP address. As a senior developer, I recommend moving beyond simple guesswork and implementing robust, scalable detection mechanisms.

## The Challenge: API Polymorphism

Your scenario perfectly illustrates the need for polymorphic responses. You want your endpoint `/tables` to behave differently based on whether it’s queried by an Android app (expecting pure JSON) or a web browser (expecting a rendered view).

The initial approach you suggested—checking a custom flag within the controller—is functional but can lead to tightly coupled and brittle code. A more architectural approach involves inspecting request metadata directly, which keeps your controllers cleaner and adheres better to SOLID principles.

## Methods for Request Source Detection

There are several ways to infer the client type, ranging from simple header checks to more complex authentication methods:

### 1. Inspecting HTTP Headers (The Standard Approach)

The most common way to identify a browser versus an application is by looking at the `User-Agent` header. Web browsers send detailed strings identifying their software and operating system, whereas native applications often send simpler or custom headers.

You can access these via the global `Request` object in Laravel:

```php
// In your controller method
$userAgent = request()->header('User-Agent');

if (str_contains($userAgent, 'Android')) {
    // Assume Android/Mobile client
    return Response::json($tables);
} elseif (str_contains($userAgent, 'Mozilla')) {
    // Assume Web Browser
    return View::make('table.index')->with('tables', $tables);
} else {
    // Default fallback
    return Response::json($tables);
}
```

**Caveat:** Relying solely on `User-Agent` can be unreliable. Some mobile apps or proxies might spoof this header, making it an insufficient method for critical security decisions.

### 2. Using Custom Headers (The Robust Approach)

For more reliable differentiation, establish a convention where clients explicitly declare themselves upon connection. This is often superior for API design.

Instead of guessing based on the User-Agent, mandate that mobile apps send a specific header, such as `X-Client: android` or `Accept: application/vnd.myapp+json`.

```php
// Checking a custom header
$clientType = request()->header('X-Client');

if ($clientType === 'android') {
    return Response::json($tables); // For Android
} elseif ($clientType === 'web') {
    return View::make('table.index')->with('tables', $tables); // For Web Browser
} else {
    // Handle unknown or default clients
    return Response::json($tables);
}
```

### 3. Leveraging Routing and Subdomains (Architectural Separation)

For larger systems, the most scalable solution is often architectural separation rather than runtime inspection. You can segregate your concerns by routing:

*   **Web Frontend:** Route all requests starting with `/web/*` to a dedicated set of controllers that exclusively return views.
*   **Mobile Backend (Pure API):** Route all other requests (e.g., `/api/*`) to controllers designed strictly for JSON responses.

This approach leverages Laravel’s routing system effectively, ensuring that the logic for rendering HTML is completely separate from the logic for serving pure data, which aligns perfectly with how robust applications are structured in the Laravel ecosystem.

## Conclusion: Prioritizing API Clarity

While runtime inspection using headers can solve immediate problems, the long-term best practice is to design your API structure to minimize reliance on client identity checks within business logic. Focus on clear separation of concerns. Use routing and custom headers for signaling intent, allowing your controllers to focus purely on data retrieval and structuring, which makes the entire application more maintainable and scalable. If you are building complex services on top of Laravel, understanding how to leverage Eloquent relationships and robust request handling is key to success.
