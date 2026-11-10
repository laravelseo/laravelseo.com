---
title: "disable csrf in laravel for specific route"
description: "Title: Effectively Disabling CSRF for Specific Routes in Laravel Applications Introduction When building web applications, ensuring the right level of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Effectively Disabling CSRF for Specific Routes in Laravel Applications

Introduction
When building web applications, ensuring the right level of security is very critical. One such essential layer of protection is Cross-Site Request Forgery (CSRF) prevention. Laravel comes with a powerful built-in middleware to help mitigate CSRF attacks. However, in some cases, you may need to disable this feature for specific routes or improve existing solutions due to unique circumstances, like the one described in the given code example.

Understanding CSRF Protection in Laravel
Laravel's default CSRF middleware provides a token to prevent unauthorized users from submitting forms or making requests that could harm your application. This mechanism ensures only authenticated and authorized access. However, there could be exceptions where you might need to disable this feature for a specific route.

Disabling CSRF for Specific Routes Using Middleware
The best approach is to use middleware to control the flow of requests and ensure the appropriate security measures for each route. To disable CSRF protection for a particular route, follow these steps:

1. Create a custom middleware called 'DisableCsrfForSpecificRoute' with the contents shown below:

```php
namespace App\Http\Middleware;

use Closure;

class DisableCsrfForSpecificRoute
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
        if ($request->is('your_specific_route')):
            // Disable CSRF protection for this specific route.
            config(['app.csrf' => false]);

            return $next($request);
        else:
            // Continue with standard Laravel CSRF middleware.
            return app('Illuminate\Cookie\Foundation\Facades\Cookie')->forget('XSRF-TOKEN');
        endif;
    }
}
```
In this code, we first check whether the request is for the specific route you want to disable CSRF protection for. If it's a match, we set the 'app.csrf' configuration to false, which disables CSRF protection specifically for this route and enables the subsequent API calls. For all other requests, the standard Laravel CSRF middleware is run with the cookie XSRF-TOKEN being forgotten (cleared) before proceeding.

2. Register your custom middleware in the 'app/Http/Kernel.php' file. Add this line to the 'web' middleware group:

```php
'DisableCsrfForSpecificRoute',
```

3. Apply your newly registered route to the controller action:

```php
public function Ok(Request $request)
{
    // Your code here
}

Route::get('/payment/ok', 'TransactionsController@Ok')->middleware('DisableCsrfForSpecificRoute');
```

Alternatives and Better Solutions
While disabling CSRF protection for a specific route can be useful in some cases, it's always preferable to try alternative approaches first. For example, you could consider the following strategies:

- Use the 'sameSite' cookie attribute to prevent Cross-Site Scripting attacks without removing cross-site request forgery completely (https://laravelcompany.com/blog/csrf-protection-and-cookies-in-laravel).
- Leverage API tokens instead of CSRF cookies for authentication of user requests, especially in cases where you need to communicate with a 3rd party service (https://laravelcompany.com/blog/authenticating-api-requests-in-laravel).

Conclusion
By following the steps above or exploring alternative strategies, you can effectively manage your application's CSRF protection and ensure the right level of security for various use cases while maintaining optimal user experience. Remember that Laravel provides numerous tools to keep your application secure, so it's always vital to explore their capabilities before implementing custom solutions. Happy coding!
