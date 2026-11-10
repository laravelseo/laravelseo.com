---
title: "Disable rate limiter in Laravel?"
description: "Title: Disable Rate Limiter in Laravel: A Comprehensive Guide for Developers Rate limiting is an essential security measure in web applications to prevent..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Disable Rate Limiter in Laravel: A Comprehensive Guide for Developers

<p>Rate limiting is an essential security measure in web applications to prevent unauthorized access attempts and denial of service (DoS) attacks. However, sometimes developers need to test endpoints that receive a large number of requests or handle sensitive information. In such cases, disabling rate limiting on specific routes can be helpful in order to streamline the testing process. This blog post will dive into the details of how and when to disable rate limiting in Laravel applications.</p>

<h2>Understanding Rate Limiting in Laravel</h2>
<p>Rate limiting is a built-in feature in Laravel that uses middleware to limit the number of requests per unit time for a specific route. It helps avoid potential problems such as resource exhaustion or DoS attacks by ensuring only a limited number of concurrent requests are processed at any given time.</p>

<h2>Enabling and Configuring Rate Limiter in Laravel</h2>
<p>Developers can enable rate limiting by adding the <code>Illuminate\RateLimiting\Limit</code> middleware to their routes. By default, Laravel uses a 10-minute sliding window and a maximum of 60 requests per minute. The rate limit configuration is located in the <code>\config\rate\_limiter.php</code> file.</p>
<pre><code class="language-php"><?php

use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Requests;
use Illuminate\Routing\Router;

// ...

Route::get('/test', function (Request $request) {
    // Rate limiting configuration example
    RateLimiter::for('api_requests')->limit(60)->setExpireIn(10 * 60);
});
?></code></pre>
<p>The code above sets the maximum number of requests to 60 within a 10-minute sliding window for the specified 'api_requests' key. This ensures that only 60 requests per 10 minutes are allowed.</p>

<h2>Disabling Rate Limiting on Specific Routes</h2>
<p>Often, developers need to disable rate limiting for a specific endpoint to run tests or handle sensitive information securely. To achieve this, we need to use middleware groups and override the default configuration file. Here's how it can be done:</p>
<pre><code class="language-php"><?php

use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Requests;
use Illuminate\Routing\Router;

// Create a new middleware group and set rate limiting off for it
$apiMiddlewareGroup = (new MiddlewareGroup(
    'disable_rate_limiter',
    [
        RateLimiting::class => ['except' => Route::current()->getRouteAction()['as']],
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Auth\Middleware\Authenticate::class,
        // Add additional middleware if needed
    ]
));

// Define a new route group for the disabled rate limiting condition
Route::group($apiMiddlewareGroup, function () {
    Route::get('/test', function (Request $request) {
        // Your test endpoint code without rate limiting concerns
    });
});

// Override the default rate limiter configuration file with a new one that has disabled rate limiting for 'api_requests' key
$config = config('rate_limiter');
$config['limits'] = array_merge($config['limits'], [
    'disable_rate_limiter.api_requests' => [
        'sliding_window' => 10,
        'period'         => 60,
        'limit'          => -1,
    ],
]);
config([
    'rate_limiter' => $config,
]);
?></code></pre>
<p>The above code examples show how to disable rate limiting for a specific route group and then override the default configuration file by setting the specified key to have an unlimited number of requests. This ensures that the endpoint within this route is not affected by rate limiting while other routes remain protected.</p>

<h2>Testing Endpoints with Disabled Rate Limiting</h2>
<p>Now that you have disabled rate limiting for your test endpoint, you can safely test and run tests without encountering any 429 error responses. However, it is essential to keep in mind the appropriate use of this feature and not leave these disabled settings live on production servers.</p>

<h2>Conclusion</h2>
<p>Disabling rate limiting for specific routes can be a vital practice when testing or handling sensitive data endpoints. By following the steps outlined in this blog post, you can effectively disable rate limiting in your Laravel application while maintaining the security of other routes. Remember to always test thoroughly and practice good application security measures to keep your users' data safe.</p>
<p><strong>Laravel Tips:</strong> For more information on disabling rate limiting for specific routes or further exploration of security best practices in Laravel, be sure to check out our comprehensive tutorials on the <a href="https://laravelcompany.com/">Laravel Company</a>'s website.</p>
