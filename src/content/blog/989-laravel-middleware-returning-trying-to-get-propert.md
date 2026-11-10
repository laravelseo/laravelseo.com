---
title: "Laravel middleware returning (Trying to get property 'headers' of non-object) error"
description: "Title: Resolving Laravel Middleware Returning (Trying to get property 'headers' of non object) Error Body: Developing robust applications using Laravel is an..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

Title: Resolving Laravel Middleware Returning (Trying to get property 'headers' of non-object) Error

Body: <p>Developing robust applications using Laravel is an exciting journey, but it does come with its share of challenges. One such issue that frequently arises is the "trying to get property 'headers' of non-object" error when wrapping a resource route around our custom middleware. This problem can be tricky at first glance, but with proper understanding and troubleshooting steps, it can be easily resolved.</p>

<p>The Laravel documentation provides us with the <strong>Closure</strong> function for defining the middleware handling logic. In this case, our custom middleware 'Officer' checks if the authenticated user has a specific role of 'title_officer'. If they do, the next() method is called, allowing the request to proceed; otherwise, it does not call the next method and redirects to an appropriate route based on the current user role. The resource route for our controller is also set up with the 'officer' middleware.</p>

<p><strong>Why are we getting this error?</strong></p>

This problem occurs because, in some cases, the $request variable in the middleware may not have a valid instance of Request or Response class. In our case, the exception is thrown due to accessing the 'headers' property on a non-object, which means that the request object is not set up correctly. This can happen for various reasons, like if the request doesn't carry header information or when you need to process requests without headers. The possible causes of this error may include:

1. Missing or incorrect configuration in Laravel's CSRF token validation.
2. Improper setup of the middleware class path and function signature.
3. Outdated or incorrect application state during execution.
4. Invalid request object within the closure, causing non-object errors when accessing its properties.

<p><strong>How to fix it?</strong></p>

The first step towards resolving this issue is ensuring that your middleware function arguments are properly set up. In our code example, the 'next' ($next) should be a callback and not a Closure in its parameter definition. To remedy this, replace:

<pre><code>&#039;&lt;?php
    namespace App\Http\Middleware;

    use Closure;
    use Auth;

    class Officer
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
            if (Auth::check() &amp;&amp; Auth::user()-&gt;role == 'title_officer') {
                return $next($request);
            }
            // elseif (Auth::check() &amp;&amp; Auth::user()-&gt;role == 'agent') {
            //     return redirect('/agent');
            // }
            // else {
            //     return redirect('/customer');
            // }
        }
    }
</code></pre>

With:
<pre><code>&lt;?php
    namespace App\Http\Middleware;

    use Closure;
    use Auth;

    class Officer
    {
        /**
         * Handle an incoming request.
         *
         * @param  \Illuminate\Http\Request  $request
         * @param  \Closure  $next
         * @return mixed
         */
        public function handle($request, Closure $callback)
        {
            if (Auth::check() &amp;&amp; Auth::user()-&gt;role == 'title_officer') {
                return $callback($request);
            }
            // elseif (Auth::check() &amp;&amp; Auth::user()-&gt;role == 'agent') {
            //     return redirect('/agent');
            // }
            // else {
            //     return redirect('/customer');
            // }
        }
    }
</code></pre>

In this modified code, we've changed the $next variable to a callback named $callback, which ensures that it is compatible with our Laravel application. After this change, you should not face the "trying to get property 'headers' of non-object" error anymore. However, it's always advisable to double-check your middleware logic and ensure there are no more issues in your code.

In summary, to fix the "trying to get property 'headers' of non-object" error due to wrapping a resource route in a custom Laravel middleware, verify that your middleware function arguments are set up correctly and check for potential configuration or application state problems. With proper troubleshooting and a keen eye for detail, you can confidently resolve this issue and continue developing your Laravel applications.

For more insights on Laravel development and troubleshooting techniques, visit https://laravelcompany.com/.
