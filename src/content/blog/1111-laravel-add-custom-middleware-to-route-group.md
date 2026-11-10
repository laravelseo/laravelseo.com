---
title: "Laravel add custom middleware to route group"
description: "Title: Easily Secure Your Admin Panel with Laravel Custom Middleware and Route Groups Introduction In this post, we will discuss how to secure your Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

Title: Easily Secure Your Admin Panel with Laravel Custom Middleware and Route Groups

Introduction
In this post, we will discuss how to secure your Laravel application's admin panel by adding a custom middleware to a specific route group. In order to achieve this, we will cover various aspects such as creating the middleware class, adjusting web routes for better security, and modifying kernel registration. All of these steps are designed to ensure that only users with the specified role have access to your admin dashboard.

Creating the Middleware Class
Firstly, let us create a custom middleware class named 'CheckUserAdminRole' in App\Http\Middleware folder. This class contains authentication logic and authorization checks for our admin panel:

```php
namespace App\Http\Middleware;
use Closure;
class CheckUserAdminRole {
    public function handle($request, Closure $next) {
        if (auth()->guard('web')->check()) {
            if (auth()->user()->hasRole('admin')) {
                return $next($request);
            } else {
                auth()->logout();
                return redirect(route('system.messages', 'userIsNotAdmin'));
            }
        } else {
            return redirect('/login');
        }
    }
}
```

This code verifies that a user has logged in and checked their authentication status, checks if they have the 'admin' role, and redirects them to either the admin panel or the login page. Alternatively, it can also log out users without the required role and send them to an error message.

Adjusting Web Routes for Better Security
Next, update your application routes to include a specific route group that will only be accessible to users with the 'admin' role:

```php
Route::group(['namespace' => 'Dashboard', 'middleware' => ['auth:web'], 'prefix' => 'dashboard'], function () {
    $this->group(['prefix' => 'administrator'], function () {
        $this->get('panel', 'AdminController@index');
    });
});
```

This code block defines a route group protected by the 'auth:web' middleware. Within this group, another inner group is created with the 'prefix' set to 'administrator'. The routes and controllers within these subgroups will be accessible only if users are successfully authenticated and authorized as administrators.

Modifying Kernel Registration for Enhanced Security
Finally, let us include our custom middleware class in Laravel kernel:

```php
protected $middleware = [
    \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
    \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
    ...
    \App\Http\Middleware\CheckUserAdminRole::class,
];
```

This line of code ensures that the 'CheckUserAdminRole' middleware is registered in Laravel's kernel. It will be called for every HTTP request made to your application and will enforce access control based on user authentication and role validations.

Conclusion
With these steps, you have successfully implemented a custom middleware class and route group that provides strong security for your Laravel admin panel. By verifying the authentication and matching authorization criteria, only users with the 'admin' role will be able to access restricted areas of your application. To learn more about Laravel middleware and routing, visit https://laravelcompany.com/blog for comprehensive guides on various aspects of the framework.
