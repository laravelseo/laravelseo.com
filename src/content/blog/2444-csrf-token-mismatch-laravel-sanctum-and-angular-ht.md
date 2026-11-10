---
title: "CSRF token mismatch Laravel sanctum and Angular http"
description: "CSRF Token Mismatch in Laravel Sanctum and Angular HTTP: A Deep Dive Implementing stateful authentication using Laravel Sanctum and a modern frontend..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Implementing stateful authentication using Laravel Sanctum and a modern frontend framework like Angular often introduces subtle complexities, especially around Cross-Origin Resource Sharing (CORS) and Cross-Site Request Forgery (CSRF) protection. If you are encountering the dreaded "CSRF token mismatch" error despite following the official documentation, it usually points to a misalignment in how cookies, credentials, and tokens are being managed between the client (Angular) and the server (Laravel).

As a senior developer, I’ve seen this issue repeatedly. It rarely stems from an error in the Sanctum setup itself, but rather an interaction flaw in the HTTP request chain. Let's break down why this happens and how to correctly synchronize your Angular application with Laravel Sanctum.

## Understanding the Sanctum/CSRF Mechanism

Laravel Sanctum uses CSRF tokens as a primary defense mechanism for stateful requests (those relying on session or cookie authentication). When you use `SANCTUM_STATEFUL_DOMAINS`, you are telling Sanctum that API endpoints should be protected by these cookies, which implicitly requires proper CSRF token handling.

The process usually involves:
1. The client requests the initial CSRF token (via `/sanctum/csrf-cookie`). This sets a cookie on the client side.
2. Subsequent requests must include this token securely, typically via a cookie or a request header, which Laravel validates against the session state.

The mismatch occurs when the browser fails to attach the necessary credentials (cookies) or when the token isn't correctly transmitted across the origin boundary for subsequent POST/PUT requests.

## Analyzing Your Configuration and Request Flow

Let’s review the configuration you provided:

**`config/cors.php`:**
```php
'paths' => [
    'api/*',
    'login',
    'logout',
    'sanctum/csrf-cookie'
],
'supports_credentials' => true,
```
This setup correctly enables credential support for CORS, which is essential when using session-based authentication like Sanctum.

**`.env` File:**
```dotenv
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost
```
Setting `SESSION_DRIVER=cookie` confirms you are relying on cookie-based sessions, which activates the need for CSRF protection.

**Angular Interceptor Logic:**
Your interceptor correctly clones the request and sets `withCredentials: true`:
```typescript
request = request.clone({
    withCredentials: true
})
```
This tells Angular to include any cookies or HTTP authentication headers when making the request.

The problem often lies not in this setup, but in how the initial token acquisition interacts with subsequent requests, especially across different origins.

## The Solution: Ensuring Consistent Credential Passing

When dealing with Sanctum stateful authentication, the most robust solution involves ensuring that the browser correctly handles the session cookies *and* that the request headers are compliant. Since you are using `withCredentials: true`, the issue is likely related to how Laravel expects the CSRF token alongside the session cookie for POST requests.

### Best Practice Implementation

For stateful API interactions, ensure your Angular application is not attempting to manually re-send a token
