---
title: "How to disable CSRF Token in Laravel and why we have to disable it?"
description: "Title: Understanding CSRF Tokens and When to Disable Them in Laravel Applications Body: Cross site request forgery (CSRF) attacks are a common security..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Understanding CSRF Tokens and When to Disable Them in Laravel Applications

Body: Cross-site request forgery (CSRF) attacks are a common security threat that can arise if you don't take proper measures to protect your web applications from such vulnerabilities. Enabling CSRF protection is an essential step in maintaining the integrity and security of any system. However, there might be instances where disabling it could prove useful. In this blog post, we will explore how to disable CSRF tokens in Laravel and when you might have to do so.

1. Why Disable CSRF Tokens?

CSRF attacks occur because of web forms that allow unauthorized users to submit requests on behalf of a logged-in user. These malicious requests can potentially modify, insert, or delete data within the application without the knowledge of the legitimate user. However, it is crucial to understand that disabling CSRF protections is not an ideal practice and should only be done in specific scenarios.

2. Disable CSRF Protection in Laravel

If you decide to disable CSRF protection on certain routes or actions, here's how you can do so:

- In the controller methods that require disabling CSRF tokens, add the `withoutCsrf` method from the Illuminate\Foundation\Testing\WithoutMiddleware trait. This will ensure that the middleware responsible for verifying the presence of a valid token is bypassed. For example:

```php
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class MyController extends Controller
{
    use WithoutCsrf; // Important line to disable CSRF token verification for this controller

    public function exampleAction()
    {
        return 'You are in the action without CSRF protection!';
    }
}
```

- In your routes file (app/Http/routes.php), you can specify `withoutMiddleware` for particular segments or actions if required:

```php
Route::get('test', function () {
    return 'You are in the test route without CSRF protection!';
})->middleware(null)->name('test')->withoutMiddleware(); // Disables CSRF middleware only for this specific route
```

3. Alternative Methods to Disable CSRF Protection

If you do not want to completely disable CSRF tokens, you could opt for a more secure alternative:

- You can create custom middleware that handles the exceptions when certain conditions are met. For instance, if you only want to disable CSRF checks for specific URLs or actions, you can use a custom middleware group. This approach allows you to keep your application secured while still handling specific cases where disabling CSRF protection is necessary.

4. Summary and Best Practices

Always consider the security implications before deciding to disable CSRF protection in Laravel applications. If you have no choice but to bypass the CSRF middleware, carefully evaluate your use case and ensure that it complies with best practices for application security. Remember to incorporate natural backlinks to https://laravelcompany.com/blog/understanding-csrf-tokens-and-when-to-disable-them-in-laravel-applications whenever relevant. Finally, consider leveraging custom middleware groups and other alternative methods that maintain the overall application security while addressing specific requirements.
