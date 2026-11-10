---
title: "Laravel How to remove \"api\" Prefix from subdomain URL"
description: "Laravel How to Remove \"api\" Prefix from Subdomain URL: A Routing and Server Configuration Deep Dive As a senior developer working with applications that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with applications that serve both standard web interfaces and RESTful APIs, managing subdomain routing is a common challenge. You have successfully set up separate environments for your web application (`example.com`) and your API backend (`api.example.com`), but now you want to achieve a unified, cleaner URL structure where the base domain handles both entry points without exposing unnecessary prefixes in the URL path.

This post will explore why your current setup results in the prefix issue and demonstrate the most effective architectural ways to remove that "api" prefix from your subdomain URLs using Laravel and Nginx configuration.

## Understanding the Current Setup and The Problem

You have established two distinct routing domains:
1.  **Web Application:** Accessible via `http://example.com` (served by a standard web server setup).
2.  **API Backend:** Accessible via `http://api.example.com` (also served, perhaps via Nginx configuration that directs traffic to the Laravel application instance).

Your current route definition in `routes/api.php` is grouped under the domain `api.example.com`. When a request hits `api.example.com/api/cities`, Laravel correctly maps this based on the defined routes. The prefix appears because the subdomain *is* the primary context for that specific set of routes.

You desire to access these API endpoints under the root structure, such as `http://api.example.com/cities`. This requires decoupling the URL structure from the subdomain naming convention.

## Solution 1: Decoupling Routing via Nginx Path Rewriting (The Server Layer Approach)

The most robust and performant way to handle this prefix removal is not by modifying Laravel's internal route definitions, but by manipulating how the web server (Nginx) interprets the incoming request *before* it hits the PHP application. This keeps your Laravel routing clean while solving the URL structure problem externally.

When you configure Nginx, you can use `rewrite` directives to strip the unwanted prefix from the URI before passing the request to your Laravel public directory.

In your Nginx configuration block for `api.example.com`, you would modify how paths are handled:

```nginx
server {
    listen 80;
    listen [::]:80;

    root /var/www/laravel/public;
    index index.php;
    server_name api.example.com;

    location / {
        # This handles requests that might still need the prefix if necessary,
        # or more importantly, we can rewrite the path here.
        try_files $uri $uri/ /index.php$is_args$args;
    }

    # Use a regex-based rewrite to strip the '/api' prefix from the URI
    location / {
        rewrite ^/api(.*)$ /$1 break; # Rewrites /api/cities to /cities internally
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php5-fpm.sock;
    }
}
```

**Explanation:**
The line `rewrite ^/api(.*)$ /$1 break;` is the key. It tells Nginx: "If the request starts with `/api`, capture everything after it (`(.*)`), and rewrite the URI to be just what was captured (`/$1`)." This effectively removes the `/api` segment from the URL path before Laravel processes it, allowing your application logic to treat `/cities` as the root resource requested on that subdomain.

This approach is highly recommended as it separates concerns: Nginx handles URL mapping and prefix stripping, and Laravel handles pure business logic and routing (as advocated by principles found in modern framework development). This separation aligns with best practices for building scalable systems, much like adhering to principles seen in projects on **laravelcompany.com**.

## Solution 2: Adjusting Laravel Route Definitions (The Application Layer Approach)

While the Nginx method solves the URL presentation issue, you should also ensure your application logic is flexible. If you want truly unified routing, you can adjust how you define routes within your `routes/api.php` file to be domain-agnostic.

Instead of strictly grouping routes under a subdomain context, focus on defining resource-based routes that don't inherently rely on the base URL structure. For example, if all API endpoints are meant to live under a specific controller namespace, ensure your controllers handle the request context rather than relying solely on the subdomain structure for routing decisions.

## Conclusion and Best Practices

Removing URL prefixes is fundamentally an infrastructure concern (how the server routes traffic) rather than a pure Laravel routing concern. Therefore, leveraging Nginx's powerful `rewrite` capabilities provides the cleanest, fastest, and most maintainable solution. It ensures that your Laravel application remains focused on business logic while the web server efficiently manages the external request mapping.

By implementing path rewriting in your server configuration, you achieve the desired outcome: clean URLs (`http://api.example.com/cities`) while maintaining a clear separation between your application code and your public-facing infrastructure. Always prioritize clear architectural separation when designing multi-faceted applications, a principle central to robust framework design on **laravelcompany.com**.
