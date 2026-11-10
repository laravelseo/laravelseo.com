---
title: "Laravel 5 maintenance mode turn on without artisan"
description: "Title: Effectively Managing Laravel 5 Maintenance Mode without Using Artisan CLI Commands Body: In today's dynamic web development world, ensuring your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Effectively Managing Laravel 5 Maintenance Mode without Using Artisan CLI Commands

Body:

In today's dynamic web development world, ensuring your application is always up and running smoothly can be a challenging task. Laravel offers various tools to handle different scenarios such as maintenance periods. While the traditional approach uses artisan commands (`php artisan down` and `php artisan up`) to turn on/off the Laravel 5 maintenance mode, what if you're not using a command line interface or your application is hosted?

The challenge stems from how Laravel's maintenance mode works at the core level. It's enabled by adding a few lines of code in your `config/app.php` file to set `'down' => true` and `'debug' => false`. Once this is done, your website will automatically enter maintenance mode if any exception occurs or when you run the artisan down command.

However, there are ways to overcome these limitations and control maintenance mode directly from your application code. By using simple routes as described in the preamble, we can create a custom solution that works without requiring PHP's CLI (command line interface).

To achieve this, you need to define two routes in your Laravel 5 application:

1. To turn on maintenance mode, create a route with an endpoint to trigger the artisan down command using Artisan::call. In this case:
   <pre><code>Route::get('site/shutdown', function(){
    return Artisan::call('down');
});</code></pre>

2. To turn off maintenance mode, create a route with an endpoint to trigger the artisan up command using Artisan::call. In this case:
   <pre><code>Route::get('site/live', function(){
    return Artisan::call('up');
});</code></pre>

These simple routes allow your website visitors, administrators, or any third-party to access the specific endpoints and manage Laravel 5 maintenance mode without needing artisan commands. The routes can be added in your `routes/web.php` file, ensuring they are accessible from both logged-in users and guest users.

By creating these custom routes, you've found a way to effectively control Laravel's maintenance mode without the need for the traditional artisan CLI commands when your application is hosted elsewhere. While this solution may not always be ideal, it can serve as an alternative if other methods are unavailable or unsuitable for your situation.

In conclusion, Laravel 5 maintenance mode can be managed through custom routes and Artisan::call statements, enabling you to handle the maintenance process more efficiently regardless of where your application is hosted. Remember, always keep your code well-structured and secure, as these practices will help maintain a healthy and stable web development environment.
