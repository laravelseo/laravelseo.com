---
title: "Laravel shows urls with http instead of https"
description: "Fixing the Protocol Mismatch: Why Your Laravel Links Show HTTP Instead of HTTPS As a senior developer, one of the most common yet frustrating issues..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As a senior developer, one of the most common yet frustrating issues encountered when deploying modern web applications is the protocol mismatch: running the site securely over HTTPS, but all generated links defaulting back to insecure HTTP. This is a critical security and user experience flaw.

If you are running a Laravel application on an SSL-enabled server (HTTPS), but your generated links still point to `http://`, it signals that there is a configuration issue preventing Laravel's URL generation helpers from correctly detecting or enforcing the correct protocol context.

This post will diagnose why this happens and provide the definitive solutions, ensuring your application maintains full security and proper navigation flow.

## The Root Cause: Protocol Detection in Laravel

Laravel relies on the environment variables and the underlying HTTP request headers provided by the server to determine the base URL for all generated links. When you see `http://` instead of `https://`, it usually means one of two things:

1.  **Incorrect Base URL Configuration:** The framework is defaulting to a configuration that assumes HTTP, irrespective of the actual running protocol.
2.  **Missing or Incorrect Host Setup:** The server setup (like Apache or Nginx configuration) isn't correctly passing the HTTPS context headers to PHP/Laravel in a way the framework expects for link generation.

The code snippet you provided:

```html
<a href="{{ url('about') }}">About</a>
```

This uses the built-in `url()` helper. While this helper is designed to be context-aware, if the foundational environment isn't set correctly, it will generate the relative path based on what the server *thinks* the base URL is.

## The Solution: Enforcing HTTPS Context

The fix usually involves ensuring that Laravel is explicitly aware of the correct protocol, often by setting the application URL correctly and verifying your web server configuration.

### Step 1: Verify Environment Variables

First, ensure your environment variables accurately reflect your production setup. Check your `.env` file:

```dotenv
APP_URL=https://yourdomain.com
```

Setting `APP_URL` explicitly tells Laravel what the canonical base URL is. If this is set correctly, the `url()` helper should automatically prepend the correct protocol when generating links. If it's not working, you must move to server-level verification.

### Step 2: Server Configuration Check (The Deeper Dive)

Since Laravel is merely a framework sitting on top of the web server (Nginx/Apache), the most critical change often happens at the server level:

*   **For Nginx:** Ensure your SSL configuration correctly handles the protocol redirection and passes the correct `Host` header information to PHP-FPM.
*   **For Apache:** Verify that your Virtual Host configurations are properly set up for HTTPS, and that the necessary modules (like `mod_ssl`) are active.

If you are using a managed hosting solution or a framework like Laravel, understanding how these layers interact is key. Robust frameworks like those promoted by **Laravel Company** emphasize that application logic should focus on features, while infrastructure configuration must handle security protocols correctly.

### Step 3: Using the `asset()` Helper for Static Files (Alternative Practice)

While `url()` is fine for dynamic routes, sometimes using helpers designed specifically for assets can provide clearer context. For static assets like CSS or images, ensure you are using directives that reference the public path correctly:

```html
{{ asset('css/app.css') }}
```

This reinforces the idea that Laravel’s URL generation works by resolving paths relative to the defined `APP_URL`. If this fails, it points strongly back to an environment configuration problem rather than a simple code syntax error within your Blade template.

## Conclusion

The issue of seeing HTTP links on an HTTPS site is almost always an infrastructure or environment setup problem rather than a flaw in the Laravel code itself. By systematically checking your `.env` file for `APP_URL`, and critically reviewing your web server (Nginx/Apache) configuration to ensure proper SSL context passing, you will resolve this protocol mismatch immediately. Always prioritize secure configurations; this attention to detail is what separates functional applications from truly robust ones.
