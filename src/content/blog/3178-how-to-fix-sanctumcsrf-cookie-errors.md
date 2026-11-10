---
title: "How to fix /sanctum/csrf-cookie errors"
description: "How to Fix /sanctum/csrf cookie Errors in Laravel Sanctum with React (CORS Deep Dive) Developing modern applications often involves connecting a decoupled..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

Developing modern applications often involves connecting a decoupled frontend (like React) to a powerful backend API (like Laravel). When using Laravel Sanctum for token-based authentication, setting up Cross-Origin Resource Sharing (CORS) correctly is crucial. A common stumbling block developers face is the error you encountered: `Access to XMLHttpRequest at 'http://localhost:8000/sanctum/csrf-cookie' from origin 'http://localhost:3000' has been blocked by CORS policy: Request header field x-xsrf-token is not allowed by Access-Control-Allow-Headers in preflight response.`

This post will dissect why this error occurs and provide a comprehensive, practical solution to ensure your Sanctum CSRF cookie exchange works seamlessly between your React frontend and Laravel backend.

---

## Understanding the CORS and Sanctum Conflict

The error message clearly indicates a conflict between the browser's security policies (CORS) and how Laravel Sanctum is configured to handle token requests.

When your frontend initiates a request to `/sanctum/csrf-cookie` (which is typically a preflight `OPTIONS` request before the actual POST), the browser checks if the server will allow that cross-origin communication.

1.  **The Request:** The browser sends an `OPTIONS` request to the Laravel endpoint, asking, "Is it safe for `http://localhost:3000` to access this?"
2.  **The Server Response:** The server must respond with CORS headers (like `Access-Control-Allow-Origin`) and crucially, specify which request headers are permitted in the actual response using `Access-Control-Allow-Headers`.
3.  **The Sanctum Requirement:** Sanctum requires specific headers, most importantly `X-CSRF-Token`, to be passed during this exchange. If your CORS configuration is too restrictive, it omits this necessary header from the `Access-Control-Allow-Headers` list, causing the browser to block the request immediately.

The provided configurations—especially your custom `CorsMiddleware` and the Sanctum setup in `Sanctum.php`—need careful alignment to satisfy both Laravel's security needs and the browser's CORS requirements.

## Step-by-Step Solution

To resolve this, we need to ensure that your CORS middleware explicitly allows all necessary headers required by Sanctum, including the custom CSRF token header.

### 1. Reviewing the CORS Middleware Configuration

The most likely culprit lies within your custom `CorsMiddleware` implementation (referenced in your `Sanctum.php`). You must modify this middleware to include `X-CSRF-Token` in the allowed headers response.

If you are using a package or custom implementation, ensure that the configuration allows for dynamic header inclusion. For robust CORS handling in Laravel projects, understanding how middleware interacts with HTTP verbs and headers is key, aligning with best practices seen on sites like [laravelcompany.com](https://laravelcompany.com).

### 2. Adjusting `routes/cors.php` (or Middleware Logic)

Although you provided a configuration snippet for `cors.php`, the fix often happens in how that configuration translates to actual headers sent back during preflight checks.

Ensure your CORS setup explicitly permits the necessary headers:

```php
// Example adjustment within your CORS logic or middleware setup
$allowedHeaders = [
    'Origin',
    'Content-Type', 
    'Accept',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token', // <-- THIS IS THE CRITICAL HEADER FOR SANCTUM
];

// Ensure the response includes these headers for preflight requests (OPTIONS)
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'register', 'login'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => ['*'], // Adjust this for production security!
    'allowed_headers' => $allowedHeaders,
    // ... other settings
];
```

### 3. Verifying Sanctum Statefulness and Domains

Your `Sanctum.php` configuration correctly defines the stateful domains:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
```

While this section looks correct for local development (`localhost:3000` and `localhost:8000`), ensure that your `.env` file correctly sets `APP_URL` to match the expected host, which is vital for Sanctum's cookie-based sessions to function properly across domains.

## Best Practices Summary

Fixing CORS issues is rarely about a single line change; it’s about aligning server expectations with browser security protocols. Always treat your API as a separate service and configure its sharing rules explicitly. When working with Laravel, leveraging built-in features for routing and middleware ensures greater stability, which is a core principle of good architectural design seen throughout the [laravelcompany.com](https://laravelcompany.com) ecosystem.

By ensuring that all necessary headers (`X-CSRF-Token`) are permitted in your CORS preflight responses, you allow the Sanctum token exchange to proceed without browser interference, successfully bridging your React application and your Laravel API.
