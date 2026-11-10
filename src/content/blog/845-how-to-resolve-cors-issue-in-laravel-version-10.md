---
title: "How to resolve cors issue in laravel version 10"
description: "Title: Tackling CORS Issues in Laravel Version 10: Alternative Solutions and Best Practices Introduction: Laravel is an amazing PHP framework that enables..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Tackling CORS Issues in Laravel Version 10: Alternative Solutions and Best Practices

Introduction:
Laravel is an amazing PHP framework that enables developers to build powerful applications with ease. However, while upgrading from one version to another, you may encounter various issues, including CORS (Cross-Origin Resource Sharing) problems. In this blog post, we'll discuss how to resolve such issues in Laravel Version 10 and explore alternative solutions.

Understanding Cross-Origin Resource Sharing:
CORS is a security measure implemented by web browsers to prevent malicious websites from accessing resources (e.g., images, videos, XMLHttpRequests) of another website. It allows only specific domains or origins to interact with your website's resources and protects against cross-site scripting attacks.

Resolving CORS Issues in Laravel Version 10:
Upon upgrading from Laravel Version 9 to 10, you might have removed the fruitcake/cors package that used to handle CORS for you. Don't worry; there are alternative solutions available to tackle this issue:

1. Using Lumen as a Middleware:
Laravel's smaller and simpler sister framework, Lumen, can be leveraged for handling CORS. By creating an API route group in your Laravel project, you can define specific routes that will run on Lumen. Here's how to set it up:
- Create a new folder called "lumen" inside your app directory.
- Inside this folder, create the laravel_api.php file with the following content:
    ```php
    <?php

    // Start the Lumen API application
    require __DIR__ . '/../bootstrap/start.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    use Illuminate\Routing\RouteGroup;

    Route::group(['prefix' => '/', 'middleware' => ['cors']], function () {
        // Your Lumen API routes go here
    });

    $handler = $app->handle();
    echo $handler;
    ```
- In your Laravel project, create a CORS middleware to handle the necessary headers and options:
   ```php
   <?php

   namespace App\Http\Middleware;

   use Illuminate\Foundation\Support\Providers\RouteServiceProvider;

   class CORSMiddleware
   {
       public function handle($request, Closure $next)
       {
           return response()->json(['success' => true], 200)
               ->header('Access-Control-Allow-Origin', '*')
               ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
               ->header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Accept, Authorization, X-CSRF-Token');
       }
   }
   ```
    - In your project's AppServiceProvider.php, add the CORS middleware to the $routeMiddleware array:
        ```php
        <?php

        namespace App\Providers;

        use Illuminate\Support\Facades\Route;
        use Illuminate\Foundation\Application;
        use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

        class AppServiceProvider extends ServiceProvider
        {
            /**
             * Register any application services.
             */
            public function register()
            {
                // ...
            }

            /**
             * Bootstrap any applications services.
             */
            public function boot()
            {
                $this->registerCORS();
            }

            private function registerCORS()
            {
                Route::middleware('cors')->group(function () {
                    // Your laravel routes go here
                });
            }
        }
        ```
- Finally, update your `.env` file for the CORS settings (as per your preferences):
       ```php
       ALLOW_CORS=true
       CORS_ORIGINS=* // Set this to specific domains if needed
       ```
   - Now, define a Lumen API route group in your Laravel project:
      ```php
      <?php

      namespace App\Http\Routes;

      use Illuminate\Routing\RouteGroup;
      use Illuminate\Support\Facades\Route;

      Route::group([], function () {
          // Your API routes go here
      });
      ```

2. Using Laravel's Built-in CORS Support:
   Laravel 10 provides built-in CORS support using the `cors` middleware. To leverage this feature, simply add the "cors" key to your $routeMiddleware array in AppServiceProvider.php and define a route group for your API routes:
      ```php
      <?php

      namespace App\Providers;

      use Illuminate\Support\Facades\Route;
      use Illuminate\Foundation\Application;
      use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

      class AppServiceProvider extends ServiceProvider
      {
          /**
           * Register any application services.
           */
          public function register()
          {
              // ...
          }

          /**
           * Bootstrap any applications services.
           */
          public function boot()
          {
              $this->registerCORS();
          }

          private function registerCORS()
          {
              Route::middleware(['cors'])->group(function () {
                  // Your laravel routes go here
              });
          }
      }
      ```
   - Finally, configure the CORS settings in your `.env` file:
       ```php
       ALLOW_CORS=true
       CORS_ORIGINS=* // Set this to specific domains if needed
       ```

Conclusion:
Handling CORS issues in Laravel Version 10 is crucial for enabling cross-origin interactions with your website's resources. While the fruitcake/cors package has been replaced, there are alternative solutions available, such as using Lumen or Laravel's built-in CORS support. By following these steps and configuring your project accordingly, you can ensure secure and efficient communication between your application and external services.
