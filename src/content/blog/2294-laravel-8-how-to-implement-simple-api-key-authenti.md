---
title: "Laravel 8 - How to implement simple API key authentication"
description: "Title: Laravel 8 Implementing a Simple API Key Authentication System Body: In this blog post, we aim to create a straightforward authentication system for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "PHP"]
featured: false
---

Title: Laravel 8 - Implementing a Simple API Key Authentication System
Body:
<p>In this blog post, we aim to create a straightforward authentication system for your Laravel 8 application that allows any user with a hard-coded API key to access the endpoints. This solution does not require complex packages like Passport and Sanctum while still maintaining security through proper authorization. Let's dive in!</p>

<h2>Preparation and Configuration</h2>
First, you need to add a new route that handles your API key authentication logic. You can create a separate file or use a dedicated controller for this purpose:

```php
<?php
namespace App\Http\Controllers;

class ApiKeyController extends Controller {
    // other methods will go here...
}
```

Next, you need to add the RouteServiceProvider to your project. You can run:

```bash
composer require laravel/ui
php artisan ui vue --auth
```

This command will generate a new RouteServiceProvider file and configure authentication for API endpoints using the provided Vue UI. To enable this, add the following lines to your app's root routes file (app/Http/Kernel.php):

```php
protected $middlewareGroups = [
    'web' => [
        // Your regular middleware groups will go here...
    ],
    'api' => [
        'throttle:60,1',
        \Illuminate\Session\Middleware\StartSession::class,
        \Laravel\Sanctum\Http\Middleware\CheckForMaintenanceMode::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

<h2>Implementing Your Authentication Method</h2>
Now that the necessary files and routes are created, we can implement our custom authentication logic. We want to ensure only users with a valid API key and their endpoint access.

First, let's update the route definition for your API endpoints in the RouteServiceProvider file (routes/api.php):

```php
<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;

// other routes will go here...

Route::get('/endpoint1', function () {
    // Your endpoint logic goes here
})->middleware('auth:api');
```

Next, create a new middleware in your project's app/Http/Kernel.php file:

```php
<?php
namespace App\Http\Middleware;

use Closure;

class ApiKeyAuthenticator {
    public function handle($request, Closure $next) {
        // Your authentication logic goes here

        if (Auth::user() && Auth::user()->api_key == Request::input('apikey')) {
            return $next($request);
        } else {
            abort(401, 'Unauthorized');
        }
    }
}
```

This middleware checks if the user is authenticated and matches their api key. If both conditions are met, it allows the request to proceed. Otherwise, a 401 Unauthorized error is returned. Finally, add this newly created middleware in the $routeMiddleware array of your app/Http/Kernel.php file:

```php
<?php
// other code will go here...

protected $routeMiddleware = [
    // other middleware groups will go here...
];
```

<h2>Conclusion</h2>
You have now successfully implemented a basic but secure API key authentication system for your Laravel 8 application. This solution allows any user with the correct hard-coded API key to access the endpoints, ensuring they remain protected and only accessible by authorized individuals. Utilizing this approach can provide an easy-to-understand alternative to complex packages like Passport and Sanctum while preserving your preferred level of security for the application.
