---
title: "How to set X-Frame-Options in laravel project?"
description: "How to Set X Frame Options in a Laravel Project to Prevent Clickjacking Attacks As a senior developer, I deal with countless security concerns daily. One of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

As a senior developer, I deal with countless security concerns daily. One of the most insidious threats we face is clickjacking—an attack where malicious websites overlay legitimate sites using `<iframe>` tags to trick users into clicking elements they didn't intend to interact with. To defend against this, setting appropriate HTTP response headers is crucial.

This guide will walk you through exactly how to implement the `X-Frame-Options` header within a Laravel application, focusing on practical methods and modern security considerations.

## Understanding the Threat: Clickjacking Explained

Clickjacking occurs when an attacker embeds your website within a frame on their own malicious page. Because of this embedding, users unknowingly interact with elements on the embedded site, potentially leading to unauthorized actions (like changing settings or making purchases).

The primary defense against this is sending specific HTTP response headers that instruct the browser whether it is safe to render the page in a frame. The header we are focusing on is `X-Frame-Options`.

## Implementing X-Frame-Options in Laravel

While modern security standards often favor the Content Security Policy (CSP) header, understanding how to apply `X-Frame-Options` remains essential for legacy compatibility and foundational knowledge. In a Laravel context, you can set this header either directly within your response or by leveraging Laravel's middleware system.

### Method 1: Setting Headers via Controller Response

The most straightforward way to set headers is directly in the controller method where you are generating the view. You access the response object and manually add the header.

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function showSecurePage()
    {
        // Set the X-Frame-Options header to DENY, preventing framing entirely.
        response()->header('X-Frame-Options', 'DENY');
        
        // Alternatively, you can use SAMEORIGIN if you want to allow framing only from the same origin.
        // response()->header('X-Frame-Options', 'SAMEORIGIN');

        return view('secure-page');
    }
}
```

**Explanation:** By calling `response()->header()`, you are telling the web server that when it sends this response to the client, it must include the specified header. Using `DENY` is the strictest setting, ensuring no site can embed your content in a frame, which is ideal for highly sensitive pages.

### Method 2: Using Custom Middleware (Best Practice)

For an application-wide security measure, manually adding headers in every controller method is inefficient and error-prone. The best practice in Laravel is to abstract this logic into a dedicated middleware. This ensures that the header is applied consistently across all routes that require protection.

1.  **Create the Middleware:**
    ```bash
    php artisan make:middleware FrameOptionsMiddleware
    ```

2.  **Define the Logic (in `app/Http/Middleware/FrameOptionsMiddleware.php`):**
    ```php
    namespace App\Http\Middleware;

    use Closure;
    use Illuminate\Http\Request;
    use Symfony\Component\HttpFoundation\Response;

    class FrameOptionsMiddleware
    {
        public function handle(Request $request, Closure $next): Response
        {
            // Set the header for clickjacking prevention
            $response = $next($request);
            $response->headers->set('X-Frame-Options', 'DENY');
            
            return $response;
        }
    }
    ```

3.  **Register and Apply Middleware:** Register this middleware in `app/Http/Kernel.php` and apply it to the routes you want to protect. This approach aligns perfectly with the structured architecture promoted by tools like those found on [laravelcompany.com](https://laravelcompany.com).

## The Modern Approach: Content-Security-Policy (CSP)

While setting `X-Frame-Options` solves the immediate problem, it is important to note that this header is largely considered deprecated in favor of a more powerful and flexible directive: **Content Security Policy (CSP)**.

A modern implementation would use the `frame-ancestors` directive within your CSP header instead of relying solely on `X-Frame-Options`. This allows you to specify exactly which domains are allowed to embed your content, offering much finer-grained control over security. Always evaluate both options for the most robust defense against client-side attacks.

## Conclusion

To prevent clickjacking in your Laravel project, you must implement HTTP response headers correctly. While setting `X-Frame-Options` is a valid step, leveraging custom middleware to enforce these policies application-wide ensures consistency and maintainability. Always strive to adopt the latest security standards, such as CSP, as it provides a more comprehensive defense strategy for modern web applications. By securing your responses at the HTTP layer, you build a much stronger foundation for your entire Laravel application.
