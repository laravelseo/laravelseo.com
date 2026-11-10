---
title: "Auth guard [:api] is not defined?"
description: "Title: Troubleshooting Auth Guard for API Routes in Laravel Understanding and Resolving the Exception \"Auth guard [:api] is not defined\" Body: When you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting Auth Guard for API Routes in Laravel - Understanding and Resolving the Exception "Auth guard [:api] is not defined"

Body: When you encounter errors while utilizing Laravel authentication, it can be frustrating. One common issue that could hinder your web application's functionality involves the 'auth:api' guard in an API route. This blog post endeavors to explore this problem and offer solutions to ensure smooth API operations. Let us begin with a detailed explanation of the issue first.

Auth Guard Configuration Issues for Laravel API Routes
The Laravel API routes are protected by using Auth::guard('api'), which is distinct from the default 'web' guard used in standard HTTP requests. The configuration of these guards can be found in config/auth.php file, as shown below:

<pre class="lang-php prettyprint-override"><code>'guards' =&gt; [
    'web' =&gt; [
        'driver' =&gt; 'session',
        'provider' =&gt; 'users',
    ],
    'api' =&gt; [
        'driver' =&gt; 'passport',
        'provider' =&gt; 'users',
    ],
],</code></pre>

The default configuration assumes you have installed Laravel Passport for API authentication. However, in some cases, developers might change the guard driver or use a different package for API authentication. Such alterations could lead to the Auth guard [:api] is not defined error when using the 'auth:api' guard in an API route like this example:

<pre class="lang-php prettyprint-override"><code>Route::group(['prefix' =&gt; 'auth'], function () {
    Route::post('login','AuthController@login');
    Route::post('signup','AuthController@signup');

    Route::group(['middleware' =&gt; 'auth::api'], function () {
        Route::get('logout','AuthController@logout');
        Route::get('user','AuthController@user');
    });
});</code></pre>

How to Fix the Exception "Auth guard [:api] is not defined"
1. Ensure you have the correct 'guards' configuration in config/auth.php file, as shown before. If you have changed the guard driver or package for API authentication, make necessary adjustments accordingly.

2. Include the middleware in your RouteServiceProvider file:

<pre class="lang-php prettyprint-override"><code>/**
 * Define the application's route model bindings.
 */
Route::modelBindings([
    'Post' =&gt; 'App\Models\Post',
]);

/**
 * Define the application's route middleware.
 * These can be assigned to group or named routes.
 */
Route::middleware('auth', 'verified')->group(function () {
    // ...
});

Route::middleware(['api'])->prefix('api')->group(function () {
    // ...
});</code></pre>

3. Ensure that the middleware has been registered with Laravel in your RouteServiceProvider:

<pre class="lang-php prettyprint-override"><code>'bindings' =&gt; [],
'middleware' =&gt; [
    'web' =&gt; [
        'App\Http\Middleware\VerifyCsrfToken',
        'auth',
    ],
    'api' =&gt; [
       'App\Http\Middleware\Auth:api',
    ]
],</code></pre>

4. Finally, check the correct middleware is bound to your routes as shown in the example above, with 'auth::api' for API routes:

<pre class="lang-php prettyprint-override"><code>Route::group(['prefix' =&gt; 'auth'], function () {
    Route::post('login','AuthController@login');
    Route::post('signup','AuthController@signup');

    Route::group(['middleware' =&gt; 'auth::api'], function () {
        Route::get('logout','AuthController@logout');
        Route::get('user','AuthController@user');
    });
});</code></pre>

Conclusion
The issue of Auth guard [:api] is not defined in Laravel API routes can be traced back to incorrect configuration or usage of middleware. By following the steps and best practices outlined above, you can resolve this error and ensure smooth API operations for your Laravel application.
