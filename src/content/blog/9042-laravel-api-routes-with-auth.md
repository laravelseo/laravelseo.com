---
title: "Laravel api routes with auth"
description: "Securing Your Laravel API Routes: Mastering Authentication Middleware Building secure APIs is one of the most critical tasks in modern web development. When..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Building secure APIs is one of the most critical tasks in modern web development. When you need to restrict access to specific endpoints—ensuring that only authenticated users can perform actions like creating a schedule—you rely on middleware. The scenario you've encountered, where applying `middleware('auth:api')` results in an "Unauthenticated" error, is extremely common and usually points to a missing or misconfigured authentication setup rather than an issue with the route definition itself.

This post will dive into how Laravel handles API authentication, why your current setup might be failing, and how you can achieve secure, authenticated routes effectively, even when avoiding heavier solutions like full OAuth implementations.

## Understanding Laravel Authentication Middleware

The core of securing your routes lies in the middleware stack. When you use `Route::group(['middleware' => ['auth:api'], ...])`, you are instructing Laravel to check if a valid user session or token exists for that request before allowing it to proceed to the controller method.

If you are seeing `"error":"Unauthenticated."`, it means the authentication guard specified by `auth:api` cannot find any valid credentials for the incoming request. This usually happens because:

1.  **Missing Guard Configuration:** The API guard (`api`) hasn't been properly configured in `config/auth.php`.
2.  **No Token/Session Present:** The client making the request is not sending the necessary token (e.g., a Sanctum token or Passport token) in the request headers.
3.  **Authentication Not Established:** The user hasn't actually logged in or generated a valid token yet.

## The Practical Solution: Laravel Sanctum for API Authentication

You asked if this can be done without Laravel Passport, focusing on in-app use. The answer is a resounding yes. For modern, lightweight API authentication—especially when dealing with Single Page Applications (SPAs) or mobile apps that interact with a Laravel backend—**Laravel Sanctum** is the preferred and most streamlined solution. It provides token-based authentication perfect for this scenario without the complexity of full OAuth flows required by Passport.

### Step-by-Step Implementation with Sanctum

To make your API routes secure, you need to ensure Sanctum is set up correctly:

#### 1. Installation and Setup
First, ensure you have Laravel Sanctum installed and configured in your project. This involves running the necessary migrations and setting up your Sanctum configuration as detailed on the official documentation from [laravelcompany.com](https://laravelcompany.com).

#### 2. Defining the API Guard
Ensure that your authentication guards are properly defined in `config/auth.php`. For API token usage, the default setup often suffices, but it’s crucial that the guard referenced by your route middleware matches what Sanctum is using for token validation.

#### 3. Applying the Middleware Correctly
Once Sanctum is active, applying the `auth:sanctum` middleware (or whatever guard you have configured) will correctly intercept the request and validate the provided token.

Here is how your route definition should look, assuming you are using the standard Sanctum setup for API tokens:

```php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ScheduleController;

Route::middleware('auth:sanctum')->group(function () {
    // This route will ONLY be accessible if the request includes a valid Sanctum token
    Route::post('/schedules', [ScheduleController::class, 'store']);
});
```

By using `auth:sanctum`, Laravel automatically looks for a valid token in the request headers. If no valid token is present or the token is invalid, it immediately blocks access and returns an authentication error, which is exactly what you want for protected routes.

## Conclusion

The issue you faced with the "Unauthenticated" error stems from the necessity of correctly setting up the underlying authentication mechanism. While avoiding Passport entirely is feasible, relying on Laravel's built-in framework capabilities—specifically **Laravel Sanctum**—provides a robust, lightweight, and highly efficient way to secure your API endpoints for logged-in users. By ensuring your guards are configured and that the client sends the required token, you can successfully protect your routes and build secure APIs with confidence.
