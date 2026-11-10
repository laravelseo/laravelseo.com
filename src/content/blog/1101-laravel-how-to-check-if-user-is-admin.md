---
title: "Laravel: How to check if user is admin?"
description: "Title: Laravel: Efficiently Checking User Role for Admin Privileges Introduction: In modern web development, user roles and permissions play an important..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Laravel: Efficiently Checking User Role for Admin Privileges

Introduction: In modern web development, user roles and permissions play an important role in ensuring the security of your application. Laravel provides various ways to check if a user is an administrator or not. In this blog post, we'll discuss different approaches to implement admin privileges checking using Laravel.

1. Using Auth::check() with Conditional Statements

Your current code example utilizes the Auth::check() method to check whether a user is logged in. However, it doesn't specify if the user is an administrator or not. To accomplish this, you can combine the Auth::check() with conditional statements like:

<pre><code>@if(Auth::check() && auth()->user()->isAdmin())
   &lt;p&gt;&lt;a href="#" class="btn btn-success" role="button"&gt;Edite&lt;/a&gt; &lt;a href="#" class="btn btn-danger" role="button"&gt;Remove&lt;/a&gt;&lt;/p&gt;
@endif
</code></pre>

In this code, we first check if the user is logged in (Auth::check()) and then verify their admin status using auth()->user()->isAdmin(). If both conditions are satisfied, it shows the buttons for editing and removing products.

2. Using Middleware to Handle Admin Privileges

Using middleware can provide better control over accessing specific routes and actions based on user roles. You need to create a custom role-based middleware class:

<pre><code>namespace App\Http\Middleware;

class CheckAdminRole implements Middleware {
   /**
    * Handle an incoming request.
    */
   public function handle($request, Closure $next)
   {
      if (auth()->user() && auth()->user()->isAdmin()) {
         return $next($request);
      }

      abort(403, 'You do not have sufficient privileges.');
   }
}
</code></pre>

In this middleware class, we first check if the user is logged in and has an admin role. If so, we pass the request to the next controller or route. Otherwise, we display a 403 error message (Forbidden). To use this middleware, add it to your Kernel file:

<pre><code>/**
 * The application's RouteServiceProvider.
 */
class RouteServiceProvider extends ServiceProvider {
   /**
    * Define your route model bindings, "wildcard" routes or other custom routing settings.
    */
   public function boot() {
       parent::boot();

       // Apply the middleware to specified routes
       Route::middleware('web')->group(function () {
           Route::prefix('admin')->group(function () {
               // Admin-only routes here
               Route::get('/products/edit/{product}', 'ProductController@edit');

               // Normal user's routes
               Route::get('/', function () { ... });
           });
       });
   }
}
</code></pre>

In this example, we added the CheckAdminRole middleware to the admin routes prefix using RouteServiceProvider. This ensures that only administrators can access specific actions like editing or removing products.

Conclusion: To effectively handle users' role-based features, Laravel provides various approaches. In your case, you can use either auth::check() with conditional statements or utilize middleware to check admin privileges before allowing access. Keep in mind that both methods involve writing custom logic for checking the user's role and providing appropriate actions based on their permissions. Remember to structure your code effectively and maintain security standards when implementing these solutions. For further guidance, refer to Laravel documentation (https://laravel.com/docs/8.x/authentication#role-based-authentication) or consult with experienced developers from reputable companies like https://laravelcompany.com/.
