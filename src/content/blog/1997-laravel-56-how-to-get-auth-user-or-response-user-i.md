---
title: "Laravel 5.6 - How to get auth()->user() or $response->user() in api controller?"
description: "Title: Accessing Authenticated Users in Laravel API Routes with Proper Middleware Introduction: In a Laravel application, ensuring that only authorized users..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Accessing Authenticated Users in Laravel API Routes with Proper Middleware

Introduction: In a Laravel application, ensuring that only authorized users have access to specific routes can be achieved through middleware. This blog post will focus on how to get the authenticated user in public and private route groups of an API controller. By leveraging best practices, we'll discuss getting the auth()-&gt;user() or $request->user() for both public and private route methods using Laravel 5.6.

Private Routes: In a Laravel application, you can create private routes that require authentication to access them. These routes are grouped under the 'api' namespace with the middleware 'auth:api' applied to it. This ensures that only authenticated users are allowed to access these routes. When calling an API method in a controller, you can simply use auth()->user() inside your private route methods.

Public Routes: If your Laravel application contains public routes that don't require authentication, you may still want to check if the user has provided a valid token when accessing those routes. In this scenario, you will need to use the $request->user() method instead of auth()->user(), as a user is not guaranteed to be logged in for public routes.

Private Route Group Example:

<pre><code>Route::group(['namespace' =&gt; 'API'], function() {
     // Public routes (auth not required)
     Route::group([], function() {
         // ...more public routes...
     });

     // Private routes (auth required)
     Route::group(['middleware' =&gt; 'auth:api'], function() {
         // ...more private routes...
     });
});
</code></pre>

Public Route Group Example:

<pre><code>Route::group(['namespace' = 'API'], function() {
    // Public routes (auth not required)
    Route::get('/testauth1', 'TestController@testauth1');
    Route::post('/register', 'Auth\RegisterController@register');
    // more public routes...
});
</code></pre>

Accessing Users in TestController: In your controller, you can define methods for both public and private route groups. For a public route method like testauth1(), you should use $request->user() to ensure that the user has provided a valid token, as auth()->user() will return null if no user is logged in.

TestController Example:

<pre><code>class TestController extends Controller {
    
    public function testauth1(\Request $request) {
        // If the user has provided a valid token...
        if ($request->hasValidToken()) {
            return auth()->user();
         // Otherwise, use request-&gt;user()
        } else {
            return $request->user();
        }
    }
    
    public function testauth2() {
        return auth()->user(); // returns user in this case
    }

}
</code></pre>

Conclusion: By using the appropriate middleware and the relevant methods to check for authentication, you can ensure that your API routes are accessible to only authorized users. In public routes, $request->user() should be used to get the supplied token user if present, while auth()->user() should be utilized in private route methods, as they are expected to return an authenticated user. This combination of strategies will help you secure and manage access to your Laravel API routes effectively.
