---
title: "Laravel - check if Ajax request"
description: "Title: Determining Ajax Requests in Laravel Controllers Introduction Laravel is a powerful PHP framework that provides various tools to help developers build..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Determining Ajax Requests in Laravel Controllers

Introduction

Laravel is a powerful PHP framework that provides various tools to help developers build efficient web applications. It also offers different ways to handle Ajax requests, which are an essential part of modern web development. In this blog post, we'll explore how to check if a request is made via Ajax in Laravel controllers and provide code examples for better understanding.

Determining Ajax Requests with Laravel

The Laravel framework offers multiple ways to handle Ajax requests:

1. Using the `Request::ajax()` method: This approach uses the static method of the Request class to check if a request is an Ajax call. However, it should be called from non-static context and not directly by using its name as a global function. Here's how you can use this method within a controller action:

   ```php
   public function index()
   {
       if (!auth()->check()) {
           return Redirect::to('login');
       }

       if (Request::ajax()) {
           echo 'Ajax';
       }
       else {
           // Handle normal requests
       }
   }
   ```

2. Utilizing Laravel's routing filters: You can assign a custom filter to your route by using `Route::filter()` and check if the request is an Ajax call in this closure:

   ```php
   Route::filter('isAjax', function($route, $request) {
       return ($request->ajax()) ? true : Redirect::to('login');
   });

   Route::get('/example', 'ExampleController@index')->before(function() use ($request) {
       if (Route::filter('isAjax') && !$request->ajax()) {
           return Redirect::to('login');
       }
   });
   ```

3. Implementing a middleware: You can create a custom middleware to check for Ajax requests and then use it in your controller actions. Here's how this approach works:

   ```php
   1. Create the AjaxMiddleware class:
   <?php namespace App\Http\Middleware;

   use Closure;
   use Illuminate\Contracts\Foundation\Application;
   use Illuminate\Support\Facades\Request;

   class AjaxMiddleware
   {
       public function handle($request, Closure $next)
       {
           if (!Request::ajax()) {
               return response(view('errors.403'), 403);
           }

           return $next($request);
       }
   }
   2. Define the middleware in the app/Http/Kernel.php file:
   <?php namespace App\Http;

   use Illuminate\Contracts\Routing\Middleware;
   use Laravel\Lumen\Application;
   use AjaxMiddleware;

   class Kernel extends Application implements MiddlewareContract
   {
       protected $routeMiddleware = [
           ...,
           'isAjax' => AjaxMiddleware::class,
       ];
       ...
   }
   3. Apply the middleware to your route:
   Route::get('/example', 'ExampleController@index')->middleware('isAjax');
   ```

Conclusion

In summary, you can use multiple methods in Laravel to determine Ajax requests. However, it's crucial to choose an approach that suits your application and follows best practices. By incorporating appropriate checks throughout your codebase, you can ensure effective handling of Ajax-based interactions with your application. For more detailed information on working with Ajax requests in Laravel, feel free to explore the official documentation or visit our blog for additional resources: https://laravelcompany.com/blog/.
