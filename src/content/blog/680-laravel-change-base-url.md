---
title: "Laravel: Change base URL?"
description: "Title: Modifying Base URL for Laravel Links: Adding \"www\" to Domains Introduction: Laravel is an excellent PHP framework that allows developers to create..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Modifying Base URL for Laravel Links: Adding "www" to Domains

Introduction:
Laravel is an excellent PHP framework that allows developers to create powerful applications quickly and efficiently. However, you may want to customize the default link generation behavior provided by functions like secure_url() or asset(). In this blog post, we will explore how to implement a solution for modifying your Laravel base URL to include "www" when generating links with those methods.

Step 1: Understand the Default Base URL Behavior
Before you embark on making changes, it is essential to understand the current behavior of your application. By default, secure_url() and asset() functions do not include the "www" prefix in your domain name (e.g., example.com). Instead, they use just the main part of the URL (example.com) with or without an HTTPS protocol.

Step 2: Explore Possible Solutions
There are multiple ways to achieve the desired result. The most popular solution involves overriding the default behavior by providing a custom base URL in your application's configuration file. Here is how you can do this:

1. Open your Laravel app's config/app.php file.
2. Locate or add the following lines to your 'config' array:
   `'url' => env('APP_URL', 'http://localhost'),`
   `'asset_cdn' => false,`
   `'force_ssl' => false,`
   `'app_debugger_enabled' => true,`
3. In the environment file (often .env), update your APP_URL:
   `APP_URL=https://www.example.com`
   This will ensure that all generated URLs automatically include "www" before the domain name.
4. Use URLs with 'www' in your code by calling secure_url() or asset():
```php
// Using secure_url() and asset() in views
{{ secure_url('/my-view') }}
{{ asset('images/logo.png') }}
```
This method is recommended as it provides a global solution for all URL generation functions in your Laravel application.

Step 3: Use Laravel Middleware to Modify URLs
As an alternative approach, you can also use middleware in your project to alter the base URL before every request. To achieve this, follow these steps:

1. Create a new middleware class by typing `php artisan make:middleware BaseUrlMiddleware` on your command line.
2. Open the newly created file (app/Http/Middleware/BaseUrlMiddleware.php) and add the following code to it:
```php
<?php
namespace App\Http\Middleware;

use Closure;

class BaseUrlMiddleware {
    public function handle($request, Closure $next) {
        // Add 'www' prefix to the domain name in the URL
        $request->server->set('HTTP_HOST', str_replace('.', 'www.', parse_url($request->server->get('HTTP_HOST'), PHP_URL_SCHEME | PHP_URL_HOST)['host']));

        return $next($request);
    }
}
```
3. Include the middleware in the app/Http/Kernel.php file:
```php
protected $routeMiddleware = [
   // ... other middlewares
   'baseUrl' => \App\Http\Middleware\BaseUrlMiddleware::class,
];
```
4. Apply the middleware to your application routes:
```php
// Routes/web.php
Route::get('/', function() {
    return view('welcome');
})->middleware('baseUrl');
```
5. Call URLs without 'www' in your code, as before.
   The middleware will automatically add the "www" prefix to the domain name when you access the site.

Conclusion:
Laravel provides multiple methods for modifying the base URL of generated links. You can either adjust your application configuration or use a dedicated middleware class to implement the desired behavior. Whichever method you choose, ensure that it aligns with your project's requirements and provides consistent results across all applications using Laravel secure_url() and asset(). With these options available, you are now equipped to efficiently create and manage links with "www" in your Laravel application.
