---
title: "Laravel 5.2 CORS, GET not working with preflight OPTIONS"
description: "Title: Tackling Laravel 5.2 CORS Issues with GET and OPTIONS Requests Introduction: Cross Origin Resource Sharing (CORS) errors can be frustrating and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Tackling Laravel 5.2 CORS Issues with GET and OPTIONS Requests

Introduction: Cross Origin Resource Sharing (CORS) errors can be frustrating and difficult to troubleshoot, especially when dealing with Laravel API endpoints. In this blog post, we will discuss common CORS issues, such as the GET method not working properly alongside preflight OPTIONS requests in Laravel 5.2, along with best practices for solving these problems.

Background: CORS is a mechanism that allows restricted resources on a web page to be requested from another domain, originating from another domain than the one the browser is currently visiting. It helps prevent cross-site request forgery or information leakage by ensuring that only authorized requests are allowed access to specific resources. Laravel provides built-in CORS functionality which can be extended using middleware and HTTP headers to secure your API endpoints while allowing access from different domains.

Common Issues: The dreaded CORS error can occur when a preflight OPTIONS request fails, resulting in the browser blocking the cross-origin request for additional data. In Laravel 5.2, if the GET method doesn't work with preflight OPTIONS requests, it may indicate an issue within the CORS middleware or HTTP headers configuration.

Causes and Solutions: To solve this problem, first ensure that the `Cors` middleware is present in your Laravel Kernel file (`App\Http\Kernel.php`) under the "protected $routeMiddleware" array:

<pre><code> protected $routeMiddleware = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
    'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
    'cors' => \App\Http\Middleware\CORS::class
];
</code></pre>

Next, create your custom CORS middleware class (`app/Http/Middleware/CORS.php`) and add the relevant code for handling the preflight OPTIONS request:

<pre><code> public function handle($request, Closure $next)
    {
        header('Access-Control-Allow-Origin: *');

        // ALLOW OPTIONS METHOD
        $headers = [
            'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Origin, Authorization'
        ];
        if ($request->getMethod() == "OPTIONS") {
            // The client-side application can set only headers allowed in Access-Control-Allow-Headers
            return Response::make('OK', 200, $headers);
               }

        $response = $next($request);
        foreach ($headers as $key => $value)
            $response->header($key, $value);
        return $response;
    }
</code></pre>

In your Laravel route file (`app/Http/Routes.php`), ensure that the CORS middleware is being applied to the desired route:

<pre><code> $router-&gt;group(['prefix' =&gt; 'api', 'middleware' =&gt; 'cors'], function ($router) {
    $router-&gt;get('/test', 'MyController@myMethod');
});
</code></pre>

If you use the Vue.js framework, make sure that your app is configured to handle CORS correctly by adding the appropriate HTTP headers in the Vue instance:

<pre><code> new Vue({
        el: '#app',
        data: {
           //data here
        },
        http: {
            headers: {
                "Authorization": "Basic " + "apiKeyHere"
            }
        },
        methods: {
            mymethod: function (e)
            {
                e.preventDefault();
                this.$http.get('http://localhost/mysite/api/test').then(
                        function (response)
                        {
                          //do something
                        }
                )
            }
        }
    });
</code></pre>

If you still experience issues, double-check your `.htaccess` file to ensure that the correct headers are being set for authorized requests:

<pre><code> RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
</code></pre>

Conclusion: With proper configuration, the GET method should work with preflight OPTIONS requests in Laravel 5.2 without any CORS issues. Make sure to utilize the built-in Laravel CORS middleware and HTTP headers to secure your API endpoints while allowing access from different domains as needed. Feel free to reach out if you need further help or require additional assistance with troubleshooting these issues in your application.
