---
title: "Handling expired token in Laravel"
description: "Title: Seamlessly Handling Expired Tokens in Laravel Applications Introduction: In modern applications, authentication is an essential aspect for ensuring..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Seamlessly Handling Expired Tokens in Laravel Applications

Introduction:
In modern applications, authentication is an essential aspect for ensuring user security. However, sometimes tokens expire or get invalidated, leading to the dreaded "TOKEN MISMATCH" error. As a developer, you need to handle such scenarios gracefully while ensuring that the user experience remains optimal. In this comprehensive blog post, we will discuss various ways to handle expired tokens in Laravel applications and provide code examples where relevant.

Handling Token Expiration in Laravel:

1. Implementing Session-based Tokens:
Laravel provides a built-in mechanism for creating session-based tokens using the CSRF token. By default, these tokens are generated when you create a fresh application and stored in the user's browser cookies or sessions. However, it is essential to update your routes and middleware configuration to ensure the appropriate validation occurs when processing requests.

2. Updating Routes for Token Validation:
Add the 'csrf_token' attribute to all your relevant forms and AJAX request forms as follows:
```php
<form method="POST" action="/create-user">
    {{ csrf_field() }}
    ...
</form>
```

3. Updating Middleware Configuration for Token Validation:
To ensure token validation across your application, update the 'VerifyCsrfToken' middleware configuration in the "app/Http/Kernel.php" file:
```php
protected $middleware = [
    ...,
    \App\Http\Middleware\CheckForMaintenanceMode::class,
    \Illuminate\Session\Middleware\StartSession::class,
    'VerifyCsrfToken',
];
```

4. Updating Routes for Token Re-Validation:
To handle expired tokens gracefully and avoid the "TOKEN MISMATCH" error, you can create a custom route that revalidates the token when it expires or is invalidated. Include this route in your application's routing configuration file:
```php
Route::group([], function () {
    Route::post('token/refresh', 'TokenController@refresh');
});
```

5. Implementing Token Refresh Functionality:
The "TokenController" class should include a "refresh()" method that handles token expiry and re-authenticates the user upon successful validation.
```php
<?php
namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;

class TokenController extends Controller
{
    public function refresh()
    {
        if (request()->ajax()) {
            // Attempt to validate the token
            try {
                request()->validate(['_token' => 'required']);
            } catch (ValidationException $e) {
                return response()->json([], 422);
            } catch (AuthenticationException $e) {
                return response()->json(["error" => "TOKEN MISMATCH"], 401);
            }

            // Generate a new CSRF token and refresh the cookie
            Cookie::queue('_token', csrf_token(), null, '/');

            return response()->json(['success' => true], 200);
        }
    }
}
```

6. Handling Token Refresh in AJAX Requests:
Now that you have your token refresh functionality ready, you need to modify the relevant Ajax request code to handle expired tokens. Ensure that when a TOKEN MISMATCH error occurs, the user is redirected to the token refresh page and their previous request is resubmitted with the fresh token.
```javascript
// Original AJAX request code
$.ajax({
    method: "POST",  // or other methods as needed
    url: "/create-user",
    data: { name: 'John Doe', email: 'john@example.com' },
    success: function (response) {
        alert('Successfully created user!');
    },
    error: function (error) {
        if (error.status === 422 || error.status === 401) {
            window.location.href = '/token/refresh';
            $.ajax({
                method: "POST",
                url: "/create-user",
                data: { name: 'John Doe', email: 'john@example.com' },
                success: function (response) {
                    alert('Successfully created user!');
                }
            });
        }
    }
});
```

Conclusion:
Handling expired tokens in Laravel applications can be achieved through various methods, such as implementing session-based tokens, updating routes and middleware configurations, and adding token refresh functionality. By following these steps, you ensure a smooth user experience while maintaining high security standards for your application.
