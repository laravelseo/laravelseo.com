---
title: "Laravel - Protect API routes"
description: "Securing Your Backend: The Best Way to Protect Laravel API Routes As a senior developer working with Laravel and modern JavaScript frameworks like Vue.js,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "JavaScript"]
featured: false
---

As a senior developer working with Laravel and modern JavaScript frameworks like Vue.js, securing your API endpoints is not just a best practice—it is a fundamental requirement for building any robust application. When you expose data via API routes (like `/api/posts`), leaving them unprotected means anyone on the internet can access sensitive information or potentially manipulate your data.

You are right to look towards Laravel's built-in solutions like API Authentication and Passport. While these tools provide the framework, the real magic lies in correctly implementing **middleware** to enforce those rules at the route level.

This post will guide you through the most effective, modern way to protect your Laravel API routes, focusing on secure token-based authentication suitable for a Vue.js frontend.

---

## Why Route Protection is Non-Negotiable

When a user queries `/api/posts`, the server needs to verify two things:
1. **Authentication:** Is this user who they claim to be? (Are they logged in?)
2. **Authorization:** Does this authenticated user have permission to view posts?

Without these checks, any attacker can simply make requests, leading to data breaches and potential abuse of your application logic. Protecting routes ensures that data access is strictly controlled by your application's security layer.

## Choosing the Right Tool: Sanctum vs. Passport

Laravel offers several ways to handle authentication, most notably **Passport** (which implements OAuth2) and the more lightweight **Laravel Sanctum**. For applications using Single Page Applications (SPAs) like Vue.js that communicate with a Laravel backend via API, **Laravel Sanctum** is generally the preferred and simplest choice.

### Laravel Sanctum: The SPA Solution

Sanctum is designed specifically for token-based authentication, making it perfect for authenticating SPAs. It allows you to issue simple, secure tokens that your Vue application can send with every request. This approach keeps the setup lightweight while providing robust protection.

While Passport is excellent for complex OAuth flows involving third-party services, Sanctum provides a cleaner integration directly within Laravel for API token management. You can find detailed discussions on implementing these features within the official documentation, which is a great starting point for any developer diving into Laravel security practices.

## Step-by-Step Implementation with Sanctum

Here is the practical approach to securing your routes using Laravel Sanctum.

### 1. Setup and Installation

First, ensure you have Laravel installed and set up your database. Then, install and configure Sanctum:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 2. Authenticating the User (Login)

You first need an endpoint where a user can log in and receive an API token. This usually involves a dedicated controller method that authenticates credentials and issues a token.

### 3. Protecting the Routes with Middleware

This is the crucial step. You apply Sanctum middleware to the routes you want to protect. By default, Sanctum requires a valid token to be present in the request header for access.

In your `routes/api.php` file, you would define your protected routes like this:

```php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

// Routes that require authentication (protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
});

// Public routes (unprotected)
Route::get('/status', function () {
    return response()->json(['status' => 'API is running']);
});
```

**Explanation:**
The line `Route::middleware('auth:sanctum')->group(...)` ensures that any request hitting these routes must first successfully pass the Sanctum authentication check. If no valid token is provided, the request will immediately be rejected with a 401 Unauthorized response.

### 4. Protecting the Controller Logic (Authorization)

Beyond just checking *if* someone is logged in, you need to ensure they are authorized to perform the action. Inside your controller method (`PostController::index`), you should always scope the data based on the authenticated user's ID.

```php
// app/Http/Controllers/PostController.php

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    public function index(Request $request)
    {
        // The 'auth:sanctum' middleware ensures $request->user() is populated
        $posts = Post::where('user_id', $request->user()->id)->get();

        return response()->json($posts);
    }
}
```

By using `$request->user()->id`, you enforce **row-level authorization**, meaning a user can only access the posts they own, not every post in the database. This layered approach—token validation via middleware and data scoping via the controller—is the gold standard for secure API design.

## Conclusion

Protecting your Laravel API routes is a multi-layered process. Start by choosing a modern authentication system like **Laravel Sanctum** for SPA communication. Implement route protection using dedicated middleware (`auth:sanctum`) to handle basic access control, and always implement authorization logic within your controllers to ensure users can only interact with the data they are explicitly allowed to see. By following these principles, you ensure that your backend remains secure, scalable, and reliable for any front-end application connecting to it.
