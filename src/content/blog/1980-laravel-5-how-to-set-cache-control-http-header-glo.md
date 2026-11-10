---
title: "Laravel 5 how to set Cache-Control HTTP header globally?"
description: "Title: A Comprehensive Guide to Configuring Cache Control HTTP Headers Globally in Laravel 5 Body: Laravel applications by default set the Cache Control HTTP..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: A Comprehensive Guide to Configuring Cache-Control HTTP Headers Globally in Laravel 5

Body:

Laravel applications by default set the <code>Cache-Control</code> HTTP header to <code>no-cache, private</code> for each request. However, there might be scenarios where you want a global setting for this header across your entire application. In this blog post, we will discuss how to configure Cache-Control headers globally in Laravel 5 and provide relevant examples.

To achieve this goal, we first need to understand the importance of HTTP headers like <code>Cache-Control</code>. They are key components in web development that help control caching mechanisms for better performance, security, and efficiency. Setting the Cache-Control header can be quite beneficial as it:

1. Enables your browser to cache static assets and avoid unnecessary requests on each refresh or load.
2. Improves page loading times by serving cached files directly from the server instead of reloading them.
3. Helps prevent some common security vulnerabilities that are associated with caching.

Now, let's delve into the process of configuring Cache-Control headers globally in Laravel 5:

1. Create a new middleware to handle the global Cache-Control header configuration.

   - Create a 'CacheHeaderMiddleware.php' file inside your 'app/Http/Middleware' folder.
   - Add the following code:
      ```php
      <?php

      namespace App\Http\Middleware;

      use Closure;
      use Illuminate\Support\Facades\Response;

      class CacheHeaderMiddleware
      {
          /**
           * Handle an incoming request.
           *
           * @param  \Illuminate\Http\Request  $request
           * @param  \Closure  $next
           * @return mixed
           */
          public function handle($request, Closure $next)
          {
              Response::macro('setCacheHeader', function ($duration = null) {
                  if (is_null($duration)) {
                      return Response::$defaultCacheTtl;
                  }

                  $cacheControlHeaderValue = 'public, max-age=' . $duration;

                  // Adding the Cache-Control header to your response.
                  Response::header('Cache-Control', $cacheControlHeaderValue);
              });

              $nextResponse = $next($request);
              $nextResponse->setCacheHeader();

              return $nextResponse;
          }
      }
   ```

2. Register the middleware in your 'app/Http/Kernel.php' file:

   - Add the following code inside the 'protected $routeMiddleware' array:
      ```php
      'cache_header' => \App\Http\Middleware\CacheHeaderMiddleware::class,
   ```

3. Apply this middleware to all routes or specific ones.

   - To apply it globally, add a new line inside your 'app/Http/Kernel.php' file:
      ```php
      protected $middlewareGroups = [
          // ...
          'web' => [
              // ...
              \App\Http\Middleware\CacheHeaderMiddleware::class,
          ],
      ];
   ```
   
4. Test the configuration.

   - Open your Laravel application in a browser and check the response header for <code>Cache-Control</code>. You should see the value as <code>public, max-age=xxx</code>, where 'xxx' represents the expiration time in seconds.

In conclusion, configuring Cache-Control headers globally in Laravel 5 is a straightforward process that involves creating a middleware to handle these settings, registering it within your application, and applying it to suitable routes. By following these steps, you can ensure faster page loading times, improved security, and more efficient caching mechanisms for your Laravel application. To learn more about this topic or explore other technical concepts, visit https://laravelcompany.com/blog/.
