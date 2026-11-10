---
title: "Laravel CSRF protection with REST API"
description: "Laravel CSRF Protection on REST APIs: Solving Token Mismatch Errors As a senior developer working with modern Laravel applications, dealing with routing and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As a senior developer working with modern Laravel applications, dealing with routing and security across traditional web views and stateless RESTful APIs often presents unique challenges. One common pitfall arises when attempting to apply standard Cross-Site Request Forgery (CSRF) protection mechanisms—designed for session-based form submissions—to API endpoints that rely on token-based authentication.

If you are encountering "token mismatch" errors when testing your API layer, it is almost certainly because the default CSRF middleware is interfering with your intended stateless API authentication mechanism. Let's dive into why this happens and how to correctly secure your Laravel API routes.

## Understanding the Conflict: CSRF vs. API Authentication

CSRF protection in Laravel is designed to defend against malicious websites tricking a logged-in user into submitting unwanted state-changing requests (like POST, PUT, DELETE) via forms. It relies on session state and token validation embedded within HTML forms.

When you implement group routing for your API:

```php
Route::group(array('prefix' => 'api'), function () {
    Route::resource('shows', 'ShowsApiController');
    // ... other routes
});
```

And apply a global rule like `Route::when('*', 'csrf', array('post', 'put', 'delete'));`, you are telling Laravel to enforce CSRF checks on *every* request matching those methods, regardless of whether it's an authenticated API call or a standard web form submission.

For typical REST APIs, the security model shifts from session-based CSRF protection to **token-based authentication** (using Sanctum or Passport). These tokens are usually passed in the `Authorization` header (e.g., Bearer token), not derived from session cookies. When Laravel's built-in CSRF middleware tries to validate a session token for an API request that expects an API token, the mismatch occurs, leading to errors.

## The Solution: Selective Application and Proper API Setup

The solution is not to eliminate CSRF entirely (it remains crucial for web views), but to selectively apply it or bypass it for your API prefix. You must treat API routes differently from standard web routes.

### 1. Separate Web Routes from API Routes

The cleanest approach is to completely isolate your API group from the general route definitions where you might apply CSRF middleware.

**Web Routes (where CSRF is appropriate):**
These routes handle sessions and form submissions, so the default protection works perfectly here.

```php
// web.php
Route::post('/submit-form', [FormController::class, 'store'])->middleware('csrf'); // Explicitly apply if needed
```

**API Routes (where API tokens are used):**
These routes should be protected by your chosen API authentication package (like Laravel Sanctum) and should explicitly *not* rely on the standard CSRF layer.

### 2. Implementing Token-Based API Security

For robust API security in Laravel, you should leverage official packages rather than trying to force session middleware onto stateless endpoints. Using a package like **Laravel Sanctum** is highly recommended for SPA or mobile API authentication.

When using Sanctum, the protection mechanism relies on validating the token present in the request headers, which bypasses the standard CSRF check designed for sessions.

Here is how you structure your routes correctly when using an API prefix:

```php
// routes/api.php
use App\Http\Controllers\ShowsApiController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // These routes are now protected by Sanctum token validation, not CSRF
    Route::resource('shows', ShowsApiController::class);
    Route::resource('episode', EpisodesApiController::class);
    Route::resource('genre', GenresApiController::class);
});
```

By using the `middleware('auth:sanctum')` guard on your API group, you ensure that any request hitting those routes must present a valid token. This establishes stateless authorization, which is the correct pattern for modern REST APIs, aligning with best practices promoted by the Laravel community.

## Conclusion

The "token mismatch" error between CSRF protection and REST API testing stems from applying web-centric security middleware to stateless API endpoints. The fix is to recognize that APIs require token authentication (like Sanctum) instead of session-based CSRF validation. By isolating your routes and using proper API middleware, you ensure that your application maintains robust security for both traditional web interactions and modern API services, creating a more secure and predictable architecture within Laravel.
