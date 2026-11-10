---
title: "Make session expiration redirect back to login?"
description: "When dealing with session expiration redirection back to login page in Laravel applications, there are several ways to achieve this. The first is to use..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

When dealing with session expiration redirection back to login page in Laravel applications, there are several ways to achieve this. The first is to use middleware or a filter to handle incoming requests and redirect accordingly based on authentication status. A simple example of such a class could be as follows:

```php
<?php namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;

class Authenticate {
    /**
     * The Guard implementation.
     *
     * @var Guard
     */
    protected $auth;

    /**
     * Create a new filter instance.
     *
     * @param  Guard  $auth
     * @return void
     */
    public function __construct(Guard $auth)
    {
        $this-&gt;auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($this-&gt;auth-&gt;guest())
        {
            if ($request-&gt;ajax())
            {
                return response('Unauthorized.', 401);
            }
            else
            {
                // return redirect()-&gt;guest('auth/login');
                return redirect()->guest('/');
            }
        }

        return $next($request);
    }

}
```

This middleware class ensures that if the user is authenticated (authenticate returns true), it will allow normal page access. However, if they are not logged in (authenticate returns false or guest()), it will redirect them to the specified URL. In this case, we've used '/' as the redirection URL, which assumes you have a login page set up at the root of your application ("/").

Alternatively, to ensure that your users are redirected back to their dashboard after logging in, you can use the Laravel Guard for authentication and session management. By default, Laravel automatically redirects authenticated users to the home URL (specified in config/app.php). If you want a different redirection URL for specific users, like users of your application, consider using a 'web' middleware group and registering appropriate routes:

```php
<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['middleware' => ['web']], function () {
    // your routes here
});
```

In this case, you'll have to create a dedicated login route for users:

```php
<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
 A default HTTP response (JSON, HTML) does not require authentication.
 You may change this default response by providing your own Closure.
|
*/

Route::get('/', function () { return view('welcome'); });

// Add custom login route for users
Route::post('user-login', 'UserController@doLogin')->name('userLogin');
```

Finally, to redirect users back to their dashboard after successful authentication, you'll need a controller method:

```php
<?php

namespace App\Http\Controllers;

class UserController extends Controller {
    /**
     * Handle an incoming user login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function doLogin(Request $request)
    {
        if (Auth::attempt($request->only('email', 'password'))) {
            // Authentication passed...
            return redirect()->route('userDashboard');
        }
        return back()->withErrors([
            'error' => 'Invalid credentials.'
        ]);
    }
}
```

Note that the 'LoginController@authenticated' method should also be updated to handle appropriate redirection, depending on whether the user is an admin or a regular user. Also, remember to secure your routes using middleware as required according to Laravel best practices.
